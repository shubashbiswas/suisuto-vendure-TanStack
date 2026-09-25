export interface GeoProvider {
    getCountry(request: unknown): Promise<string | null>;
}

export interface GeoIpPluginOptions {
    /**
     * Path to local MaxMind GeoLite2-Country.mmdb database file.
     * Defaults to MAXMIND_DB_PATH env var, or '/data/GeoLite2-Country.mmdb', or './GeoLite2-Country.mmdb'.
     */
    dbPath?: string;

    /**
     * Whether to enable public IP-API fallback if local MMDB is not found or fails.
     * Default: true
     */
    fallbackApiEnabled?: boolean;

    /**
     * Downstream HTTP header name to attach to incoming requests in middleware.
     * Default: 'x-country-code'
     */
    headerName?: string;

    /**
     * Cache TTL in milliseconds for IP lookups.
     * Default: 86_400_000 (24 hours)
     */
    cacheTtlMs?: number;

    /**
     * Allow dev mock headers ('x-mock-country', 'x-suisuto-mock-country').
     * Default: true in dev / non-prod environments.
     */
    allowMockHeaders?: boolean;
}

export const GEOIP_OPTIONS = Symbol('GEOIP_OPTIONS');
