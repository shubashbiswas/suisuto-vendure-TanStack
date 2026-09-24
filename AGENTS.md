# Suisuto Monorepo — Developer & Agent Instructions

This document is the primary operational and architectural guide for developers and AI agents working in the **Suisuto** codebase.

---

## 1. Workspace Layout & Package Boundaries

- **Vendure Backend**: [`apps/server`](file:///c:/laragon/www/suisuto-vendure-v2/apps/server) (NestJS, TypeORM, PostgreSQL, GraphQL APIs).
- **Domain Plugin Packages**: [`apps/packages/`](file:///c:/laragon/www/suisuto-vendure-v2/apps/packages)
  - [`multi-market`](file:///c:/laragon/www/suisuto-vendure-v2/apps/packages/multi-market) (`@suisuto/vendure-multi-market-plugin`): Regional market routing, detection, geo-IP, merchandising.
  - [`multi-hub`](file:///c:/laragon/www/suisuto-vendure-v2/apps/packages/multi-hub) (`@suisuto/vendure-multi-hub-plugin`): Dual-hub inventory allocation, physical stock locations, split-hub shipping.
  - [`multi-campaign`](file:///c:/laragon/www/suisuto-vendure-v2/apps/packages/multi-campaign) (`@suisuto/vendure-multi-campaign-plugin`): Dynamic seasonal/regional campaigns and editorial landing pages.
- **TanStack Start Storefront**: [`apps/storefront`](file:///c:/laragon/www/suisuto-vendure-v2/apps/storefront) (React 19, TanStack Router, Vite, Nitro on `:3001`).
- **Documentation Suite**: [`docs/`](file:///c:/laragon/www/suisuto-vendure-v2/docs) (Complete architecture specifications, SOPs, and runbooks).
- **Start server & TanStack storefront**: `pnpm run dev` (runs server on `:3000`, storefront on `:3001`).
- **Start only server**: `pnpm run dev:server`.
- **Start only TanStack storefront**: `pnpm run dev:storefront`.
- **Test multi-market plugin**: `pnpm run test:multi-market` (or `pnpm --filter @suisuto/vendure-multi-market-plugin test`).
- **Test multi-hub plugin**: `pnpm run test:multi-hub` (or `pnpm --filter @suisuto/vendure-multi-hub-plugin test`).
- **Test multi-campaign plugin**: `pnpm run test:multi-campaign` (or `pnpm --filter @suisuto/vendure-multi-campaign-plugin test`).

---

## 2. Core Business Principles & Architectural Constraints

1. **Dual-Hub Fulfillment Model**:
   - Bangladesh Hub (`BD_HUB`): Narayanganj / Dhaka, currency `BDT ৳`, domestic logistics (Pathao), local gateway (SSLCOMMERZ).
   - India Hub (`IN_HUB`): Varanasi / Delhi, currency `INR ₹`, domestic logistics (Delhivery), local gateway (Razorpay).
   - Global Export Channel (`DUAL_HUB`): Currency `USD $`, cross-border fulfillment via DHL Express & Stripe.
   - **Automated Fulfillment Splitting**: Orders containing items from multiple supply hubs are automatically split by `MultiHubFulfillmentService` into distinct fulfillment records with independent tracking numbers.
2. **Strict Multi-Market Channel & Campaign Isolation**:
   - Each market (`/`, `/in/`, `/bd/`) has independent catalog channels, pricing, and marketing campaigns.
   - **Market-Switching Cart Retention**: Because Vendure channels isolate active orders by channel and currency, bags created in one market (e.g. INR in `/in`) do not bleed into other markets (e.g. BDT in `/bd`). When a customer switches markets with items in their bag, the storefront displays a luxury confirmation dialog informing them that their bag remains safely preserved in their current market.
   - **Zero Hardcoding**: Never write hardcoded market branching in UI components (e.g. `if (region === 'in') renderDiwali()`). All campaign styling, heroes, countdowns, section sequences, and promotional badges must be driven by data from the Vendure `CampaignPlugin` or fallback configs in `market-experience.config.ts`.
3. **Hydration Integrity**:
   - Urgency timers and countdowns must run strictly client-side after mount to prevent SSR hydration mismatches.
   - Root layouts must preserve `suppressHydrationWarning` on `<body>` to prevent browser extension attribute collisions.

---

## 3. Vendure Backend Development Guidelines

- **Plugin Architecture**: Implement domain logic as modular Vendure plugin packages inside `apps/packages/`.
- **Campaign Management**: `CampaignPlugin` manages dynamic campaigns, database schema, and both Shop and Admin APIs.
- **Database Migrations**:
  - Never set `dbConnectionOptions.synchronize: true` in production environments.
  - Generate and run TypeORM migrations using `npx vendure migrate -r`.
- **Permissions & Security**:
  - Admin mutations (e.g. `createCampaign`, `updateCampaign`, `deleteCampaign`) must be decorated with `@Allow(Permission.SuperAdmin, Permission.Authenticated)`.
  - Always pass `RequestContext` (`ctx`) to Vendure services and `TransactionalConnection` calls.
  - Never commit `.env` files, API tokens, or runtime data.

---

## 4. Storefront Architecture & TanStack Start Conventions

### 4.1 Route Pairing Rule
- **File-system routing** via TanStack Router (`routeTree.gen.ts` is auto-generated).
- **Paired Route Requirement**: Every public page must have both a root route and a regional variant:
  - Root: `apps/storefront/src/routes/page.tsx`
  - Regional: `apps/storefront/src/routes/$region.page.tsx`
  - Root campaign: `apps/storefront/src/routes/campaign.$slug.tsx` and `campaign.$slug.$.tsx`
  - Regional campaign: `apps/storefront/src/routes/$region.campaign.$slug.tsx` and `$region.campaign.$slug.$.tsx`

### 4.2 Dynamic Section Composition
- Storefront homepages and landing pages use [`HomepageSectionRenderer`](file:///c:/laragon/www/suisuto-vendure-v2/apps/storefront/src/site/home/homepage-section-renderer.tsx) to dispatch section configs:
  - `hero`: Dynamic hero with Vendure Asset optimization.
  - `countdown`: Urgency countdown timer.
  - `campaign-banner`: Editorial banner showcasing sub-collections.
  - `featured-collection`: Product grid rendering specific collection slugs (e.g. `'atelier'`).
  - `artisan-story`: Handloom heritage story.
  - `newsletter`: VIP email capture.

### 4.3 Asset Optimization
- Use [`getOptimizedAssetUrl`](file:///c:/laragon/www/suisuto-vendure-v2/apps/storefront/src/platform/vendure/asset.ts) and `getAssetSrcSet` for responsive WebP images.
- Set `fetchPriority="high"` and `loading="eager"` on campaign and homepage hero images.

### 4.4 Multi-Tier Header Navigation
Defined in [`apps/storefront/src/site/navigation/`](file:///c:/laragon/www/suisuto-vendure-v2/apps/storefront/src/site/navigation/):
1. **Tier 1 (`luxury-top-utility.tsx`)**: Region, currency, language, dark mode.
2. **Tier 2 (`announcement-marquee.tsx`)**: Moving campaign privileges and promo codes.
3. **Tier 3 (`navbar.tsx`)**: Logo (center), mega-menu (left), search/user/wishlist/cart (right).

### 4.5 Feature Modules
- **Campaigns** ([`features/campaigns/`](file:///c:/laragon/www/suisuto-vendure-v2/apps/storefront/src/features/campaigns/)): Types, GraphQL documents, 30s TTL in-memory caching (`campaign.server.ts`), and landing page loader functions.
- **Wishlist** ([`features/wishlist/`](file:///c:/laragon/www/suisuto-vendure-v2/apps/storefront/src/features/wishlist/)): React Context + `localStorage`, cross-tab synchronization.
- **Market Detection** ([`features/market/`](file:///c:/laragon/www/suisuto-vendure-v2/apps/storefront/src/features/market/)): Edge country detection from reverse proxy headers and non-intrusive soft suggestion banner (`geo-suggestion-banner.tsx`).
- **Product Cards & Detail** ([`features/products/`](file:///c:/laragon/www/suisuto-vendure-v2/apps/storefront/src/features/products/)): Single-variant instant Add-to-Bag, multi-variant option selection, and custom fields (`originHub`, `fabricCareGuide`, `modelSpecs`).

### 4.6 Modular Market Architecture (`src/markets/`)
- Each geographic market maintains an isolated feature folder:
  - Bangladesh (`src/markets/bd/`): Jamdani, Panjabi, Narayanganj hub, BDT ৳.
  - India (`src/markets/in/`): Banarasi, Bridal couture, Varanasi hub, INR ₹.
  - Global (`src/markets/global/`): Runway ateliers, USD $, cross-border logistics.
- All markets adhere to the `MarketExperience` contract in `src/markets/types.ts`.
- Dispatching is resolved via `getMarketExperience(regionCode)` in `src/markets/registry.ts`.
- Components (`navbar.tsx`, `footer.tsx`) must never contain hardcoded `if (region === 'in')` branches; instead, consume the dynamic `MarketExperience` configuration.

### 4.7 i18n & Localization
- Managed with Paraglide JS (`@/paraglide/messages.js`).
- Supported languages: English (EN), Bengali (BN `বাংলা`), Hindi (HI `हिन्दी`).
- Compile translation dictionaries with `pnpm --filter storefront generate:i18n`.

### 4.8 Cache Revalidation Webhook
- Endpoint: `/api/revalidate`
- Pattern: `/^campaigns?(-.+)?$/`
- Allows Vendure Admin API or webhook triggers to purge edge and in-memory caches instantly when campaign data changes.

---

## 5. Quality Checklist & Verification Commands

Always run these verification commands before declaring work complete:

1. **Storefront Type Checking**:
   ```bash
   pnpm --filter storefront check-types
   ```
2. **Storefront Production Build**:
   ```bash
   pnpm --filter storefront build
   ```
3. **Backend Build Check**:
   ```bash
   pnpm --filter server build
   ```
4. **Database Migrations Check**:
   ```bash
   cd apps/server && npx vendure migrate -r
   ```
