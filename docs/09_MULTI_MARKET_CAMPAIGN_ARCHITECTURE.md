# 09. Multi-Market Merchandising & Campaign Strategy

## 1. Executive Summary & Architecture Evolution

The Suisuto platform delivers curated, culturally resonant luxury merchandising across three primary markets:
- **Bangladesh (`/bd`)**: Bengali handloom heritage, Dhakai Jamdani, festive Eid and Pohela Boishakh edits, Narayanganj hub, BDT (`৳`).
- **India (`/in`)**: Regal Indian couture, Varanasi Katan silks, Diwali and Bridal edits, Varanasi hub, INR (`₹`).
- **Global (`/` or `/global`)**: Runway ateliers, quiet luxury, dual-hub export, USD (`$`).

### Evolution from Backend Plugin to Storefront-Native Market Architecture

Historically, campaign data was managed through an experimental Vendure backend plugin (`CampaignPlugin`) with a TypeORM database table. This created runtime dependencies between database migrations and frontend release cycles.

The platform evolved to a **Storefront-Native Modular Market Strategy** ([`apps/storefront/src/markets/`](file:///c:/laragon/www/vendure/apps/storefront/src/markets/)):
1. **Zero Database Drift**: Regional merchandising configs, hero banners, countdown targets, and collection links require zero database migrations or backend queries.
2. **Instant Edge Delivery**: Merchandising configurations are evaluated statically and server-rendered on the edge with zero database query latency.
3. **Strict Type Safety**: All market configurations adhere to the strict [`MarketExperience`](file:///c:/laragon/www/vendure/apps/storefront/src/markets/types.ts) contract.
4. **Hydration Integrity**: Countdown clocks, marquee tickers, and interactive badges run hydration-safe with zero SSR mismatches.

---

## 2. Architecture Topology

```
                                [ Visitor Request ]
                                         │
                                         ▼
                             [ Edge / Reverse Proxy ]
                   (Geo-IP: CF-IPCountry, X-Vercel-IP-Country)
                                         │
                                         ▼
                          [ TanStack Start Storefront ]
                               (apps/storefront)
                     ┌───────────────────┼───────────────────┐
                     ▼                   ▼                   ▼
              [ Global Market ]   [ India Market ]    [ BD Market ]
                    (/)                (/in)              (/bd)
                     │                   │                   │
                     ▼                   ▼                   ▼
              global-experience     in-experience       bd-experience
                     │                   │                   │
                     └───────────────────┼───────────────────┘
                                         │
                                         ▼
                          [ HomepageSectionRenderer ]
             ┌───────────────────────────┼───────────────────────────┐
             ▼                           ▼                           ▼
        [ Hero Section ]       [ Countdown Timer ]       [ Featured Collection ]
      (Optimized WebP Asset)    (Client Mount Safe)        (Vendure Shop API)
```

---

## 3. The `MarketExperience` Interface Contract

Located at [`apps/storefront/src/markets/types.ts`](file:///c:/laragon/www/vendure/apps/storefront/src/markets/types.ts):

```typescript
export interface MarketExperience {
  region: "bd" | "in" | "global";
  marketName: string;
  nativeName?: string;
  tagline: string;
  heroHeadline: string;
  heroSubHeadline: string;
  heroTag: string;
  heroImageUrl: string;
  heroCtaLabel: string;
  heroCtaHref: string;
  accentColor: string;
  currencyCode: string;
  currencySymbol: string;
  originHub: "BD_HUB" | "IN_HUB" | "DUAL_HUB";
  primaryCollectionSlug: string;
  navigation: {
    primaryLinks: Array<{ label: string; href: string; badge?: string }>;
    marqueeAnnouncements: string[];
    quickCategories: Array<{ label: string; href: string }>;
  };
  editorial: {
    storyTitle: string;
    storySubtitle: string;
    artisanStoryLabel: string;
  };
  footer: {
    boutiqueAddress: string;
    customerCareEmail: string;
    conciergePhone: string;
    exclusivePerks: string[];
    heritageStatement: string;
  };
}
```

### 3.1 Registry Resolution (`registry.ts`)
The central registry in [`apps/storefront/src/markets/registry.ts`](file:///c:/laragon/www/vendure/apps/storefront/src/markets/registry.ts) dynamically resolves the active market experience with automatic fallback to Global:

```typescript
import { bdMarketExperience } from "./bd/bd-experience";
import { inMarketExperience } from "./in/in-experience";
import { globalMarketExperience } from "./global/global-experience";
import type { MarketExperience } from "./types";

const MARKET_EXPERIENCES: Record<string, MarketExperience> = {
  bd: bdMarketExperience,
  in: inMarketExperience,
  global: globalMarketExperience,
};

export function getMarketExperience(regionCode?: string): MarketExperience {
  if (!regionCode) return globalMarketExperience;
  const normalized = regionCode.toLowerCase().trim();
  return MARKET_EXPERIENCES[normalized] || globalMarketExperience;
}
```

---

## 4. Dynamic Section Composition Engine

Homepages and landing pages utilize [`HomepageSectionRenderer`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/homepage-section-renderer.tsx) to compose sections dynamically:

1. **`hero`**:
   - Visual campaign backdrop using Vendure Asset Server optimization.
   - Injected with `fetchPriority="high"` and `loading="eager"`.
   - Responsive `srcset` generated via [`getAssetSrcSet`](file:///c:/laragon/www/vendure/apps/storefront/src/platform/vendure/asset.ts).
2. **`countdown`**:
   - Seasonal sale / loom closing urgency timer.
   - Executes strictly on the client after mount (`useEffect` / `useState`) to guarantee hydration consistency between server and client.
3. **`campaign-banner`**:
   - Editorial highlight banner pointing to specialized sub-collections (e.g., Jamdani edit, Banarasi bridal).
4. **`featured-collection`**:
   - Product grid querying the Vendure Shop API for collection slugs (e.g. `'atelier'`).
5. **`artisan-story`**:
   - Cultural narrative celebrating master weavers in Narayanganj and Varanasi.
6. **`newsletter`**:
   - VIP private client email capture.

---

## 5. Campaign Routes & Sub-Pages

Under the **Route Pairing Rule (Rule 4.1)** in `AGENTS.md`, every public campaign page possesses paired routes:

| Route Path | File Location | Purpose |
| :--- | :--- | :--- |
| `/campaign/$slug` | [`apps/storefront/src/routes/campaign.$slug.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/routes/campaign.$slug.tsx) | Global campaign landing page |
| `/$region/campaign/$slug` | [`apps/storefront/src/routes/$region.campaign.$slug.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/routes/$region.campaign.$slug.tsx) | Regional campaign landing page (`/bd`, `/in`) |
| `/campaign/$slug/*` | [`apps/storefront/src/routes/campaign.$slug.$.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/routes/campaign.$slug.$.tsx) | Global campaign sub-page (e.g. `/campaign/diwali/offers`) |
| `/$region/campaign/$slug/*` | [`apps/storefront/src/routes/$region.campaign.$slug.$.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/routes/$region.campaign.$slug.$.tsx) | Regional campaign sub-page (e.g. `/in/campaign/diwali/offers`) |

---

## 6. Non-Intrusive Edge Geo-Suggestion

Located at [`apps/storefront/src/features/market/geo-suggestion-banner.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/features/market/geo-suggestion-banner.tsx):
- Evaluates inbound proxy headers: `CF-IPCountry`, `X-Vercel-IP-Country`, `CloudFront-Viewer-Country`.
- When an Indian visitor lands on `/` or `/bd`, a refined soft banner suggests exploring the India Atelier (`/in`).
- Respects user preference and session dismissal via `sessionStorage`.
- No disruptive hard redirects, ensuring optimal SEO indexing and visitor autonomy.

---

## 7. Edge Caching & Asset Delivery

### 7.1 Cache Invalidation Webhook
The storefront exposes an on-demand revalidation endpoint at [`apps/storefront/src/routes/api/revalidate.ts`](file:///c:/laragon/www/vendure/apps/storefront/src/routes/api/revalidate.ts):
```bash
POST /api/revalidate
Content-Type: application/json
x-revalidate-secret: <SECRET>

{
  "tags": ["campaigns", "market-bd", "market-in"]
}
```
- Revalidation tags matching `/^campaigns?(-.+)?$/` flush internal Nitro SSR caches and edge layers immediately.

### 7.2 Image Optimization
Visual assets leverage [`getOptimizedAssetUrl`](file:///c:/laragon/www/vendure/apps/storefront/src/platform/vendure/asset.ts):
- Automatic WebP conversion: `?format=webp`
- Dynamic dimension constraints: `?w=1920&q=85` for desktop hero banners, `?w=800` for mobile cards.

---

## 8. Merchandiser SOP: Launching a Campaign

To configure a new campaign drop (e.g., festive season or capsule collection):

1. **Update Market Configuration**:
   Open the target market folder in [`apps/storefront/src/markets/`](file:///c:/laragon/www/vendure/apps/storefront/src/markets/):
   - Bangladesh: `bd/bd-experience.ts`
   - India: `in/in-experience.ts`
   - Global: `global/global-experience.ts`
2. **Update Visuals & Copy**:
   - Set `heroHeadline`, `heroSubHeadline`, and `heroTag`.
   - Update `heroImageUrl` with the new campaign asset.
   - Adjust `navigation.marqueeAnnouncements` with promotional codes and courier privileges.
3. **Verify Experience**:
   ```bash
   pnpm --filter storefront check-types
   pnpm --filter storefront build
   ```
4. **Deploy**:
   Push to repository. Edge builds deploy immediately without requiring database migrations.
