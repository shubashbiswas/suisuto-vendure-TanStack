# Suisuto Traefik Hybrid GeoIP Middleware Plugin

This custom Traefik middleware plugin implements a **Hybrid GeoIP resolution pipeline** that injects the `X-Country-Code` HTTP header downstream before requests reach the **Storefront** (`:3001`) or **Vendure Server** (`:3000`).

Because both the Storefront and the Vendure Server already listen for `X-Country-Code`, **neither codebase requires any code changes**.

---

## Resolution Pipeline

1. **Header Passthrough (⚡ 0ms)**: If `CF-IPCountry`, `X-Vercel-IP-Country`, or `X-Country-Code` is already provided by an upstream proxy, it is preserved.
2. **Private IP Filtering**: Loopback (`127.0.0.1`), link-local, and private RFC1918 subnets (`10.x`, `192.168.x`, `172.16-31.x`) are ignored.
3. **In-Memory Cache (⚡ 0.01ms)**: IP lookups are cached in memory for 24 hours (configurable).
4. **Tier 1 — Local MaxMind MMDB (⚡ 0.05ms)**: If `GeoLite2-Country.mmdb` is placed in `./traefik/geoip/`, it performs a local offline lookup.
5. **Tier 2 — Public IP-API Fallback**: If the local database is not present or an IP is unlisted, it queries `ipwho.is` or `ip-api.com` with a 1.5s timeout.

---

## Directory Structure

```text
traefik/
├── docker-compose.traefik.yml  # Compose override with Traefik & labels
├── traefik.yml                 # Static Traefik config registering local plugin
├── geoip/                      # (Optional) Place GeoLite2-Country.mmdb here
├── letsencrypt/                # Automatic SSL certificates storage
└── plugins-local/
    └── src/
        └── github.com/
            └── suisuto/
                └── traefik-geoip-hybrid/
                    ├── .traefik.yml    # Plugin manifest
                    ├── go.mod          # Go module definition
                    ├── geoip.go        # Hybrid middleware implementation
                    └── geoip_test.go   # Test cases
```

---

## Running with Docker Compose

To start the production stack with Traefik:

```bash
docker compose -f docker-compose.prod.yml -f traefik/docker-compose.traefik.yml up -d
```

---

## Configuration Options

Configured via Traefik labels in `docker-compose.traefik.yml`:

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `headerName` | `string` | `"X-Country-Code"` | Header name forwarded downstream |
| `dbPath` | `string` | `"/plugins-storage/geoip/GeoLite2-Country.mmdb"` | Path inside container to MaxMind `.mmdb` |
| `fallbackApiEnabled` | `bool` | `true` | Enables automatic fallback to remote IP API |
| `cacheTtlMinutes` | `int` | `1440` | Duration to cache IP lookups (1440m = 24h) |
