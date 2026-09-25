import { GeoIpHybridService } from '../services/geoip-hybrid.service';
import { GeoIpPluginOptions } from '../types/geoip.types';

export interface MiddlewareRequest {
    headers: Record<string, any>;
    ip?: string;
    connection?: { remoteAddress?: string };
    socket?: { remoteAddress?: string };
}

/**
 * Creates an Express/Connect-compatible middleware that intercepts incoming HTTP requests,
 * resolves the visitor's country using the hybrid pipeline, and attaches the resulting
 * country code, currency, phone dial prefix, and language to req.headers so that all
 * downstream plugins, resolvers, and storefront SSR loaders receive it.
 */
export function createGeoIpMiddleware(
    serviceOrOptions?: GeoIpHybridService | GeoIpPluginOptions
) {
    const service =
        serviceOrOptions instanceof GeoIpHybridService
            ? serviceOrOptions
            : new GeoIpHybridService(serviceOrOptions);

    const headerName =
        (serviceOrOptions as GeoIpPluginOptions)?.headerName?.toLowerCase() ||
        'x-country-code';

    return async (req: MiddlewareRequest, _res: any, next: (err?: any) => void) => {
        try {
            // Check if country header is already present from edge (e.g. Cloudflare)
            let country = req.headers[headerName] || req.headers['cf-ipcountry'] || null;

            if (!country) {
                country = await service.resolveCountry(req);
            }

            if (country) {
                const cleanCountry = String(country).trim().toUpperCase();
                req.headers[headerName] = cleanCountry;
                req.headers['x-country-code'] = cleanCountry;

                // Enrich with Phase 2 Extended Geo-Metadata
                const meta = service.getCountryMetadata(cleanCountry);
                if (meta) {
                    req.headers['x-country-currency'] = meta.currencyCode;
                    req.headers['x-country-dial-code'] = meta.callingCode;
                    req.headers['x-country-language'] = meta.defaultLanguage;
                    req.headers['x-country-continent'] = meta.continent;
                }

                // Also expose on response headers if supported by the HTTP response object
                if (typeof _res?.setHeader === 'function') {
                    _res.setHeader('x-country-code', cleanCountry);
                    if (meta) {
                        _res.setHeader('x-country-currency', meta.currencyCode);
                        _res.setHeader('x-country-dial-code', meta.callingCode);
                        _res.setHeader('x-country-language', meta.defaultLanguage);
                        _res.setHeader('x-country-continent', meta.continent);
                    }
                }
            }
        } catch {
            // Fail open: GeoIP resolution failure should never disrupt request flow
        }
        next();
    };
}
