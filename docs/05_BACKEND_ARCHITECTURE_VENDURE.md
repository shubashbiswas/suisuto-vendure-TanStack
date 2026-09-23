# 05. Backend Architecture & Vendure Configuration

## 1. Vendure 3.x System Architecture

The backend lives in `apps/server` and is powered by Vendure 3.x with TypeScript, NestJS, and PostgreSQL. Domain logic is decoupled into modular packages inside `apps/packages/`:

```
suisuto-vendure-v2/
├── apps/
│   ├── packages/
│   │   ├── multi-market/             <-- Regional routing & Geo-IP (@suisuto/vendure-multi-market-plugin)
│   │   ├── multi-hub/                <-- Dual-hub stock allocation & split fulfillment (@suisuto/vendure-multi-hub-plugin)
│   │   └── multi-campaign/           <-- Dynamic merchandising & cache invalidation (@suisuto/vendure-multi-campaign-plugin)
│   └── server/
│       ├── src/
│       │   ├── migrations/           <-- TypeORM database migrations
│       │   ├── vendure-config.ts     <-- Master Server Configuration & Custom Fields
│       │   ├── index.ts              <-- Server Entry Point
│       │   └── index-worker.ts       <-- Background Job Queue Worker
│       └── static/                   <-- Email templates and public assets
```

---

## 2. Master Configuration (`vendure-config.ts`)

### 2.1 Channels Configuration
Channels are initialized via Vendure's ChannelService or during bootstrapping:
* **`bangladesh`**: Currency `BDT`, default language `en`.
* **`india`**: Currency `INR`, default language `en`.
* **`global`**: Currency `USD`, default language `en`.

### 2.2 Custom Fields Schema Definition
Configured under `config.customFields` in [`apps/server/src/vendure-config.ts`](file:///c:/laragon/www/suisuto-vendure-v2/apps/server/src/vendure-config.ts):

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
Database schema updates are managed through TypeORM migrations located in [`apps/server/src/migrations/`](file:///c:/laragon/www/suisuto-vendure-v2/apps/server/src/migrations):
- `1790046009828-add_campaign_entity.ts`: Creates the `campaign` table for `@suisuto/vendure-multi-campaign-plugin`.
- `1790046009829-campaign_indexes_and_priority.ts`: Adds `priority` column and composite indexes (`[market, slug]`, `[market, status]`).
- `1790100000003-add_stock_location_custom_fields.ts`: Adds `customFieldsHubcode`, `customFieldsCountrycode`, `customFieldsDomesticcarrier`, `customFieldsCrossbordercarrier`, `customFieldsStandardtransitdays` to `stock_location`.
- `1790140748431-sync_schema.ts`: Final schema sync and index identifier reconciliation.

Run migrations via:
```bash
cd apps/server
npx vendure migrate -r
```

---

## 3. Stock Location Strategy

A custom `MultiHubStockLocationStrategy` in [`apps/packages/multi-hub/strategies/multi-hub-stock-location.strategy.ts`](file:///c:/laragon/www/suisuto-vendure-v2/apps/packages/multi-hub/strategies/multi-hub-stock-location.strategy.ts) determines which physical hub supplies each item in an order line:

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

Run the automated test suites for all backend plugins:

```bash
pnpm run test:multi-market     # Multi-market routing & Geo-IP tests (30 passing)
pnpm run test:multi-hub        # Multi-hub allocation & split-shipping tests (17 passing)
pnpm run test:multi-campaign   # Dynamic campaign & cache invalidation tests (6 passing)
```
