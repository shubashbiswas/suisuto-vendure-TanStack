# Multi-Market Campaign Architecture & Operations

This document details the multi-market, campaign-aware architecture implemented across the Vendure backend and TanStack Start storefront. It outlines the schema, API surface, dynamic merchandising engine, operational workflows, and live campaigns.

---

## 1. Architectural Overview & Objectives

### 1.1 Core Objectives
1. **Market Isolation**: Campaigns created for a specific market (e.g. India `/in` or Bangladesh `/bd`) must not leak into other regional storefronts or the global storefront (`/`).
2. **Zero-Code Merchandising**: Marketing and operational teams can configure campaigns, home banner heroes, countdowns, section sequences, promotional codes, and sub-slug landing pages via the Vendure Admin API without deploying new frontend code.
3. **Dynamic Section Composition**: Storefront homepages are dynamically constructed by `HomepageSectionRenderer` based on campaign configurations, with graceful fallbacks to market defaults when no campaign is active.
4. **Hydration & Asset Performance**: Urgency countdown timers run strictly on the client after mount to prevent SSR hydration mismatches. Hero visual assets leverage Vendure Asset Server optimization (`format=webp`, `w=1920`, responsive `srcset`).

### 1.2 Architecture Flow

```
                               [ Vendure Admin API / Operator ]
                                              │
                                              ▼
                                   [ CampaignPlugin (Server) ]
                                              │
                     ┌────────────────────────┴────────────────────────┐
                     ▼                                                 ▼
             [ PostgreSQL DB ]                                 [ Shop API ]
             Table: `campaign`                                 activeCampaigns(market)
                     │                                         campaignBySlug(market, slug)
                     │                                                 │
                     │                                                 ▼
                     │                                   [ Storefront Edge / SSR ]
                     │                                                 │
         ┌───────────┴───────────┐                         ┌───────────┴───────────┐
         ▼                       ▼                         ▼                       ▼
   [ India Channel ]      [ BD Channel ]              [ /in Route ]           [ /bd Route ]
   Diwali / Durga Puja    Eid / Durga Puja            Dynamic Hero            Dynamic Hero
   DIWALI20 / SHAROD20    EID2026 / SHAROD20          Countdown Timer         Countdown Timer
                                                      Curated Silks           Dhakai Muslins
```

---

## 2. Backend Implementation (`@suisuto/vendure-multi-campaign-plugin`)

The campaign management subsystem is implemented as an autonomous Vendure plugin in [`apps/packages/multi-campaign/`](file:///c:/laragon/www/suisuto-vendure-v2/apps/packages/multi-campaign):

```
apps/packages/multi-campaign/
├── constants/          # Action constants, default section definitions
├── dashboard/          # Vendure Admin Dashboard extension
├── entities/           # Campaign entity with indexes
├── events/             # CampaignEvent definition
├── resolvers/          # Shop and Admin GraphQL resolvers
├── services/           # CampaignService with EventBus & validation
├── tests/              # Jest unit & integration tests
├── types/              # TypeScript & GraphQL types
├── multi-campaign.plugin.ts  # Main plugin with .init() options
├── package.json
└── README.md           # Documentation, GraphQL API reference & SOPs
```

### 2.1 TypeORM Entity: `Campaign`
Located at [`apps/packages/multi-campaign/entities/campaign.entity.ts`](file:///c:/laragon/www/suisuto-vendure-v2/apps/packages/multi-campaign/entities/campaign.entity.ts):

- **Table**: `campaign`
- **Fields**:
  - `id`: Primary key (TypeORM auto-generated).
  - `market`: Market identifier (`'in'`, `'bd'`, `'global'`).
  - `name`: Human-readable name of the campaign.
  - `slug`: Lowercase kebab-case URL slug (e.g., `'diwali'`, `'eid'`, `'durga-puja'`).
  - `status`: Campaign status (`'draft'`, `'active'`, `'archived'`).
  - `priority`: Integer priority score (default `0`) for deterministic conflict resolution when multiple campaigns are concurrently active.
  - `startAt` / `endAt`: Active scheduling window (`timestamp with time zone`).
  - `heroImageUrl`: Asset URL for the hero section background.
  - `heroHeadline`, `heroSubHeadline`, `heroCtaLabel`, `heroCtaHref`, `heroTag`: Visual hero styling and links.
  - `homepageSections`: JSON array of section objects `[{ type: "hero" }, { type: "countdown", props: {...} }, ...]`.
  - `landingPages`: JSON array of sub-slug landing pages `[{ subSlug: "offers", title: "...", sections: [...] }]`.
  - `promotionCode`: Voucher / coupon code displayed across hero alerts and banners.
  - `seoTitle`, `seoDescription`, `seoImage`: Dynamic OpenGraph / meta tags.
  - `banners`: JSON array of promotional banners `[{ imageUrl, headline, href }]`.
- **Database Indexes**:
  - `@Index(['market', 'slug'], { unique: true })`: Prevents duplicate URL slugs within the same regional market.
  - `@Index(['market', 'status'])`: Optimizes high-throughput Shop API queries fetching active campaigns for a market.

### 2.2 Database Migrations
Applied via TypeORM migrations in `apps/server/src/migrations/`:
1. `1790046009828-add_campaign_entity.ts`: Initial `campaign` table creation.
2. `1790046009829-campaign_indexes_and_priority.ts`: Added `priority` column and composite unique/status indexes.
3. `1790140748431-sync_schema.ts`: Schema sync & index naming reconciliation.

### 2.3 Service Layer (`CampaignService`)
Located at [`apps/packages/multi-campaign/services/campaign.service.ts`](file:///c:/laragon/www/suisuto-vendure-v2/apps/packages/multi-campaign/services/campaign.service.ts):
- **Active Query Logic (`findActive`)**: Filters by normalized market code (`market.toLowerCase()`), `status = 'active'`, and time boundary `startAt <= NOW() <= endAt`. Results are sorted deterministically:
  ```typescript
  .orderBy('campaign.priority', 'DESC')
  .addOrderBy('campaign.createdAt', 'DESC')
  ```
- **Slug Resolution (`findBySlug`)**: Finds specific campaigns matching both `market` and `slug`.
- **Integrity Validation**:
  - Slug regex validation: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`
  - Market uniqueness: Checks for existing campaign with identical `(market, slug)` on creation and slug update.
  - Date sanity: Asserts `startAt <= endAt`.
- **EventBus Integration**: Emits `CampaignEvent(ctx, campaign, 'created' | 'updated' | 'deleted')` upon all lifecycle mutations.

### 2.4 EventBus & Automated Cache Invalidation
Configured in `MultiCampaignPlugin.init({ storefrontRevalidateUrl, revalidateSecret })`:
- When a `CampaignEvent` is fired, `MultiCampaignPlugin` automatically sends an authenticated HTTP `POST` request to the storefront's `/api/revalidate` endpoint:
  ```json
  {
    "tags": [
      "campaigns",
      "campaign-in",
      "campaign-diwali"
    ]
  }
  ```
- Purges edge SSR caches and in-memory caches instantly without manual administrator action.

### 2.5 GraphQL Resolvers & APIs
- **Shop API** ([`resolvers/campaign-shop.resolver.ts`](file:///c:/laragon/www/suisuto-vendure-v2/apps/packages/multi-campaign/resolvers/campaign-shop.resolver.ts)):
  ```graphql
  extend type Query {
    activeCampaigns(market: String!): [Campaign!]!
    campaignBySlug(market: String!, slug: String!): Campaign
  }
  ```
- **Admin API** ([`resolvers/campaign-admin.resolver.ts`](file:///c:/laragon/www/suisuto-vendure-v2/apps/packages/multi-campaign/resolvers/campaign-admin.resolver.ts)):
  Protected with `@Allow(Permission.SuperAdmin, Permission.Authenticated)`:
  ```graphql
  extend type Query {
    campaigns(market: String, status: String): [Campaign!]!
    campaign(id: ID!): Campaign
  }

  extend type Mutation {
    createCampaign(input: CreateCampaignInput!): Campaign!
    updateCampaign(input: UpdateCampaignInput!): Campaign!
    deleteCampaign(id: ID!): DeletionResponse!
  }
  ```

---

## 3. Storefront Implementation (`apps/storefront`)

### 3.1 Dynamic Section Engine
Located at `apps/storefront/src/site/home/homepage-section-renderer.tsx`:
Supported section types:
1. `hero`: Dynamic hero with Vendure Asset URL optimization and responsive `srcset`.
2. `countdown`: Client-side urgency timer with target date and headline.
3. `campaign-banner`: Editorial luxury image banner pointing to campaign sub-routes.
4. `featured-collection`: Product grid rendering curated collection slugs (e.g. `'atelier'`).
5. `artisan-story`: Editorial atelier heritage narrative.
6. `newsletter`: Exclusive VIP subscriber signup.

### 3.2 Campaign Landing Pages & Sub-Route Support
Full splat route routing enables dynamic nested sub-pages:
- **Global Routes**:
  - `/campaign/$slug` (`apps/storefront/src/routes/campaign.$slug.tsx`)
  - `/campaign/$slug/*` (`apps/storefront/src/routes/campaign.$slug.$.tsx`)
- **Regional Routes**:
  - `/$region/campaign/$slug` (`apps/storefront/src/routes/$region.campaign.$slug.tsx`)
  - `/$region/campaign/$slug/*` (`apps/storefront/src/routes/$region.campaign.$slug.$.tsx`)

### 3.3 Non-Intrusive Edge Geo-Suggestion
Located at `apps/storefront/src/features/market/geo-suggestion-banner.tsx`:
- Detects user country via proxy headers (`CF-IPCountry`, `X-Vercel-IP-Country`, `CloudFront-Viewer-Country`).
- If an Indian visitor lands on `/` or `/bd`, a soft luxury banner invites them to switch to the India Atelier (`/in`).
- Respects user dismissal using `sessionStorage`.

---

## 4. Active Campaigns in Database

| ID | Market | Campaign Name | Slug | Status | Promo Code | Sub-Routes & Landing Pages |
|:---|:---|:---|:---|:---|:---|:---|
| **1** | `in` (India) | **Diwali 2026 Festive Collection** | `diwali` | `active` | `DIWALI20` | `/in/campaign/diwali/offers` |
| **2** | `bd` (Bangladesh) | **Eid 2026 Jamdani Edit** | `eid` | `active` | `EID2026` | `/bd/campaign/eid` |
| **3** | `bd` (Bangladesh) | **Durga Puja 2026 Sharodiya Edit** | `durga-puja` | `active` | `SHAROD20` | `/bd/campaign/durga-puja/garad-silks`<br>`/bd/campaign/durga-puja/festive-men` |
| **4** | `in` (India) | **Durga Puja 2026 Sharodiya Edit** | `durga-puja` | `active` | `SHAROD20` | `/in/campaign/durga-puja/garad-silks`<br>`/in/campaign/durga-puja/festive-men` |

---

## 5. Merchandiser & Operator SOP

### 5.1 Creating a New Campaign via GraphQL
To schedule a new campaign, execute `createCampaign` against the Vendure Admin API (`/admin-api`):

```graphql
mutation CreateCampaignExample {
  createCampaign(input: {
    market: "bd"
    name: "Pohela Boishakh 1433"
    slug: "boishakh"
    status: "active"
    startAt: "2026-04-01T00:00:00Z"
    endAt: "2026-04-15T23:59:59Z"
    heroImageUrl: "/images/hero-campaign.jpg"
    heroHeadline: "New Year, Heirloom Weaves"
    heroSubHeadline: "Celebrating Nababarsho with crimson and ivory hand-spun cotton Jamdanis."
    heroCtaLabel: "Explore Festive Collection"
    heroCtaHref: "/bd/campaign/boishakh"
    heroTag: "Nababarsho 1433"
    promotionCode: "BOISHAKH15"
    homepageSections: [
      { type: "hero" }
      { type: "countdown", props: { headline: "Festive Loom Allocation Closes In" } }
      { type: "campaign-banner" }
      { type: "featured-collection", props: { collectionSlug: "atelier", title: "Handloom Muslins" } }
      { type: "newsletter" }
    ]
    landingPages: [
      {
        subSlug: "jamdani-exclusive"
        title: "Exclusive Nababarsho Jamdanis"
        sections: [
          { type: "countdown", props: { headline: "Allocation Window" } }
          { type: "featured-collection", props: { collectionSlug: "atelier", title: "Festival Jamdanis" } }
        ]
        seoTitle: "Nababarsho Jamdani Collection | Suisuto BD"
        seoDescription: "Heirloom handcrafted Jamdani sarees for Pohela Boishakh."
      }
    ]
    seoTitle: "Pohela Boishakh 1433 Collection | Suisuto Bangladesh"
    seoDescription: "Celebrate Bengali New Year with master-woven handlooms."
  }) {
    id
    name
    status
    market
  }
}
```

### 5.2 Direct Database Seeding Utility
To seed or programmatically manage campaigns, use the standalone CommonJS scripts in `apps/server/`:
- `apps/server/seed-campaign.cjs`
- `apps/server/create-durga-puja-campaign.cjs`

Execute via:
```bash
cd apps/server
node create-durga-puja-campaign.cjs
```

### 5.3 On-Demand Cache Invalidation
When updating campaign copy or activating an emergency announcement, call the revalidation webhook:
```bash
POST /api/revalidate
Content-Type: application/json
x-revalidate-secret: <SECRET>

{
  "tags": ["campaigns", "campaigns-in", "campaigns-bd"]
}
```
This purges in-process storefront memory caches and stale edge SSR pages immediately.

### 5.4 Admin Dashboard Management UI
The Vendure Admin Dashboard (`/dashboard`) includes a dedicated **Campaigns** control page under **Marketing** implemented in [`dashboard/campaign-control-page.tsx`](file:///c:/laragon/www/suisuto-vendure-v2/apps/packages/multi-campaign/dashboard/campaign-control-page.tsx):
- **Sidebar Location**: `Marketing` $\to$ `Campaigns` (`/dashboard/campaigns`).
- **Control Features**:
  - Real-time campaign registry display with metrics for India, Bangladesh, and Global.
  - Interactive status toggles (`Active`, `Draft`, `Archived`).
  - Priority numeric controls for scheduling precedence.
  - Datetime input fields for `startAt` and `endAt` windows.
  - Hero image URL configuration with live visual preview.
  - Featured collection slug selector (e.g. `'atelier'`) for dynamic collection showcases.
  - One-click storefront preview links directly opening regional landing pages.
  - "New Campaign" modal wizard for configuring regional market, slug, promotional codes, and hero banners.
  - Edit & delete capabilities integrated directly with the Vendure Admin GraphQL API.

---

## 6. Verification & Automated Testing

The plugin includes a dedicated Jest test suite in [`tests/campaign.spec.ts`](file:///c:/laragon/www/suisuto-vendure-v2/apps/packages/multi-campaign/tests/campaign.spec.ts).

### Running Tests:
```bash
# Run multi-campaign tests from repository root
pnpm run test:multi-campaign

# Or run directly within package directory
pnpm --filter @suisuto/vendure-multi-campaign-plugin test
```

### Coverage Assertions:
1. Filters active campaigns strictly within scheduled date windows (`startAt <= NOW() <= endAt`).
2. Isolates campaigns strictly by regional market identifier.
3. Orders multiple concurrent active campaigns by `priority DESC` and `createdAt DESC`.
4. Enforces URL slug validation (lowercase kebab-case regex `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`).
5. Rejects duplicate slugs within the same regional market.
6. Enforces temporal sanity (`startAt <= endAt`).
7. Emits `CampaignEvent` to Vendure `EventBus` on creation, update, and deletion.


