# @suisuto/vendure-multi-hub-plugin

> **Suisuto Dual-Hub Fulfillment, Stock Location Allocation, and Split-Shipping Engine for Vendure**

---

## 1. Overview

`@suisuto/vendure-multi-hub-plugin` orchestrates the dual-hub artisan manufacturing and logistics model for **Suisuto Haute Couture**:
- **Bangladesh Hub (`BD_HUB`)**: Narayanganj / Dhaka Atelier — domestic carrier **Pathao**, payment via **SSLCOMMERZ**, local currency **BDT (৳)**.
- **India Hub (`IN_HUB`)**: Varanasi / Delhi Atelier — domestic carrier **Delhivery**, payment via **Razorpay**, local currency **INR (₹)**.
- **Global Export Channel (`DUAL_HUB`)**: Cross-border fulfillment via **DHL Express**, payment via **Stripe**, currency **USD ($)**.

---

```
apps/packages/multi-hub/
├── constants/          # Hub definitions, carrier presets, action constants
├── dashboard/          # Vendure Admin Dashboard extension
├── resolvers/          # Admin GraphQL queries and mutations
├── services/           # Fulfillment splitting and stock query services
├── shipping/           # Dynamic split-shipping calculator & eligibility checker
├── strategies/         # MultiHubStockLocationStrategy
├── tests/              # Jest unit test suite (17 tests)
├── types/              # Hub metadata and GraphQL typings
├── multi-hub.plugin.ts # Plugin bootstrap & UI extension registration
├── package.json
└── README.md           # Documentation & SOPs
```

## 2. Core Capabilities

### 2.1 Multi-Hub Stock Location Strategy ([`strategies/multi-hub-stock-location.strategy.ts`](./strategies/multi-hub-stock-location.strategy.ts))
Replaces single-warehouse allocation by directing order line items to physical stock locations based on:
1. **`StockLocation.customFields.hubCode`**: Exact match against the product's assigned `originHub` (e.g. `'BD_HUB'`, `'IN_HUB'`).
2. **Location Name Matching**: Case-insensitive location name match (e.g. `'Bangladesh Hub'`).
3. **Regional Prefix Matching**: ISO country code prefix match (`'BD'` / `'IN'`).
4. **Primary Fallback**: Default primary location if unassigned.

### 2.2 Split-Shipping Surcharge & Dynamic Calculator ([`shipping/multi-hub-shipping.ts`](./shipping/multi-hub-shipping.ts))
- **Domestic Fulfillment (1 Hub to Domestic Destination)**: Flat domestic rate (e.g. 120 BDT or 120 INR).
- **International Single Hub (1 Hub to Foreign Destination)**: Base cross-border rate (e.g. $25.00 USD).
- **Dual-Hub / Multi-Hub Split Parcels**: When an order contains items originating from different workshops (e.g. 1 Jamdani saree from BD + 1 Banarasi scarf from IN), charges **per-origin-hub international rate** ($25.00 × 2 hubs = $50.00).

### 2.3 Automatic Multi-Fulfillment Order Splitting ([`services/multi-hub-fulfillment.service.ts`](./services/multi-hub-fulfillment.service.ts))
- Automatically groups order lines by physical origin supply hub.
- When an order transitions to fulfillment, generates **independent Vendure `Fulfillment` entities** for each origin hub.
- Assigns dedicated carriers and tracking codes (e.g. Pathao for Narayanganj dispatch, Delhivery for Varanasi dispatch, DHL Express for export).
- Automatically sets `order.customFields.isMultiHubOrder = true` for auditability.

### 2.4 Enriched `StockLocation` Metadata
Adds structured custom fields to `StockLocation`:
- `hubCode`: Identifier code (e.g. `BD_HUB`, `IN_HUB`, `DUAL_HUB`).
- `countryCode`: 2-letter ISO country code (`BD`, `IN`).
- `domesticCarrier`: Default domestic courier name (e.g. `Pathao`, `Delhivery`).
- `crossBorderCarrier`: Cross-border express carrier (`DHL Express`).
- `standardTransitDays`: Estimated delivery SLA in days.

### 2.5 Admin Operations Dashboard ([`dashboard/`](./dashboard))
Integrated directly into Vendure's Admin Dashboard under **Settings -> Fulfillment Hubs** (`/admin/settings/multi-hub`):
- **Live KPI Cards**: Active fulfillment hubs, monitored SKUs, split-fulfillment rate, transit SLA.
- **Physical Warehouses & Hubs**: Real-time stock locations view and modal to add/edit hub parameters.
- **Catalog Origin Hub Assignment**: Searchable catalog table with instant product `originHub` modal.
- **Split-Shipping Matrix & Simulator**: Interactive cart item simulator to test routing and fee calculation.
- **Split-Order Auditor**: Auditing table tracking orders dispatched across split legs with discrete tracking codes.

---

## 3. GraphQL Schema

### 3.1 Admin API
```graphql
type FulfillmentHub {
    id: ID!
    name: String!
    description: String
    hubCode: String
    countryCode: String
    domesticCarrier: String
    crossBorderCarrier: String
    standardTransitDays: Int
}

extend type Query {
    fulfillmentHubs: [FulfillmentHub!]!
    multiHubOrders(take: Int, skip: Int): OrderList!
}

extend type Mutation {
    updateProductOriginHub(productId: ID!, originHub: String!): Product!
    splitFulfillOrder(orderId: ID!): [Fulfillment!]!
}
```

---

## 4. Multi-Market vs. Multi-Hub Boundary

| Domain | Plugin Package | Core Responsibility |
|---|---|---|
| **Market (Customer Destination)** | `@suisuto/vendure-multi-market-plugin` | Customer's buying channel (`/`, `/in/`, `/bd/`), pricing currency, language, and local payment gateway. |
| **Hub (Supply Provenance)** | `@suisuto/vendure-multi-hub-plugin` | Physical warehouse / workshop location (`BD_HUB`, `IN_HUB`), stock allocation, split shipping, and discrete fulfillment legs. |

> **Market-Switching Cart Behavior**:  
> In accordance with strict Vendure channel and currency isolation, carts created in one market (e.g. INR in `/in`) do **not** carry over when navigating to another market (e.g. BDT in `/bd`). The storefront provides a luxury confirmation dialog informing visitors that their active shopping bag remains safely preserved in their current market when switching regions.

---

## 5. Verification & Testing

Run the dedicated test suite:
```bash
# Run multi-hub unit tests (17 passing unit tests)
pnpm run test:multi-hub

# Build multi-hub package
pnpm --filter @suisuto/vendure-multi-hub-plugin build
```

---

## 6. License
MIT — Suisuto Atelier
