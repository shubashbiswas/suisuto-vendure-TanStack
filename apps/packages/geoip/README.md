# @suisuto/vendure-geoip-plugin

Production-ready, modular hybrid **GeoIP plugin for Vendure** supporting local MaxMind `.mmdb` databases and public IP-API fallbacks with high-speed in-memory caching.

---

## Features

- **Hybrid Tiered Lookup**:
  1. **Proxy Headers** (`cf-ipcountry`, `x-country-code`, `x-vercel-ip-country`, `cloudfront-viewer-country`).
  2. **Tier 1 (MaxMind MMDB)**: Local sub-millisecond offline lookup if `GeoLite2-Country.mmdb` is present.
  3. **Tier 2 (IP-API Fallback)**: Automatic remote IP lookup via `ipwho.is` or `ip-api.com` with a 2-second timeout.
- **In-Memory Caching**: 24-hour LRU caching of resolved IPs prevents rate-limiting and redundant lookups.
- **Pluggable & Non-Invasive**:
  - Express Middleware automatically injects `req.headers['x-country-code']` downstream.
  - Exposes `HybridGeoProvider` compatible with `@suisuto/vendure-multi-market-plugin`.
- **Zero Storefront Code Changes**: Any downstream consumer reading standard proxy headers receives the country code automatically.

---

## Installation & Registration

In `apps/server/src/vendure-config.ts`:

```typescript
import { GeoIpPlugin } from '@suisuto/vendure-geoip-plugin';
import { MultiMarketPlugin } from '@suisuto/vendure-multi-market-plugin';

export const config: VendureConfig = {
    // ...
    plugins: [
        GeoIpPlugin.init({
            // Path to local MaxMind database (optional)
            dbPath: process.env.MAXMIND_DB_PATH || '/data/GeoLite2-Country.mmdb',
            fallbackApiEnabled: true, // Enable public IP-API fallback
            cacheTtlMs: 24 * 60 * 60 * 1000, // 24 hours
        }),
        MultiMarketPlugin.init({
            defaultMarketCode: 'global',
        }),
        // ...
    ],
};
```

Or pass `HybridGeoProvider` directly to `MultiMarketPlugin`:

```typescript
import { HybridGeoProvider } from '@suisuto/vendure-geoip-plugin';
import { MultiMarketPlugin } from '@suisuto/vendure-multi-market-plugin';

MultiMarketPlugin.init({
    defaultMarketCode: 'global',
    geoProvider: new HybridGeoProvider({
        dbPath: '/data/GeoLite2-Country.mmdb',
    }),
});
```

---

## Running Tests

```bash
pnpm --filter @suisuto/vendure-geoip-plugin test
```
