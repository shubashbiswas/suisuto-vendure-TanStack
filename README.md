# Suisuto Atelier — Multi-Hub & Multi-Market Luxury Commerce

**Suisuto** is a full-stack, multi-market luxury fashion and artisanal handloom e-commerce platform. It operates a symmetric dual-hub fulfillment model (Bangladesh Hub & India Hub) serving domestic markets and global cross-border clientele through [Vendure v3](https://www.vendure.io/) and [TanStack Start](https://tanstack.com/start/latest/docs/framework/react/overview).

---

## 1. Architectural Highlights- **Dual-Hub Merchandising & Routing**: Symmetrically routes domestic orders within Bangladesh (`BDT ৳`) and India (`INR ₹`) while dispatching cross-border orders globally (`USD $`) from origin artisan clusters (Narayanganj muslins, Varanasi silks) via `@suisuto/vendure-multi-hub-plugin`.
- **Dynamic Section Composition Engine**: Storefront homepages are dynamically constructed via `HomepageSectionRenderer` based on market defaults—eliminating hardcoded market conditional logic in UI components.
- **SSR & Edge Performance**: Full-stack server-side rendering with TanStack Start, Nitro, client-side hydration-safe countdown timers, Vendure asset optimization (`format=webp`, `srcset`), and an automated on-demand cache revalidation webhook (`/api/revalidate`) triggered via Vendure `EventBus`.
- **Edge Geo-Detection**: Non-intrusive soft suggestion banner detects visitor country via proxy headers (`CF-IPCountry`, `X-Vercel-IP-Country`, `CloudFront-Viewer-Country`) and guides visitors to their domestic atelier without intrusive redirects.
- **Tri-Lingual Localization**: Built with Paraglide JS supporting English (EN), Bengali (BN `বাংলা`), Hindi (HI `हिन्दी`).

---

## 2. System Topology

```
                                    [ Visitor Request ]
                                             │
                                             ▼
                                 [ Reverse Proxy / Edge ]
                       (GeoIP: CF-IPCountry / X-Vercel-IP-Country)
                                             │
                                             ▼
                              [ TanStack Start Storefront ]
                                  (apps/storefront :3001)
                         ┌───────────────────┼───────────────────┐
                         ▼                   ▼                   ▼
                  [ Global Market ]   [ India Market ]    [ BD Market ]
                        (/)                (/in)              (/bd)
                         │                   │                   │
                         └───────────────────┼───────────────────┘
                                             │ GraphQL (Shop API)
                                             ▼
                                  [ Vendure Commerce Core ]
                                    (apps/server :3000)
                         ┌───────────────────┼───────────────────┐
                         ▼                   ▼                   ▼
                  [ Global Channel ]  [ India Channel ]   [ BD Channel ]
                       (USD $)             (INR ₹)             (BDT ৳)
                         │                   │                   │
                         └───────────────────┬───────────────────┘
                                             │
                                ┌────────────┴────────────┐
                                ▼                         ▼
                        [ India Hub ]              [ BD Hub ]
                        (Varanasi/Delhi)           (Narayanganj/Dhaka)
```

---

## 3. Workspace Layout

```
vendure/
├── apps/
│   ├── packages/             # Modular Vendure domain plugins
│   │   ├── multi-market/     # Market routing, GeoIP & regional channels (@suisuto/vendure-multi-market-plugin)
│   │   └── multi-hub/        # Dual-hub inventory allocation & split-shipping (@suisuto/vendure-multi-hub-plugin)
│   ├── server/               # Vendure backend (NestJS, TypeORM, PostgreSQL, GraphQL APIs)
│   │   ├── src/
│   │   │   ├── migrations/   # Consolidated TypeORM database migration (1790150000000-suisuto_init.ts)
│   │   │   └── vendure-config.ts # Core runtime configuration, DB_SYNCHRONIZE & custom fields
│   │   └── static/           # Email templates and assets
│   ├── storefront/           # TanStack Start storefront (React 19, Vite, Nitro on :3001)
│   │   └── src/
│   │       ├── features/     # Feature modules (campaigns, wishlist, market, products)
│   │       ├── markets/      # Modular market architectures (/bd, /in, /global) conforming to MarketExperience
│   │       ├── platform/     # Platform adapters (Vendure client, asset optimizer, revalidation)
│   │       ├── routes/       # File-system routes (root + $region paired routes)
│   │       └── site/         # Reusable layouts, navigation, and section renderers
│   └── storefront-nextjs/    # Next.js 16 storefront starter (React 19, Tailwind v4, next-intl on :3002)
├── docs/                     # Comprehensive engineering and operational documentation suite
├── package.json              # Monorepo root scripts (pnpm workspace)
└── AGENTS.md                 # Agent and developer operational runbook
```

---

## 4. Getting Started

### Prerequisites

- **Node.js**: v22.x or v24.x
- **pnpm**: v10.x or later
- **Docker**: (Optional, for containerized local testing and production)
- **PostgreSQL**: Running locally (default port `6543`, database `vendure`)

### Local Native Workflow

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Configure environment**:
   Verify `apps/server/.env` contains your PostgreSQL credentials and secrets. Set `DB_SYNCHRONIZE=true` for fresh database initialization if needed.

3. **Run database migrations**:

   ```bash
   cd apps/server
   npx vendure migrate -r
   ```

4. **Start development servers**:

   ```bash
   # Root directory - starts both server (:3000) and TanStack storefront (:3001)
   pnpm run dev
   ```

   Or run individual services:

   ```bash
   pnpm run dev:server      # Vendure server only (:3000)
   pnpm run dev:storefront  # TanStack Start storefront only (:3001)
   pnpm run dev:nextjs      # Next.js 16 storefront only (:3002)
   ```

### Docker Workflows

1. **Local Multi-Container Stack (Testing)**:
   Builds local source trees on `node:24-trixie-slim` alongside PostgreSQL 16 and Redis 7:

   ```bash
   docker compose -f docker-compose.local.yml up --build
   ```

2. **Production Deployment (GHCR Images)**:
   Pulls official images published to GitHub Container Registry on git release tags (`v*`):

   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

---

## 5. Key Access Points

| Service                     | URL                               | Notes                                       |
| --------------------------- | --------------------------------- | ------------------------------------------- |
| **TanStack Storefront**     | `http://localhost:3001`           | Multi-market storefront (`/`, `/in`, `/bd`) |
| **Next.js Storefront**      | `http://localhost:3002`           | Next.js 16 starter (`/`, `/in`, `/bd`)      |
| **Shop GraphQL API**        | `http://localhost:3000/shop-api`  | Public storefront query endpoint            |
| **Admin GraphQL API**       | `http://localhost:3000/admin-api` | Secured management endpoint                 |
| **Vendure Admin Dashboard** | `http://localhost:3000/dashboard` | Merchandising & order operations            |

**Default Admin Credentials**:

- **Username**: `superadmin`
- **Password**: `superadmin`

---

## 6. Documentation Suite

The complete architectural specifications, integration details, and SOPs are maintained in [`docs/`](./docs/README.md):

| Document                                                                                                | Topic                                                                                  |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **[01. Business Logic & Strategy](./docs/01_BUSINESS_LOGIC_AND_STRATEGY.md)**                           | Dual-hub operational model and cross-border policies.                                  |
| **[02. Catalog & Channels](./docs/02_CATALOG_AND_CHANNELS.md)**                                         | Merchandising, channel assignment, and custom fields.                                  |
| **[03. Inventory & Warehousing](./docs/03_INVENTORY_AND_WAREHOUSING.md)**                               | Stock locations (`India Hub`, `BD Hub`) and allocation.                                |
| **[04. Order Routing & Fulfillment](./docs/04_ORDER_ROUTING_AND_FULFILLMENT.md)**                       | Order split shipments, customs KYC, and HS codes.                                      |
| **[05. Backend Architecture](./docs/05_BACKEND_ARCHITECTURE_VENDURE.md)**                               | Vendure server config, custom fields, consolidated migrations, and Docker.             |
| **[06. Frontend Architecture](./docs/06_FRONTEND_ARCHITECTURE_STOREFRONT.md)**                          | TanStack Start, channel tokens, and origin badges.                                     |
| **[07. Payments & Shipping](./docs/07_PAYMENTS_AND_SHIPPING_INTEGRATIONS.md)**                          | SSLCOMMERZ, Razorpay, Stripe, Pathao, Delhivery, DHL Express.                          |
| **[08. Standard Operating Procedures](./docs/08_STANDARD_OPERATING_PROCEDURES_SOPS.md)**                | Operational runbooks for merchandisers and warehouse dispatch.                         |
| **[09. Multi-Market Campaign Architecture](./docs/09_MULTI_MARKET_CAMPAIGN_ARCHITECTURE.md)**           | Dynamic merchandising, modular market campaigns, countdown timers, and landing pages.  |
| **[10. Modular Multi-Market & Animations](./docs/10_MODULAR_MARKET_AND_ANIMATION_ARCHITECTURE.md)**     | Strategy 1 modular market modules (`src/markets/`), registry, and luxury animations.    |
| **[11. Refactoring Log & Architecture Updates](./docs/11_REFACTORING_LOG_AND_ARCHITECTURE_UPDATES.md)** | Paired routes, universal navigation, Docker packaging, and migration consolidation.   |
| **[Multi-Hub Architecture](./docs/MULTI_HUB_ARCHITECTURE.md)**                                          | Dual-hub fulfillment, physical stock locations, split-shipping engine.                 |

---

## 7. Developer Commands & Quality Checks

```bash
# Domain plugin unit tests
pnpm run test:multi-market     # Multi-market routing & Geo-IP tests (36 tests)
pnpm run test:multi-hub        # Multi-hub allocation & split-shipping tests (17 tests)

# Type check storefront
pnpm --filter storefront check-types

# Compile i18n dictionary translations
pnpm --filter storefront generate:i18n

# Build production bundles
pnpm run build

# Start production runtime
pnpm run start
```

