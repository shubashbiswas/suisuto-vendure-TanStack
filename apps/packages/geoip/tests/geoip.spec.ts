import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { GeoIpHybridService, isPrivateOrLocalIp, isValidIsoCountry } from '../services/geoip-hybrid.service';
import { HybridGeoProvider } from '../providers/hybrid-geo.provider';
import { createGeoIpMiddleware } from '../middleware/geoip.middleware';
import { getCountryMetadata } from '../constants/country-metadata';

describe('GeoIP Hybrid Plugin Test Suite', () => {
    describe('1. IP & ISO Validation Helpers', () => {
        it('identifies private, loopback, and local IPs correctly', () => {
            assert.strictEqual(isPrivateOrLocalIp('127.0.0.1'), true);
            assert.strictEqual(isPrivateOrLocalIp('::1'), true);
            assert.strictEqual(isPrivateOrLocalIp('localhost'), true);
            assert.strictEqual(isPrivateOrLocalIp('10.0.1.5'), true);
            assert.strictEqual(isPrivateOrLocalIp('192.168.1.1'), true);
            assert.strictEqual(isPrivateOrLocalIp('172.16.0.10'), true);
            assert.strictEqual(isPrivateOrLocalIp('103.205.180.1'), false); // Public BD IP
            assert.strictEqual(isPrivateOrLocalIp('103.21.244.1'), false);  // Public IP
        });

        it('validates ISO 3166-1 alpha-2 codes properly', () => {
            assert.strictEqual(isValidIsoCountry('BD'), true);
            assert.strictEqual(isValidIsoCountry('IN'), true);
            assert.strictEqual(isValidIsoCountry('US'), true);
            assert.strictEqual(isValidIsoCountry('XX'), false);
            assert.strictEqual(isValidIsoCountry('T1'), false);
            assert.strictEqual(isValidIsoCountry('USA'), false);
            assert.strictEqual(isValidIsoCountry('12'), false);
            assert.strictEqual(isValidIsoCountry(''), false);
            assert.strictEqual(isValidIsoCountry(null), false);
        });
    });

    describe('2. Header Resolution Priority', () => {
        it('resolves existing proxy header (cf-ipcountry) immediately without IP lookup', async () => {
            const service = new GeoIpHybridService();
            const req = {
                headers: {
                    'cf-ipcountry': 'BD',
                    'x-forwarded-for': '127.0.0.1',
                },
            };
            const country = await service.resolveCountry(req);
            assert.strictEqual(country, 'BD');
        });

        it('resolves x-country-code header immediately', async () => {
            const service = new GeoIpHybridService();
            const req = {
                headers: {
                    'x-country-code': 'IN',
                },
            };
            const country = await service.resolveCountry(req);
            assert.strictEqual(country, 'IN');
        });

        it('resolves mock headers in non-production mode', async () => {
            const service = new GeoIpHybridService({ allowMockHeaders: true });
            const req = {
                headers: {
                    'x-mock-country': 'AE',
                },
            };
            const country = await service.resolveCountry(req);
            assert.strictEqual(country, 'AE');
        });

        it('ignores mock headers in production mode', async () => {
            const service = new GeoIpHybridService({ allowMockHeaders: false });
            const req = {
                headers: {
                    'x-mock-country': 'AE',
                },
            };
            const country = await service.resolveCountry(req);
            assert.strictEqual(country, null);
        });
    });

    describe('3. Client IP Extraction', () => {
        it('extracts public IP from x-forwarded-for chain', () => {
            const service = new GeoIpHybridService();
            const req = {
                headers: {
                    'x-forwarded-for': '103.205.180.1, 10.0.0.1, 127.0.0.1',
                },
            };
            const ip = service.extractClientIp(req, (h) => req.headers[h as keyof typeof req.headers] || null);
            assert.strictEqual(ip, '103.205.180.1');
        });

        it('prefers cf-connecting-ip over x-forwarded-for', () => {
            const service = new GeoIpHybridService();
            const req = {
                headers: {
                    'cf-connecting-ip': '103.205.180.5',
                    'x-forwarded-for': '192.168.1.1',
                },
            };
            const ip = service.extractClientIp(req, (h) => req.headers[h as keyof typeof req.headers] || null);
            assert.strictEqual(ip, '103.205.180.5');
        });
    });

    describe('4. HybridGeoProvider Interface', () => {
        it('implements GeoProvider contract and resolves country', async () => {
            const provider = new HybridGeoProvider({ allowMockHeaders: true });
            const country = await provider.getCountry({
                headers: {
                    'x-country-code': 'BD',
                },
            });
            assert.strictEqual(country, 'BD');
        });
    });

    describe('5. Extended Geo-Metadata and Middleware Injection', () => {
        it('resolves rich metadata for Bangladesh (BD)', () => {
            const meta = getCountryMetadata('BD');
            assert.ok(meta);
            assert.strictEqual(meta.countryName, 'Bangladesh');
            assert.strictEqual(meta.currencyCode, 'BDT');
            assert.strictEqual(meta.currencySymbol, '৳');
            assert.strictEqual(meta.callingCode, '+880');
            assert.strictEqual(meta.defaultLanguage, 'bn');
            assert.strictEqual(meta.continent, 'AS');
        });

        it('resolves rich metadata for India (IN)', () => {
            const meta = getCountryMetadata('IN');
            assert.ok(meta);
            assert.strictEqual(meta.countryName, 'India');
            assert.strictEqual(meta.currencyCode, 'INR');
            assert.strictEqual(meta.currencySymbol, '₹');
            assert.strictEqual(meta.callingCode, '+91');
            assert.strictEqual(meta.defaultLanguage, 'hi');
            assert.strictEqual(meta.continent, 'AS');
        });

        it('resolves rich metadata for United Arab Emirates (AE)', () => {
            const meta = getCountryMetadata('AE');
            assert.ok(meta);
            assert.strictEqual(meta.countryName, 'United Arab Emirates');
            assert.strictEqual(meta.currencyCode, 'AED');
            assert.strictEqual(meta.currencySymbol, 'د.إ');
            assert.strictEqual(meta.callingCode, '+971');
        });

        it('middleware automatically enriches request headers with currency, dial code, and language', async () => {
            const middleware = createGeoIpMiddleware({ allowMockHeaders: true });
            const req = {
                headers: {
                    'x-mock-country': 'BD',
                },
            };
            let nextCalled = false;
            await middleware(req, {}, () => {
                nextCalled = true;
            });
            assert.strictEqual(nextCalled, true);
            assert.strictEqual(req.headers['x-country-code'], 'BD');
            assert.strictEqual(req.headers['x-country-currency'], 'BDT');
            assert.strictEqual(req.headers['x-country-dial-code'], '+880');
            assert.strictEqual(req.headers['x-country-language'], 'bn');
            assert.strictEqual(req.headers['x-country-continent'], 'AS');
        });
    });

    describe('6. MaxMind Tar Extraction & Hot-Reload', () => {
        it('extracts mmdb payload from a tar buffer correctly', async () => {
            const { extractMmdbFromTar } = await import('../services/geoip-downloader.service');

            // Construct a synthetic 1024-byte POSIX tar block
            const tarBuffer = Buffer.alloc(1024);
            const filename = 'GeoLite2-Country_20260925/GeoLite2-Country.mmdb';
            tarBuffer.write(filename, 0, 'utf-8');
            // size 12 in octal = 00000000014\0
            tarBuffer.write('00000000014 ', 124, 'ascii');
            // payload at offset 512
            const dummyPayload = 'MAXMIND_DATA';
            tarBuffer.write(dummyPayload, 512, 'utf-8');

            const extracted = extractMmdbFromTar(tarBuffer);
            assert.ok(extracted);
            assert.strictEqual(extracted.toString('utf-8'), dummyPayload);
        });

        it('gracefully handles missing database during reload', async () => {
            const service = new GeoIpHybridService();
            const reloaded = await service.reloadReader('non_existent_file.mmdb');
            assert.strictEqual(reloaded, false);
        });
    });
});

