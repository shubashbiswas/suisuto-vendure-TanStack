# Multi-Hub Fashion E-Commerce Documentation Suite

Welcome to the complete architectural and operational documentation suite for the multi-hub international fashion brand.

## Document Directory

| Document | Topic & Focus Area | Key Concepts Covered |
| :--- | :--- | :--- |
| **[01. Business Logic & Strategy](./01_BUSINESS_LOGIC_AND_STRATEGY.md)** | Core brand strategy & operating model | Symmetric dual-hub model, target markets, cross-border "Global" policy |
| **[02. Catalog & Channels](./02_CATALOG_AND_CHANNELS.md)** | Merchandising & catalog isolation | Per-product channel assignment matrix, multi-currency pricing, fashion custom fields |
| **[03. Inventory & Warehousing](./03_INVENTORY_AND_WAREHOUSING.md)** | Stock management & allocation | Stock locations (`India Hub`, `BD Hub`), reservation lifecycle, low-stock alerts |
| **[04. Order Routing & Fulfillment](./04_ORDER_ROUTING_AND_FULFILLMENT.md)** | Routing logic & split shipments | Decision flowchart, multi-fulfillment per order, Indian Customs KYC, HS codes |
| **[05. Backend Architecture (Vendure)](./05_BACKEND_ARCHITECTURE_VENDURE.md)** | Server implementation in `apps/server` | `vendure-config.ts`, custom fields schema, `MultiHubStockLocationStrategy`, RBAC roles |
| **[06. Frontend Architecture (TanStack Start)](./06_FRONTEND_ARCHITECTURE_STOREFRONT.md)** | Storefront implementation in `apps/storefront` | Dynamic channel token injection, GeoIP switcher, origin badges, mixed-cart drawer |
| **[07. Payments & Shipping](./07_PAYMENTS_AND_SHIPPING_INTEGRATIONS.md)** | Gateway & logistics topology | SSLCOMMERZ, Razorpay, Stripe, Pathao, Delhivery, DHL Express, rate formulas |
| **[08. Standard Operating Procedures](./08_STANDARD_OPERATING_PROCEDURES_SOPS.md)** | Operational runbooks for teams | Merchandising product creation, daily agent dispatch, restocking protocol |
| **[09. Multi-Market Campaign Architecture](./09_MULTI_MARKET_CAMPAIGN_ARCHITECTURE.md)** | Campaign-aware merchandising & regional architecture | Vendure `MultiCampaignPlugin`, dynamic section engine, countdown timers, sub-slug landing pages, SOPs |
| **[Multi-Hub Architecture](./MULTI_HUB_ARCHITECTURE.md)** | Dual-hub fulfillment & split shipping | `@suisuto/vendure-plugin-multi-hub`, stock locations, per-origin split-shipping calculator, multi-fulfillment |

---

## Domain Plugin Packages (`apps/packages/`)

- **`@suisuto/vendure-plugin-multi-market`** (`apps/packages/multi-market`): Regional market routing, edge Geo-IP detection, channel isolation, currency management.
- **`@suisuto/vendure-plugin-multi-hub`** (`apps/packages/multi-hub`): Dual-hub stock allocation, split-shipping calculation, and multi-fulfillment generation.
- **`@suisuto/vendure-plugin-multi-campaign`** (`apps/packages/multi-campaign`): Dynamic seasonal drops, priority scheduling, and automated cache revalidation.


## Quick Architecture Diagram

```
                              [ Product Catalog ]
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            ▼                          ▼                          ▼
    [ Bangladesh Channel ]     [ India Channel ]          [ Global Channel ]
    • Currency: BDT (৳)        • Currency: INR (₹)        • Currency: USD ($)
    • Domestic Market (BD)     • Domestic Market (India)  • Global Export / Cross-Border
            │                          │                          │
            └────────────────────┬─────┴──────────────────────────┘
                                 │
                   ┌─────────────┴─────────────┐
                   ▼                           ▼
          [ Bangladesh Hub ]            [ India Hub ]
          • Stock Location: BD          • Stock Location: IN
          • Local Agent Admin           • Local Agent Admin
```
