# 11. Refactoring Log & Architectural Updates

This document records the comprehensive architectural refactoring, route pairing completions, performance enhancements, and luxury UI/UX upgrades implemented across the **Suisuto Storefront** and **Vendure Domain Plugins**.

---

## 1. Overview & Refactoring Objectives

The primary objectives of this refactoring initiative were:
1. **Strict Storefront Route Pairing (Rule 4.1)**: Ensure every public page conforms to the paired route architecture (`/page` and `/$region/page`), eliminating 404s and navigation drift when browsing regional storefronts (`/in/`, `/bd/`).
2. **Universal Region-Aware Navigation**: Consolidate route links to utilize the localized link system, ensuring that active regional contexts are persistently maintained across navigation transitions.
3. **Form Architecture & Code Deduplication**: Extract reusable form primitives across checkout workflows, eliminating redundant schema declarations and streamlining state handling.
4. **Editorial Luxury Aesthetic Elevation**: Modernize the checkout flow with high-end luxury e-commerce visuals, micro-interactions, responsive typography, and Haute Couture trust markers.
5. **Domain Plugin Modernization**: Clean up hardcoded assumptions in multi-hub shipping calculations, eliminate redundant database queries in GraphQL resolvers, and expose clean plugin module boundaries.

---

## 2. Storefront Route Pairing (Rule 4.1 Compliance)

In accordance with [`AGENTS.md` Rule 4.1](file:///c:/laragon/www/vendure/AGENTS.md), all storefront routes must maintain root and regional counterparts. Prior to this refactoring, several key conversion and authentication routes existed solely as root routes.

### Paired Routes Created & Verified

| Root Route | Regional Route | Purpose |
| :--- | :--- | :--- |
| [`routes/checkout.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/routes/checkout.tsx) | [`routes/$region.checkout.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/routes/$region.checkout.tsx) | Multi-step regional checkout flow |
| [`routes/order-confirmation.$code.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/routes/order-confirmation.$code.tsx) | [`routes/$region.order-confirmation.$code.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/routes/$region.order-confirmation.$code.tsx) | Post-purchase order summary & fulfillment tracking |
| [`routes/reset-password.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/routes/reset-password.tsx) | [`routes/$region.reset-password.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/routes/$region.reset-password.tsx) | Password reset completion page |
| [`routes/verify.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/routes/verify.tsx) | [`routes/$region.verify.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/routes/$region.verify.tsx) | Customer email verification callback |
| [`routes/verify-pending.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/routes/verify-pending.tsx) | [`routes/$region.verify-pending.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/routes/$region.verify-pending.tsx) | Email verification pending notification |

- **Canonical Region Sync**: Updated [`routes/$region.cart.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/routes/$region.cart.tsx) to generate correct canonical meta URLs (`/${region}/cart`).
- **Route Tree Compilation**: Generated full route tree definitions via `@tanstack/router-cli generate`, successfully updating [`routeTree.gen.ts`](file:///c:/laragon/www/vendure/apps/storefront/src/routeTree.gen.ts).

---

## 3. Universal Region-Aware Navigation System

### Technical Challenge
Direct usage of `@tanstack/react-router` `Link` components easily led to market context loss (e.g. an Indian customer on `/in/cart` clicking a header logo or checkout link and abruptly landing on `/checkout` under the global channel). Furthermore, standard TypeScript typings on generic router links cause type-check errors when wrapped inside custom link proxies.

### Implementation Solution
1. **Decoupled Link Contract ([`apps/storefront/src/platform/tanstack/navigation.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/platform/tanstack/navigation.tsx))**:
   - `LocalizedLinkProps` supports both `href` and `to`, query parameters, and custom state while preserving standard HTML anchor properties without generic routing conflicts.
   - `resolveRegionalHref()` intelligently ignores external URLs (`http`, `mailto`, `tel`), hash fragments (`#`), and relative paths (`./`, `../`), while prepending the current market prefix (e.g., `/in`, `/bd`) to root-relative paths.
   - Exposes comprehensive navigation utilities: `useRouter()` returning both `refresh()` and `invalidate()`, `usePathname()`, `useSearchParams()`, and `redirect()`.
2. **Global Migration**:
   Replaced raw router links with `@/platform/tanstack/navigation` across core user journeys:
   - Cart & Checkout: `cart/routes/order-summary.tsx`, `cart/routes/cart-items.tsx`, `cart-drawer.tsx`, `checkout/routes/steps/contact-step.tsx`, `orders/routes/order-confirmation.tsx`.
   - Authentication: `login-form.tsx`, `registration-form.tsx`, `forgot-password-form.tsx`, `reset-password-form.tsx`, `verify-content.tsx`, `verify-result.tsx`, `verify-pending/page.tsx`.
   - Account Navigation: `account/components/account-nav-links.tsx`, `account/routes/orders/page.tsx`, `account/routes/orders/[code]/order-detail.tsx`.
3. **Server Action Redirect Preservation**:
   Updated checkout server redirects in [`checkout.functions.ts`](file:///c:/laragon/www/vendure/apps/storefront/src/features/checkout/checkout.functions.ts) and [`checkout/routes/actions.ts`](file:///c:/laragon/www/vendure/apps/storefront/src/features/checkout/routes/actions.ts) to prepend `${context.region ? `/${context.region}` : ''}` to redirect targets.

---

## 4. Checkout Architecture & UI/UX Elevation

### Form Modularization
- Extracted [`apps/storefront/src/features/checkout/routes/steps/address-form-fields.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/features/checkout/routes/steps/address-form-fields.tsx):
  - Encapsulates 10 unified input fields (first name, last name, phone, company, street, apt, city, state/province, postal code, country).
  - Deduplicated three redundant instances in [`shipping-address-step.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/features/checkout/routes/steps/shipping-address-step.tsx), reducing component size by nearly 200 lines while retaining accessibility standards (`aria-invalid`, autocomplete tokens).

### Editorial Luxury Aesthetics
- **Step Header Indicator ([`checkout-flow.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/features/checkout/routes/checkout-flow.tsx))**:
  - Replaced basic progress bubbles with refined uppercase tracking, monospace step numbers (`01`, `02`, `03`, `04`), and subtle emerald active-state rings.
- **Delivery Selection ([`delivery-step.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/features/checkout/routes/steps/delivery-step.tsx))**:
  - Implemented interactive luxury cards with border transitions, radio badges, complimentary delivery callouts, and insured transport advisories.
- **Payment Method Cards ([`payment-step.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/features/checkout/routes/steps/payment-step.tsx))**:
  - Introduced partner verification badges (SSLCOMMERZ, Razorpay, Stripe), 256-bit encryption assurances, and active selection highlights.
- **Review & Order Summary ([`review-step.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/features/checkout/routes/steps/review-step.tsx), [`order-summary.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/features/checkout/routes/order-summary.tsx))**:
  - Dual-column summary cards, luxury editorial typography, fallback product imagery ([`getProductFallbackImage`](file:///c:/laragon/www/vendure/apps/storefront/src/features/products/product-fallback.ts)), and the **Suisuto Haute Couture Escrow** trust guarantee.
- **Cart Drawer Quick Navigation Bug Fix**:
  - Fixed an issue in [`cart-drawer.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/features/cart/components/cart-drawer.tsx) where the primary action button pointed to `/cart` instead of `/checkout`.

---

## 5. Domain Plugin Modernization

### `@suisuto/vendure-multi-hub-plugin`
1. **Dynamic Domestic Shipping Calculation ([`shipping/multi-hub-shipping.ts`](file:///c:/laragon/www/vendure/apps/packages/multi-hub/shipping/multi-hub-shipping.ts))**:
   - Replaced static `hub === 'BD_HUB' && country === 'BD'` branching with dynamic `{ISO2}_HUB` prefix evaluation (`hub.startsWith(`${countryCode}_`)`).
   - Generalizes domestic shipping rates across current and future fulfillment hubs without code modifications.
2. **Admin Resolver Optimization ([`resolvers/multi-hub-admin.resolver.ts`](file:///c:/laragon/www/vendure/apps/packages/multi-hub/resolvers/multi-hub-admin.resolver.ts))**:
   - Eliminated an unnecessary database query (`stockLocationService.findAll(ctx)`) inside `multiHubOrders()`, as `isMultiHubOrder()` operates directly on order lines.
   - Introduced constant-driven carrier and hub code mapping dictionaries (`HUB_CARRIER_MAP`, `COUNTRY_HUB_MAP`).

### `@suisuto/vendure-multi-market-plugin`
1. **Public Event API ([`multi-market/index.ts`](file:///c:/laragon/www/vendure/apps/packages/multi-market/index.ts))**:
   - Exported `MarketEvent` from package root to enable type-safe subscription by downstream event listeners and analytics plugins.

---

## 6. Luxury Animation Engine & Universal Scroll Reveal System

### 6.1 Context & Problem Statement
Prior to this enhancement, animation capabilities across the storefront were fragmented:
1. **Missing Scroll Triggers**: Only `ShopByCategoryGrid` was hooked into scroll observation. The remaining 10+ dynamic homepage sections lacked scroll-triggered entrances, causing them to render statically as the user scrolled down and up the page.
2. **CSS Parallax Invalidation**: In Chromium browsers, `@supports ((animation-timeline: view()) and (animation-range: entry))` evaluated to `false` because `animation-range: entry` without values is not valid CSS syntax, disabling native scroll-driven parallax movement.
3. **No Native Smooth Scrolling**: Browser-level smooth momentum scrolling was absent, making navigation jumps feel abrupt.

### 6.2 Architectural Enhancements
1. **Universal Scroll Reveal Wrapper ([`apps/storefront/src/components/scroll-reveal-section.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/components/scroll-reveal-section.tsx))**:
   - Encapsulates off-main-thread `IntersectionObserver` with an optimized trigger threshold (`0.02`) and root margin (`-30px`) so sections begin entering smoothly as soon as their upper boundary approaches the viewport.
   - Dynamic GPU acceleration: attaches `will-change: opacity, transform` during transitions and automatically purges the GPU compositor layer via `setTimeout` after entrance completion, preserving mobile device VRAM.
   - Preserves SSR hydration integrity (elements remain visible during SSR, with client-side progressive enhancement on mount).
2. **Dynamic Section Dispatcher Wrapping ([`apps/storefront/src/site/home/homepage-section-renderer.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/homepage-section-renderer.tsx))**:
   - Wrapped all 11 below-the-fold homepage section cases (`featured-collection`, `video-banner`, `seasonal-collection`, `category-grid-3x3`, `brand-grid-3x3`, `artisan-story`, `atelier-pillars`, `bestselling-slides`, `now-trending`, `shop-the-mood`, `newsletter`, `countdown`) with `<ScrollRevealSection>`.
   - Preserves above-the-fold `hero` on-load reveal.
3. **Chromium-Compliant CSS Scroll-Driven Parallax ([`apps/storefront/src/storefront.css`](file:///c:/laragon/www/vendure/apps/storefront/src/storefront.css))**:
   - Simplified to `@supports (animation-timeline: view())`, activating 120 FPS bidirectional `banner-parallax` keyframe animations as users scroll down and up past media containers.
4. **Native Smooth Momentum Scrolling ([`apps/storefront/src/storefront.css`](file:///c:/laragon/www/vendure/apps/storefront/src/storefront.css))**:
   - Added `html { scroll-behavior: smooth; }` in `@layer base`, guarded by `prefers-reduced-motion` overrides.

---

## 7. Multi-Market Plugin Security, Validation & Transaction Audit

A rigorous enterprise audit of `@suisuto/vendure-multi-market-plugin` was conducted across security, validation, performance, and transactional consistency.

### 7.1 Security & Access Control
1. **Mutation RBAC Hardening ([`resolvers/market-admin.resolver.ts`](file:///c:/laragon/www/vendure/apps/packages/multi-market/resolvers/market-admin.resolver.ts))**:
   - Decorated `createMarket`, `updateMarket`, and `deleteMarket` mutations with `@Allow(Permission.SuperAdmin)`.
   - Prevented unauthorized catalog routing reconfigurations by unauthenticated users or lower-tier administrators.
2. **Open Redirect & Host Smuggling Prevention ([`services/market-detection.service.ts`](file:///c:/laragon/www/vendure/apps/packages/multi-market/services/market-detection.service.ts))**:
   - Sanitized input URLs in `switchMarket()` against dangerous URI schemes (`javascript:`, `data:`, `vbscript:`).
   - Stripped protocol-relative prefixes (`//malicious.com`) to prevent host smuggling and open redirect vulnerabilities during regional market switching.
3. **Environment-Gated Simulation Headers ([`services/market-detection.service.ts`](file:///c:/laragon/www/vendure/apps/packages/multi-market/services/market-detection.service.ts))**:
   - Enforced `allowMockHeaders: process.env.NODE_ENV !== 'production'` by default.
   - Headers like `x-mock-country` and `x-suisuto-mock-country` are ignored in production environments, preventing malicious geo-spoofing while retaining developer and QA testing ergonomics.

### 7.2 Strict Input Validation
1. **ISO 3166-1 Alpha-2 Code Constraints**:
   - Validated that market codes are 2-letter uppercase ISO format (`/^[A-Z]{2}$/`).
   - Sanitized visitor country codes extracted from CDN headers (`cf-ipcountry`, `x-vercel-ip-country`, `cloudfront-viewer-country`). Any non-conforming or symbol-laden values fall back gracefully to the default market.
2. **URL Prefix Sanitization**:
   - Enforced clean routing prefixes (regex `/^\/?[a-z0-9_-]+\/?$/`) and rejected path-traversal sequences (`../`, `./`, `%2e%2e`).

### 7.3 Transactional Atomicity
- In `switchMarket()`, database updates to the default market (`isDefault`) are wrapped in explicit database transactions via `TransactionalConnection`. If setting a new default succeeds but clearing the previous default fails, the transaction is cleanly rolled back, preventing orphaned or split default market states.

---

## 8. React 19 Async Hooks & Streaming Header Resilience

### 8.1 Technical Challenge: `use(): undefined`
With React 19 and TanStack Start, the native `use()` hook throws `An unsupported type was passed to use(): undefined` if a promise property passed to `<Await promise={...}>` resolves to `undefined`.
In root and regional headers (`bd-header.tsx`, `in-header.tsx`, `global-header.tsx`, `mobile-nav.tsx`), `personalized` data (`cartItemCount`, `customerFirstName`) is deferred to stream the public shell instantly without blocking SSR. When browsing before cart initialization or when SSR headers omitted personalized promises, the components crashed the client hydration.

### 8.2 Architectural Solution
1. **Defensive Promise Guarding**:
   - Added conditional presence checks before invoking `<Await promise={...}>`:
     ```tsx
     {personalized ? (
       <Await promise={personalized}>
         {(data) => <CartIndicator count={data?.cartItemCount ?? 0} />}
       </Await>
     ) : (
       <CartIndicator count={0} />
     )}
     ```
   - Standardized across all tier 3 navigation headers, mobile menus, and collection product listings.
2. **Hydration Uniformity**:
   - Ensured fallback indicators render with identical DOM dimensions, eliminating Cumulative Layout Shift (CLS) during streaming resolution.

---

## 9. Storefront Landing Page Fault-Tolerance & Resilience

### 9.1 Root Cause of Landing Page Error Boundary
When a customer encountered:
```
Something went wrong
An unexpected error occurred. Please try again.
```
in the middle of the landing page, the root cause was traced to two compounding factors:
1. **Uncaught Shell Rejection**:
   - In [`apps/storefront/src/site/shell.functions.ts`](file:///c:/laragon/www/vendure/apps/storefront/src/site/shell.functions.ts), queries for `getActiveChannel` and `GetTopCollectionsQuery` had no fallback handling. If the Vendure backend was restarting or experiencing network latency, `queryOnServer` threw `fetch failed`, which bubbled uncaught into `__root__.tsx`'s loader, causing TanStack Router to mount `StorefrontError` inside `<main>{children}</main>`.
2. **Empty Array Slides Crash**:
   - In [`FullWidthSlidesSection`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/full-width-slides-section.tsx), passing `slides: []` bypassed parameter default values, causing `slides[0]` to evaluate to `undefined` and throwing `Cannot read properties of undefined (reading 'tag')`.
   - Homepage sections had no per-section isolation, allowing a single section defect to crash the entire landing page.

### 9.2 Complete Resilience Implementation
1. **Public Shell Defensive Recovery ([`shell.functions.ts`](file:///c:/laragon/www/vendure/apps/storefront/src/site/shell.functions.ts) & [`__root__.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/routes/__root.tsx))**:
   - Provided fallback channel objects matching `ActiveChannelFragment` if `getActiveChannel()` fails.
   - Wrapped `GetTopCollectionsQuery` in a try/catch returning `[]`.
   - Guarded `getPublicShellData()` in `__root__.tsx` so backend unavailability never crashes the shell navigation or footer.
2. **Safe Landing Page Loader ([`home.functions.ts`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/home.functions.ts))**:
   - Wrapped `getHomeData()` in a top-level `try / catch` returning pre-configured market experience layouts (`DEFAULT_SECTIONS` or regional presets) if catalog queries fail.
3. **Empty Array Guards across Homepage Grids**:
   - Added `validSlides`, `validCategories`, and `validBrands` guards in [`full-width-slides-section.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/full-width-slides-section.tsx), [`shop-by-category-grid.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/shop-by-category-grid.tsx), and [`shop-by-brand-grid.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/shop-by-brand-grid.tsx).
   - Fixed JSX syntax typo placing `key={currentIndex}` inside className in `FullWidthSlidesSection`.
4. **Section-Level Error Boundary ([`apps/storefront/src/site/home/page.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/page.tsx))**:
   - Implemented `SectionErrorBoundary` around each section in the dynamic homepage sequence.
   - Any rendering anomaly in a specific section is safely caught and suppressed, leaving the rest of the landing page fully interactive.

---

## 10. Master Verification & Quality Matrix

All verification commands defined in [`AGENTS.md` Section 5](file:///c:/laragon/www/vendure/AGENTS.md) execute cleanly with zero errors:

| Check / Test Suite | Command | Result |
| :--- | :--- | :--- |
| **Storefront Type Check** | `pnpm --filter storefront check-types` | **Passed (0 errors)** |
| **Storefront Production Build** | `pnpm --filter storefront build` | **Passed (Clean Nitro bundle)** |
| **Backend TypeScript Check** | `pnpm --filter server exec tsc --noEmit` | **Passed (0 errors)** |
| **Multi-Market Plugin Tests** | `pnpm run test:multi-market` | **Passed (36/36 tests)** |
| **Multi-Hub Plugin Tests** | `pnpm run test:multi-hub` | **Passed (17/17 tests)** |
| **Multi-Hub Plugin Build** | `pnpm --filter @suisuto/vendure-multi-hub-plugin build` | **Passed** |
| **Storefront SSR HTTP Checks** | `curl -s http://localhost:3001/`, `/bd`, `/in` | **Passed (200 OK, 0 error states)** |

---

## 11. Production Containerization & CI/CD Packaging

### 11.1 Base Environment & Dockerfile Modernization
- **Node.js Base**: Upgraded all production container layers to `node:24-trixie-slim`.
- **Storefront Packaging ([`apps/storefront/Dockerfile`](file:///c:/laragon/www/vendure/apps/storefront/Dockerfile))**: Multi-stage build producing a standalone `.output/` Nitro bundle running under a non-root `USER node` on port `3001`.
- **Backend Server Packaging ([`apps/server/Dockerfile`](file:///c:/laragon/www/vendure/apps/server/Dockerfile))**: Multi-stage compilation installing build essentials (`python3`, `make`, `g++`) for native extensions (`sharp`, `bcrypt`), compiling plugin packages and Vite dashboard, and exporting the production server and worker on port `3000`.

### 11.2 GitHub Actions CI/CD Automated Publishing
- **Workflow ([`.github/workflows/docker-publish.yml`](file:///c:/laragon/www/vendure/.github/workflows/docker-publish.yml))**:
  - Triggers **strictly on user git version tags** (`v*`, e.g. `v1.0.0`), preventing unversioned image proliferation.
  - Builds and pushes `suisuto-server` and `suisuto-storefront` to GitHub Container Registry (`ghcr.io`).
  - Supports manual dispatch (`workflow_dispatch`) with explicit version tag validation.

### 11.3 Docker Compose Topologies
- **Local Testing ([`docker-compose.local.yml`](file:///c:/laragon/www/vendure/docker-compose.local.yml))**: Builds from local context with PostgreSQL 16, Redis 8, Vendure Server, and Storefront with `DB_SYNCHRONIZE=true`.
- **Production ([`docker-compose.prod.yml`](file:///c:/laragon/www/vendure/docker-compose.prod.yml))**: Pulls versioned GHCR images (`ghcr.io/owner/suisuto-server:v1.0.0`) with automated health checks, restart policies, and worker container isolation.

---

## 12. Database Migration Consolidation & Schema Synchronization

### 12.1 Root Cause of Empty DB Bootstrapping Failures
- The codebase originally had 9 delta migrations created on an already-populated database, lacking an initial baseline migration for core Vendure tables.
- Hardcoded `synchronize: false` combined with unconditional `runMigrations(config)` prior to `bootstrap` caused fresh containers to crash with `relation "product" does not exist`.

### 12.2 Consolidation into `SuisutoInit1790150000000`
- Consolidated all 9 piecemeal migrations into a single authoritative, idempotent migration script:
  [`apps/server/src/migrations/1790150000000-suisuto_init.ts`](file:///c:/laragon/www/vendure/apps/server/src/migrations/1790150000000-suisuto_init.ts).
- Enforces `ADD COLUMN IF NOT EXISTS`, `CREATE TABLE IF NOT EXISTS`, and `CREATE INDEX IF NOT EXISTS` across:
  - Product custom fields (`originHub`, `fabricCareGuide`, `modelSpecs`, `hsCode`)
  - Order custom fields (`recipientKycId`, `isMultiHubOrder`)
  - Stock Location custom fields (`hubCode`, `countryCode`, `domesticCarrier`, `crossBorderCarrier`, `standardTransitDays`)
  - Market entity and indices (`code` UNIQUE, `urlPrefix`, `channelCode`, `enabled`, `isDefault`)
- Deleted all 9 fragmented migration files.

### 12.3 Dynamic `DB_SYNCHRONIZE` Support
- Updated [`apps/server/src/vendure-config.ts`](file:///c:/laragon/www/vendure/apps/server/src/vendure-config.ts) and [`apps/server/src/index.ts`](file:///c:/laragon/www/vendure/apps/server/src/index.ts):
  - When `DB_SYNCHRONIZE=true`, `runMigrations` is safely bypassed and TypeORM directly synchronizes the schema and triggers `InitializerService` default seeding.
  - When `DB_SYNCHRONIZE=false` (standard production), `runMigrations(config)` executes the consolidated migration sequentially.

---

## 13. Retirement of Legacy CampaignPlugin

- **Architectural Shift**: Regional marketing campaigns, editorial banners, urgency countdowns, and collection groupings are now completely managed by the frontend modular market architecture ([`apps/storefront/src/markets/`](file:///c:/laragon/www/vendure/apps/storefront/src/markets/): `/bd/`, `/in/`, `/global/`).
- **Backend Cleanliness**: All server-side campaign entities, indexes, and migration queries were excised, and `1790150000000-suisuto_init.ts` automatically cleans up any legacy `campaign` table (`DROP TABLE IF EXISTS "campaign" CASCADE;`).


