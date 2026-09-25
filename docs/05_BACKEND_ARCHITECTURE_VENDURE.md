# 05. Backend Architecture & Vendure Configuration

## 1. Vendure 3.x System Architecture

The backend lives in `apps/server` and is powered by Vendure 3.x with TypeScript, NestJS, and PostgreSQL. Domain logic is decoupled into modular packages inside `apps/packages/`:

```
vendure/
├── apps/
│   ├── packages/
│   │   ├── multi-market/             <-- Regional routing & Geo-IP (@suisuto/vendure-multi-market-plugin)
│   │   └── multi-hub/                <-- Dual-hub stock allocation & split fulfillment (@suisuto/vendure-multi-hub-plugin)
│   └── server/
│       ├── src/
│       │   ├── migrations/           <-- TypeORM database migrations (1790150000000-suisuto_init.ts)
│       │   ├── vendure-config.ts     <-- Master Server Configuration & Custom Fields
│       │   ├── index.ts              <-- Server Entry Point
│       │   └── index-worker.ts       <-- Background Job Queue Worker
│       └── static/                   <-- Email templates and public assets
```

---

## 2. Master Configuration (`vendure-config.ts`)

### 2.1 Channels Configuration
Vendure channels isolate catalog, currency, orders, and pricing per regional market:
* **Manual Channel Creation**: Channels are configured cleanly by administrators via the Vendure Dashboard (`/dashboard/channels`) or ChannelService without forced seed injections.
* **Regional Isolation**: Each channel controls its default currency (e.g. `BDT`, `INR`, `USD`) and pricing policies.
* **Zero Premade Bias**: No hardcoded default channels or dummy fallback markets are seeded on startup.

### 2.2 Custom Fields Schema Definition
Configured under `config.customFields` in [`apps/server/src/vendure-config.ts`](file:///c:/laragon/www/vendure/apps/server/src/vendure-config.ts):

```typescript
export const config: VendureConfig = {
  // ...
  customFields: {
    Product: [
      {
        name: 'originHub',
        type: 'string',
        options: [
          { value: 'BD_HUB', label: [{ languageCode: LanguageCode.en, value: 'Bangladesh Hub' }] },
          { value: 'IN_HUB', label: [{ languageCode: LanguageCode.en, value: 'India Hub' }] },
          { value: 'DUAL_HUB', label: [{ languageCode: LanguageCode.en, value: 'Dual Hub (Both)' }] },
        ],
        public: true,
        nullable: false,
        defaultValue: 'BD_HUB',
      },
      {
        name: 'fabricCareGuide',
        type: 'text',
        public: true,
        nullable: true,
      },
      {
        name: 'modelSpecs',
        type: 'string',
        public: true,
        nullable: true,
        description: 'e.g. Model is 5\'9" wearing size S',
      },
      {
        name: 'hsCode',
        type: 'string',
        public: false,
        nullable: true,
        description: 'Apparel HS Code for Customs Export',
      },
    ],
    Order: [
      {
        name: 'recipientKycId',
        type: 'string',
        public: true,
        nullable: true,
        description: 'Aadhaar / PAN / Passport for Indian Customs imports',
      },
      {
        name: 'isMultiHubOrder',
        type: 'boolean',
        public: true,
        defaultValue: false,
      },
    ],
    StockLocation: [
      {
        name: 'hubCode',
        type: 'string',
        public: true,
        nullable: true,
        description: 'Hub code identifier (e.g. BD_HUB, IN_HUB, DUAL_HUB)',
      },
      {
        name: 'countryCode',
        type: 'string',
        public: true,
        nullable: true,
        description: '2-letter ISO country code (e.g. BD, IN)',
      },
      {
        name: 'domesticCarrier',
        type: 'string',
        public: true,
        nullable: true,
        description: 'Domestic courier (e.g. Pathao, Delhivery)',
      },
      {
        name: 'crossBorderCarrier',
        type: 'string',
        public: true,
        nullable: true,
        description: 'Cross-border courier (e.g. DHL Express)',
      },
      {
        name: 'standardTransitDays',
        type: 'int',
        public: true,
        nullable: true,
        defaultValue: 3,
        description: 'Standard delivery timeframe in days',
      },
    ],
  },
};
```

### 2.3 Database Migrations

Database schema updates are managed through TypeORM migrations located in [`apps/server/src/migrations/`](file:///c:/laragon/www/vendure/apps/server/src/migrations):
- **`1790150000000-suisuto_init.ts`**: Consolidated authoritative migration containing all domain additions:
  - Custom fields for `Product` (`originHub`, `fabricCareGuide`, `modelSpecs`, `hsCode`)
  - Custom fields for `Order` (`recipientKycId`, `isMultiHubOrder`)
  - Custom fields for `StockLocation` (`hubCode`, `countryCode`, `domesticCarrier`, `crossBorderCarrier`, `standardTransitDays`)
  - Dynamic `Market` entity and composite indices (`urlPrefix`, `channelCode`, `code`, `enabled`, `isDefault`)
  - Cleanup of legacy `campaign` table (`DROP TABLE IF EXISTS "campaign" CASCADE;`)

#### Schema Synchronization & Migration Execution
- In local testing or initial container bootstrap, setting `DB_SYNCHRONIZE=true` allows TypeORM to generate and seed all tables immediately without migration collisions.
- In production, set `DB_SYNCHRONIZE=false` and run migrations:
```bash
cd apps/server
npx vendure migrate -r
```

---

## 3. Stock Location Strategy

A custom `MultiHubStockLocationStrategy` in [`apps/packages/multi-hub/strategies/multi-hub-stock-location.strategy.ts`](file:///c:/laragon/www/vendure/apps/packages/multi-hub/strategies/multi-hub-stock-location.strategy.ts) determines which physical hub supplies each item in an order line:

1. **Exact Hub Code Matching**: Matches `StockLocation.customFields.hubCode` against `Product.customFields.originHub` (e.g. `'BD_HUB'` $\to$ Bangladesh Hub).
2. **Name Fallback**: Matches location name (e.g. `'India Hub'`).
3. **Prefix Fallback**: Matches ISO prefix (`'BD'` / `'IN'`).
4. **Default Fallback**: Allocates to the default primary location.

```typescript
@Injectable()
export class MultiHubStockLocationStrategy implements StockLocationStrategy {
  // ...
  async forAllocation(
    ctx: RequestContext,
    stockLocations: StockLocation[],
    orderLine: OrderLine,
    quantity: number,
  ): Promise<LocationWithQuantity[]> {
    const product = orderLine.productVariant.product;
    const originHub = (product.customFields as any)?.originHub;
    
    // Allocate to the hub matching the product's origin
    const targetLocation = stockLocations.find(l => (l.customFields as any)?.hubCode === originHub)
      || stockLocations.find(l => l.name?.toLowerCase().includes(originHub === 'IN_HUB' ? 'india' : 'bangladesh'))
      || stockLocations[0];

    return [{ location: targetLocation, quantity }];
  }
}
```

---

## 4. Role-Based Access Control (RBAC)

Vendure native roles are created to enforce regional agent scoping:

| Role Name | Assigned Channels | Assigned Stock Location | Permissions |
| :--- | :--- | :--- | :--- |
| **SuperAdmin** | All Channels | All Locations | Full administrative rights |
| **India Agent** | `india`, `global` | `India Hub` | `ReadCatalog`, `UpdateCatalog`, `ReadOrder`, `CreateFulfillment`, `UpdateFulfillment` (India orders only) |
| **Bangladesh Agent** | `bangladesh`, `global` | `Bangladesh Hub` | Identical to India Agent, restricted to BD orders & stock |

---

## 5. Plugin Verification & Quality Checks

Run the automated test suites for backend domain plugins:

```bash
pnpm run test:multi-market     # Multi-market routing & Geo-IP tests (36 passing)
pnpm run test:multi-hub        # Multi-hub allocation & split-shipping tests (17 passing)
```

---

## 6. Docker Containerization & Deployment

The server is packaged with a multi-stage Dockerfile (`apps/server/Dockerfile`) based on `node:24-trixie-slim`:

### 6.1 Local Testing Compose
Runs the complete containerized stack (Postgres 17, Redis 8, Vendure Server with healthcheck, and Storefront) building from local source:
```bash
docker compose -f docker-compose.local.yml up --build
```
Features:
- Native healthcheck on `GET /health` (`{"status":"ok"}`).
- Persistent volume `local_server_assets` mapped to `/app/apps/server/static/assets`.
- `DB_SYNCHRONIZE=true` for instant schema generation.
- Dynamic `ASSET_URL_PREFIX=http://localhost:3000/assets/`.

### 6.2 Production Deployment (GHCR)
Production images are built automatically by GitHub Actions on version tags (`v*`) and pushed to GitHub Container Registry (`ghcr.io`):
```bash
# Copy and configure environment
cp .env.production.example .env.production

# Run with Docker Compose
docker compose --env-file .env.production -f docker-compose.prod.yml up -d

# Or with Traefik (Automated SSL & Hybrid GeoIP)
docker compose --env-file .env.production -f docker-compose.prod.yml -f traefik/docker-compose.traefik.yml up -d
```

