import { Inject, Injectable, Optional } from '@nestjs/common';
import { DEFAULT_GEO_HEADER_KEYS, MULTI_MARKET_OPTIONS } from '../constants/market.constants';
import { GeoProvider, MultiMarketPluginOptions } from '../types/market.types';

export interface RequestLike {
    headers?: Record<string, string | string[] | undefined>;
}

export class HeaderGeoProvider implements GeoProvider {
    headerKeys: string[];
    readonly allowMockHeaders: boolean;

    constructor(
        headerKeys: string[] = DEFAULT_GEO_HEADER_KEYS,
        allowMockHeaders: boolean = true
    ) {
        this.allowMockHeaders = allowMockHeaders;
        this.headerKeys = allowMockHeaders
            ? headerKeys
            : headerKeys.filter(k => !k.toLowerCase().includes('mock'));
    }

    async getCountry(request: unknown): Promise<string | null> {
        if (!request || typeof request !== 'object') {
            return null;
        }

        const req = request as RequestLike;
        const headers = req.headers || {};
        const isWebHeaders = typeof (headers as any).get === 'function';

        for (const key of this.headerKeys) {
            let val: string | string[] | null | undefined;
            if (isWebHeaders) {
                val = (headers as any).get(key) || (headers as any).get(key.toLowerCase());
            } else {
                val = (headers as Record<string, any>)[key.toLowerCase()] ?? (headers as Record<string, any>)[key];
            }

            if (val) {
                const country = Array.isArray(val) ? val[0] : val;
                if (country && typeof country === 'string' && country.trim().length > 0) {
                    const cleaned = country.trim().toUpperCase();
                    // ISO 3166-1 alpha-2 check: strictly 2 uppercase letters, excluding private/bogus codes
                    if (/^[A-Z]{2}$/.test(cleaned) && cleaned !== 'XX' && cleaned !== 'T1') {
                        return cleaned;
                    }
                }
            }
        }

        return null;
    }
}

@Injectable()
export class GeoIpService {
    private provider: GeoProvider;

    constructor(
        @Optional()
        @Inject(MULTI_MARKET_OPTIONS)
        private options?: MultiMarketPluginOptions
    ) {
        const allowMock =
            options?.allowMockHeaders ??
            (process.env.APP_ENV !== 'production' && process.env.NODE_ENV !== 'production');

        this.provider =
            options?.geoProvider ||
            new HeaderGeoProvider(
                options?.geoHeaderKeys || DEFAULT_GEO_HEADER_KEYS,
                allowMock
            );
    }

    async getCountry(request: unknown): Promise<string | null> {
        try {
            return await this.provider.getCountry(request);
        } catch (err) {
            return null;
        }
    }
}
