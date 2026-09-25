import { Inject, Injectable, Optional } from '@nestjs/common';
import * as fs from 'fs';
import maxmind, { CountryResponse, Reader } from 'maxmind';
import { GEOIP_OPTIONS, GeoIpPluginOptions } from '../types/geoip.types';
import {
    CountryMetadata,
    COUNTRY_METADATA_REGISTRY,
    getCountryMetadata,
} from '../constants/country-metadata';

export interface CacheEntry {
    country: string | null;
    expiresAt: number;
}

export interface GeoIpResolutionResult {
    ip: string;
    isPrivate: boolean;
    detectedCountry: string | null;
    countryName: string;
    marketCode: string;
    urlPrefix: string;
    atelier: string;
    hubCode: string;
    currency: string;
    tierUsed: string;
    latencyMs: number;
    cached: boolean;
    metadata?: CountryMetadata | null;
}

export interface GeoIpStats {
    cacheEntriesCount: number;
    maxmindLoaded: boolean;
    maxmindDbPath: string | null;
    fallbackApiEnabled: boolean;
    totalLookups: number;
    cacheHits: number;
    tier0Hits: number;
    tier1Hits: number;
    tier2Hits: number;
}

export interface FlushGeoIpCacheResult {
    success: boolean;
    clearedEntries: number;
    message: string;
}

const COUNTRY_MAP: Record<string, { name: string; market: string; urlPrefix: string; atelier: string; hub: string; currency: string }> = {
    BD: { name: 'Bangladesh', market: 'bd', urlPrefix: '/bd/', atelier: 'Narayanganj Atelier', hub: 'BD_HUB', currency: 'BDT ৳' },
    IN: { name: 'India', market: 'in', urlPrefix: '/in/', atelier: 'Varanasi Atelier', hub: 'IN_HUB', currency: 'INR ₹' },
    AE: { name: 'United Arab Emirates', market: 'ae', urlPrefix: '/ae/', atelier: 'Gulf & Middle East Atelier', hub: 'DUAL_HUB', currency: 'AED د.إ' },
    US: { name: 'United States', market: 'global', urlPrefix: '/', atelier: 'Global Export Atelier', hub: 'DUAL_HUB', currency: 'USD $' },
    GB: { name: 'United Kingdom', market: 'global', urlPrefix: '/', atelier: 'Global Export Atelier', hub: 'DUAL_HUB', currency: 'USD $' },
};

export function isPrivateOrLocalIp(ip: string): boolean {
    if (!ip) return true;
    const clean = ip.trim();
    if (
        clean === '127.0.0.1' ||
        clean === '::1' ||
        clean === 'localhost' ||
        clean.startsWith('::ffff:127.0.0.1')
    ) {
        return true;
    }
    if (clean.startsWith('10.')) return true;
    if (clean.startsWith('192.168.')) return true;
    if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(clean)) return true;
    if (clean.startsWith('fc00:') || clean.startsWith('fe80:')) return true;
    return false;
}

export function isValidIsoCountry(code: string | null | undefined): boolean {
    if (!code || typeof code !== 'string') return false;
    const clean = code.trim().toUpperCase();
    if (clean === 'XX' || clean === 'T1' || clean.length !== 2) return false;
    return /^[A-Z]{2}$/.test(clean);
}

@Injectable()
export class GeoIpHybridService {
    private maxmindReader: Reader<CountryResponse> | null = null;
    private maxmindInitPromise: Promise<Reader<CountryResponse> | null> | null = null;
    private loadedDbPath: string | null = null;
    private cache = new Map<string, CacheEntry>();
    private readonly cacheTtlMs: number;
    private readonly failureTtlMs = 5 * 60 * 1000; // 5 mins for failed lookups
    private readonly maxCacheSize = 10000;
    private readonly fallbackApiEnabled: boolean;
    private readonly customDbPath?: string;
    private readonly allowMockHeaders: boolean;

    // Telemetry & metrics counters
    private totalLookups = 0;
    private cacheHits = 0;
    private tier0Hits = 0;
    private tier1Hits = 0;
    private tier2Hits = 0;

    constructor(
        @Optional()
        @Inject(GEOIP_OPTIONS)
        private options?: GeoIpPluginOptions
    ) {
        this.cacheTtlMs = options?.cacheTtlMs ?? 24 * 60 * 60 * 1000; // 24 hours
        this.fallbackApiEnabled = options?.fallbackApiEnabled ?? true;
        this.customDbPath = options?.dbPath;
        this.allowMockHeaders =
            options?.allowMockHeaders ??
            (process.env.APP_ENV !== 'production' && process.env.NODE_ENV !== 'production');
    }

    /**
     * Resolves regional metadata for any ISO country code.
     */
    getCountryMetadata(code: string | null | undefined): CountryMetadata | null {
        return getCountryMetadata(code);
    }

    /**
     * Returns full registry of configured country metadata.
     */
    getAllCountryMetadata(): CountryMetadata[] {
        return Object.values(COUNTRY_METADATA_REGISTRY);
    }

    /**
     * Resolves country ISO code from an incoming Express / Web / Node request.
     */
    async resolveCountry(req: unknown): Promise<string | null> {
        if (!req || typeof req !== 'object') {
            return null;
        }

        this.totalLookups++;

        const request = req as any;
        const headers = request.headers || {};
        const getHeader = (name: string): string | null => {
            if (typeof headers.get === 'function') {
                return headers.get(name) || headers.get(name.toLowerCase());
            }
            const val = headers[name.toLowerCase()] ?? headers[name];
            return Array.isArray(val) ? val[0] : val || null;
        };

        // 1. Check Mock headers (if enabled)
        if (this.allowMockHeaders) {
            const mock =
                getHeader('x-mock-country') ||
                getHeader('x-suisuto-mock-country') ||
                process.env.DEV_MOCK_COUNTRY;
            if (isValidIsoCountry(mock)) {
                this.tier0Hits++;
                return (mock as string).trim().toUpperCase();
            }
        }

        // 2. Check Proxy Headers (CF-IPCountry, X-Country-Code, X-Vercel-IP-Country, etc.)
        const proxyCandidates = [
            'cf-ipcountry',
            'x-country-code',
            'x-geo-country',
            'x-vercel-ip-country',
            'cloudfront-viewer-country',
            'fastly-client-ip-country',
        ];

        for (const h of proxyCandidates) {
            const val = getHeader(h);
            if (isValidIsoCountry(val)) {
                this.tier0Hits++;
                return (val as string).trim().toUpperCase();
            }
        }

        // 3. Extract Client IP
        const clientIp = this.extractClientIp(request, getHeader);
        if (!clientIp || isPrivateOrLocalIp(clientIp)) {
            return null;
        }

        // 4. Check Cache
        const cached = this.cache.get(clientIp);
        if (cached) {
            if (Date.now() < cached.expiresAt) {
                this.cacheHits++;
                return cached.country;
            }
            this.cache.delete(clientIp);
        }

        let country: string | null = null;

        // 5. Tier 1: Local MaxMind MMDB Lookup
        country = await this.lookupMaxMind(clientIp);
        if (country) {
            this.tier1Hits++;
        }

        // 6. Tier 2: Remote IP-API Fallback
        if (!country && this.fallbackApiEnabled) {
            country = await this.lookupRemoteApi(clientIp);
            if (country) {
                this.tier2Hits++;
            }
        }

        // 7. Store in Cache
        if (this.cache.size >= this.maxCacheSize) {
            const oldestKey = this.cache.keys().next().value;
            if (oldestKey) this.cache.delete(oldestKey);
        }

        this.cache.set(clientIp, {
            country,
            expiresAt: Date.now() + (country ? this.cacheTtlMs : this.failureTtlMs),
        });

        return country;
    }

    /**
     * Diagnostic testing method executed directly via Admin GraphQL API.
     */
    async testResolution(ip: string): Promise<GeoIpResolutionResult> {
        const start = performance.now();
        const clean = (ip || '').trim();
        const isPrivate = isPrivateOrLocalIp(clean);

        if (isPrivate) {
            const latencyMs = Number((performance.now() - start).toFixed(2));
            return {
                ip: clean,
                isPrivate: true,
                detectedCountry: null,
                countryName: 'Internal Network / Loopback',
                marketCode: 'global',
                urlPrefix: '/',
                atelier: 'Global Export Atelier',
                hubCode: 'DUAL_HUB',
                currency: 'USD $',
                tierUsed: 'Filtered (Private / Loopback IP)',
                latencyMs,
                cached: false,
                metadata: null,
            };
        }

        // Check if already in cache
        const cached = this.cache.get(clean);
        if (cached && Date.now() < cached.expiresAt) {
            const latencyMs = Number((performance.now() - start).toFixed(2));
            const iso = cached.country;
            const meta = iso ? COUNTRY_MAP[iso] : null;
            const richMetadata = this.getCountryMetadata(iso);
            return {
                ip: clean,
                isPrivate: false,
                detectedCountry: iso,
                countryName: richMetadata?.countryName || meta?.name || (iso || 'Unknown'),
                marketCode: meta ? meta.market : 'global',
                urlPrefix: meta ? meta.urlPrefix : '/',
                atelier: meta ? meta.atelier : 'Global Export Atelier',
                hubCode: meta ? meta.hub : 'DUAL_HUB',
                currency: richMetadata ? `${richMetadata.currencyCode} ${richMetadata.currencySymbol}` : (meta?.currency || 'USD $'),
                tierUsed: 'Cache: In-Memory LRU (24h TTL)',
                latencyMs,
                cached: true,
                metadata: richMetadata,
            };
        }

        // Tier 1: Local MaxMind
        let iso = await this.lookupMaxMind(clean);
        let tierUsed = 'Tier 1: MaxMind MMDB (Local Binary)';

        // Tier 2: Remote Fallback
        if (!iso && this.fallbackApiEnabled) {
            iso = await this.lookupRemoteApi(clean);
            tierUsed = 'Tier 2: Public IP-API Remote Fallback';
        }

        // Cache the result
        if (this.cache.size >= this.maxCacheSize) {
            const oldest = this.cache.keys().next().value;
            if (oldest) this.cache.delete(oldest);
        }
        this.cache.set(clean, {
            country: iso,
            expiresAt: Date.now() + (iso ? this.cacheTtlMs : this.failureTtlMs),
        });

        const latencyMs = Number((performance.now() - start).toFixed(2));
        const meta = iso ? COUNTRY_MAP[iso] : null;
        const richMetadata = this.getCountryMetadata(iso);

        return {
            ip: clean,
            isPrivate: false,
            detectedCountry: iso,
            countryName: richMetadata?.countryName || meta?.name || (iso || 'Unknown / Unmapped'),
            marketCode: meta ? meta.market : 'global',
            urlPrefix: meta ? meta.urlPrefix : '/',
            atelier: meta ? meta.atelier : 'Global Export Atelier',
            hubCode: meta ? meta.hub : 'DUAL_HUB',
            currency: richMetadata ? `${richMetadata.currencyCode} ${richMetadata.currencySymbol}` : (meta?.currency || 'USD $'),
            tierUsed,
            latencyMs,
            cached: false,
            metadata: richMetadata,
        };
    }

    /**
     * Returns operational status and hit metrics.
     */
    getStats(): GeoIpStats {
        let dbPath = this.loadedDbPath;
        if (!dbPath) {
            const candidates = [
                this.customDbPath,
                process.env.MAXMIND_DB_PATH,
                'data/GeoLite2-Country.mmdb',
                'apps/server/data/GeoLite2-Country.mmdb',
                './GeoLite2-Country.mmdb',
            ].filter(Boolean) as string[];
            for (const p of candidates) {
                if (fs.existsSync(p)) {
                    dbPath = p;
                    break;
                }
            }
        }

        return {
            cacheEntriesCount: this.cache.size,
            maxmindLoaded: this.maxmindReader !== null || (dbPath !== null && fs.existsSync(dbPath)),
            maxmindDbPath: dbPath,
            fallbackApiEnabled: this.fallbackApiEnabled,
            totalLookups: this.totalLookups,
            cacheHits: this.cacheHits,
            tier0Hits: this.tier0Hits,
            tier1Hits: this.tier1Hits,
            tier2Hits: this.tier2Hits,
        };
    }

    /**
     * Clears all cached in-memory resolutions.
     */
    flushCache(): FlushGeoIpCacheResult {
        const clearedEntries = this.cache.size;
        this.cache.clear();
        return {
            success: true,
            clearedEntries,
            message: `Successfully flushed ${clearedEntries} cached IP resolutions.`,
        };
    }

    /**
     * Extracts public client IP from request.
     */
    extractClientIp(request: any, getHeader: (name: string) => string | null): string | null {
        const directHeaders = [
            'cf-connecting-ip',
            'x-real-ip',
            'true-client-ip',
            'fastly-client-ip',
            'x-client-ip',
        ];

        for (const h of directHeaders) {
            const ip = getHeader(h);
            if (ip && typeof ip === 'string' && !isPrivateOrLocalIp(ip)) {
                return ip.trim();
            }
        }

        const xff = getHeader('x-forwarded-for');
        if (xff && typeof xff === 'string') {
            const parts = xff.split(',').map(p => p.trim());
            for (const candidate of parts) {
                if (!isPrivateOrLocalIp(candidate)) {
                    return candidate;
                }
            }
            if (parts.length > 0 && parts[0]) {
                return parts[0];
            }
        }

        const remote = request.ip || request.connection?.remoteAddress || request.socket?.remoteAddress;
        if (remote && typeof remote === 'string' && !isPrivateOrLocalIp(remote)) {
            return remote.trim();
        }

        return null;
    }

    /**
     * Tier 1: Local MaxMind MMDB reader.
     */
    async lookupMaxMind(ip: string): Promise<string | null> {
        try {
            const reader = await this.getMaxMindReader();
            if (!reader) return null;

            const res = reader.get(ip);
            const iso = res?.country?.iso_code;
            if (isValidIsoCountry(iso)) {
                return (iso as string).trim().toUpperCase();
            }
        } catch {
            return null;
        }
        return null;
    }

    private async getMaxMindReader(): Promise<Reader<CountryResponse> | null> {
        if (this.maxmindReader) return this.maxmindReader;
        if (this.maxmindInitPromise) return this.maxmindInitPromise;

        this.maxmindInitPromise = (async () => {
            const candidates = [
                this.customDbPath,
                process.env.MAXMIND_DB_PATH,
                'data/GeoLite2-Country.mmdb',
                'apps/server/data/GeoLite2-Country.mmdb',
                '/data/GeoLite2-Country.mmdb',
                '/plugins-storage/geoip/GeoLite2-Country.mmdb',
                './GeoLite2-Country.mmdb',
            ].filter(Boolean) as string[];

            for (const p of candidates) {
                try {
                    if (fs.existsSync(p)) {
                        this.maxmindReader = await maxmind.open<CountryResponse>(p);
                        this.loadedDbPath = p;
                        return this.maxmindReader;
                    }
                } catch {
                    // Try next path
                }
            }
            return null;
        })();

        return this.maxmindInitPromise;
    }

    /**
     * Tier 2: Remote IP-API fallback.
     */
    async lookupRemoteApi(ip: string): Promise<string | null> {
        // Service 1: ipwho.is (fast, free, IPv4/IPv6, zero API key)
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 2000);
            const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
                signal: controller.signal,
                headers: { Accept: 'application/json' },
            });
            clearTimeout(timeout);
            if (res.ok) {
                const data = (await res.json()) as any;
                if (data?.success && isValidIsoCountry(data?.country_code)) {
                    return String(data.country_code).trim().toUpperCase();
                }
            }
        } catch {
            // Fallback to service 2
        }

        // Service 2: ip-api.com (fallback)
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 2000);
            const res = await fetch(
                `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,countryCode`,
                {
                    signal: controller.signal,
                    headers: { Accept: 'application/json' },
                }
            );
            clearTimeout(timeout);
            if (res.ok) {
                const data = (await res.json()) as any;
                if (data?.status === 'success' && isValidIsoCountry(data?.countryCode)) {
                    return String(data.countryCode).trim().toUpperCase();
                }
            }
        } catch {
            // Failed
        }

        return null;
    }

    /**
     * Hot-reloads the MaxMind database reader in-memory without server downtime.
     */
    async reloadReader(dbPath?: string): Promise<boolean> {
        try {
            const p = dbPath || this.loadedDbPath || process.env.MAXMIND_DB_PATH || 'data/GeoLite2-Country.mmdb';
            if (fs.existsSync(p)) {
                this.maxmindReader = await maxmind.open<CountryResponse>(p);
                this.loadedDbPath = p;
                return true;
            }
        } catch {
            return false;
        }
        return false;
    }
}
