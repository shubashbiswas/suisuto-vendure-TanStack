# 10. Modular Multi-Market & Luxury Animation Architecture

## 1. Executive Summary & Core Motivation

The **Suisuto** platform serves three distinct cultural, consumer, and logistical ecosystems:
1. **Bangladesh (`/bd`)**: Bengali artisanal heritage, high-density festive calendars (Eid, Pohela Boishakh, Durga Puja), handloom Dhakai Jamdani and Khadi Panjabi sets, domestic Pathao dispatch from Narayanganj/Dhaka, local bKash/Nagad and SSLCOMMERZ checkout in BDT (`৳`).
2. **India (`/in`)**: Pan-Indian regal couture, bridal wedding trousseaus, Varanasi Katan Silk, Chanderi gold tissue zari, Delhivery fulfillment from Varanasi/Delhi, local Razorpay UPI/NetBanking in INR (`₹`).
3. **Global (`/` or `/global`)**: International haute couture, runway ateliers, quiet luxury, dual-origin linen overcoats, cross-border DHL Express air freight, and Stripe payments in USD (`$`).

### The Anti-Pattern: Monolithic Regional Hardcoding
Previously, regional variations in many e-commerce architectures devolved into sprawling nested ternaries and conditional checks:
```tsx
// ❌ ANTI-PATTERN: Brittle, unmaintainable, violates open-closed principle
{region === 'in' ? <IndianBridalBanner /> : region === 'bd' ? <EidJamdaniBanner /> : <GlobalAtelierHero />}
```
This approach cluttered presentation components with market-specific business rules, caused bundle bloat across all locales, and created severe cognitive overhead whenever a new market was introduced.

### The Solution: Strategy 1 (Modular Market Feature Folders)
Under **Strategy 1**, every market operates as a self-contained feature module governed by a strict TypeScript interface contract (`MarketExperience`). Regional navigation trees, category megamenus, editorial highlights, concierge details, and footer configurations live exclusively inside their respective market folder. The global storefront shell simply asks the **Market Experience Registry** for the active configuration and renders polymorphically.

---

## 2. Directory Layout & Module Boundaries

The modular market architecture resides under [`apps/storefront/src/markets/`](file:///c:/laragon/www/vendure/apps/storefront/src/markets/):

```
apps/storefront/src/markets/
├── types.ts                      # Strict interface contract (MarketExperience)
├── registry.ts                   # Central resolver & cached dispatcher
├── bd/                           # Bangladesh Market Module
│   ├── bd-experience.ts          # Concrete configuration (BDT, Narayanganj hub, etc.)
│   └── navigation/
│       └── bd-category-nav.tsx   # Custom Jamdani & Panjabi megamenu
├── in/                           # India Market Module
│   ├── in-experience.ts          # Concrete configuration (INR, Varanasi hub, etc.)
│   └── navigation/
│       └── in-category-nav.tsx   # Custom Banarasi & Bridal megamenu
└── global/                       # Global Export Market Module
    ├── global-experience.ts      # Concrete configuration (USD, Runway Atelier, etc.)
    └── navigation/
        └── global-category-nav.tsx # Haute Couture & Tailoring megamenu
```

---

## 3. The `MarketExperience` Interface Contract

Defined in [`apps/storefront/src/markets/types.ts`](file:///c:/laragon/www/vendure/apps/storefront/src/markets/types.ts), every market module implements this unified contract:

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

### The Registry Resolver (`registry.ts`)
The registry provides safe resolution with automatic fallback to the Global market:
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

## 4. Route Resolution Precedence in the Storefront

The storefront uses TanStack Router file-based routing. To guarantee that regional URLs (`/in`, `/bd`, `/in/products/...`, `/bd/campaign/...`) render their distinct cultural identities, route precedence is strictly enforced:

```typescript
// Resolution priority pattern in layouts and navigation:
const resolvedRegion = routeRegion || activeRegion || "global";
const market = getMarketExperience(resolvedRegion);
```

### Architectural Benefits:
1. **Zero Hardcoded Branching**: Components like [`navbar.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/navigation/navbar.tsx) and [`footer.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/footer.tsx) contain zero `if (region === 'in')` statements. They dynamically consume `market.navigation` and `market.footer`.
2. **Channel Isolation Maintained**: Vendure GraphQL queries automatically send `vendure-token: bangladesh`, `vendure-token: india`, or `vendure-token: global`, preserving currency and cart separation.
3. **Cart Retention Integrity**: Active orders in INR do not bleed into BDT sessions. Switching markets preserves items safely in their respective market channels.

---

## 5. Dynamic Section Composition & Editorial Commerce

The Suisuto homepage avoids rigid static layouts. It employs a dynamic section engine via [`HomepageSectionRenderer`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/homepage-section-renderer.tsx) supporting 8 high-fashion visual modules:

| Section Type | Component | Visual Purpose & Merchandising Focus |
|---|---|---|
| `hero` | [`HeroSection`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/hero-section.tsx) | Full-bleed editorial hero with responsive WebP picture element and high-fashion serif typography. |
| `video-banner` | [`VideoBannerSection`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/video-banner-section.tsx) | Autoplay looping artisan loom and runway video backdrop with ambient mute/unmute control. |
| `shop-by-category` | [`ShopByCategoryGrid`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/shop-by-category-grid.tsx) | 3x3 high-density visual category grid with hover zoom and quick count pills. |
| `seasonal-collection` | [`SeasonalCollectionSection`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/seasonal-collection-section.tsx) | Asymmetric editorial split banner highlighting capsule drops (e.g. Garad Silk, Raw Mulberry). |
| `now-trending` | [`NowTrendingSection`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/now-trending-section.tsx) | Curation grid with countdown urgency and live inventory badges. |
| `shop-by-brand` | [`ShopByBrandGrid`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/shop-by-brand-grid.tsx) | Artisan guild and heritage atelier directory (Tangail Weavers Guild, Varanasi Silk Guild). |
| `bestselling-slides` | [`BestsellingSlidesSection`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/bestselling-slides-section.tsx) | Horizontal product slider with single-variant instant Add-to-Bag and wishlist toggles. |
| `full-width-slide` | [`FullWidthSlideSection`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/full-width-slide.tsx) | Editorial mood lookbook with narrative text overlay and shop-the-look link. |

---

## 6. Luxury E-Commerce Animation & Micro-Interaction Engine

The animation engine is engineered according to the following performance and aesthetic specifications:

### 6.1 Compositor-Only Performance Rules
To prevent layout recalculation and frame drops:
- **No Layout Shifts (CLS = 0)**: Only animate `transform`, `opacity`, and `filter`.
- **Off-Main-Thread Execution**: Utilize GPU composited layers (`will-change: transform`).
- **No Heavy Runtimes**: Zero reliance on 80KB+ external animation libraries for basic scroll reveals.

### 6.2 CSS Scroll-Driven Animations (`animation-timeline: view()`)
For parallax campaign banners and video headers, modern native CSS scroll timelines provide 120 FPS performance:
```css
@supports ((animation-timeline: view()) and (animation-range: entry)) {
  .parallax-banner {
    animation: banner-parallax linear both;
    animation-timeline: view();
    animation-range: entry 0% exit 100%;
  }
}

@keyframes banner-parallax {
  from {
    transform: translateY(-6%) scale(1.06);
  }
  to {
    transform: translateY(6%) scale(1.00);
  }
}
```

### 6.3 The Editorial Hero Reveal Sequence
On page load, the hero section executes an orchestrated 4-stage entrance sequence:
1. **Background Unmasking (0.0s – 1.4s)**: Hero image zooms subtly from `scale(1.08)` to `scale(1.00)` with `opacity: 0` to `1` using `cubic-bezier(0.2, 0.8, 0.2, 1)`.
2. **Capsule Tag Slide (0.2s – 0.6s)**: Category badge slides down smoothly (`translateY(-10px) -> 0`).
3. **Headline Mask Reveal (0.3s – 0.8s)**: Grand serif headline lines slide upward through an `overflow: hidden` bounding box (`translateY(100%) -> 0`).
4. **Action Cluster Float (0.5s – 1.0s)**: Sub-headline and action buttons float into position with soft opacity fade.

### 6.4 Dual-Shot Product Card Hover ("Reveal Second Shot")
When browsing product catalogs or category grids, hovering over any card triggers an instant high-fashion transformation:
- Primary studio shot crossfades to secondary editorial / drape angle (`opacity: 1 -> 0` and `0 -> 1`).
- Image scales smoothly by `1.04x` over `700ms` with `cubic-bezier(0.25, 1, 0.5, 1)`.
- Floating quick-action pill ("Quick Add" / "View Atelier Look") glides upward from bottom edge (`translateY(8px) -> 0` + `opacity: 0 -> 1`).

### 6.5 Apple-Style Spring Cart Drawer & Frosted Backdrop
The cart drawer incorporates modern physical spring curves:
- **Slide Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` with 350ms duration for effortless momentum.
- **Cinematic Frosted Backdrop**: `backdrop-filter: blur(12px)` with `rgba(0, 0, 0, 0.6)` ambient dimming.
- **Staggered Line Items**: Items inside the bag glide into view sequentially on drawer open.

### 6.6 Accessibility & Motion Preference Compliance
Every animation rule respects user OS accessibility settings:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 7. Standard Operating Procedure: Adding a New Market (e.g. UK / EU)

To expand Suisuto into a new geographic market (e.g. United Kingdom `/uk` with GBP `£` and London fulfillment):

1. **Create the Market Folder**:
   ```bash
   mkdir -p apps/storefront/src/markets/uk/navigation
   ```
2. **Create Concrete Market Experience**:
   Implement `uk-experience.ts` adhering to `MarketExperience` with GBP currency, London flagship address, and localized editorial collections.
3. **Create Regional Megamenu**:
   Create `navigation/uk-category-nav.tsx` tailored to British tailoring, trench coats, and wool-silk blends.
4. **Register in Registry**:
   Import `ukMarketExperience` in [`src/markets/registry.ts`](file:///c:/laragon/www/vendure/apps/storefront/src/markets/registry.ts) and add `'uk'` to `MARKET_EXPERIENCES`.
5. **Configure Vendure Channel**:
   Add `VENDURE_CHANNEL_TOKEN_UK=uk-channel` to environment variables and verify channel token resolution in `api.server.ts`.
6. **Verify Build**:
   ```bash
   pnpm --filter storefront check-types
   pnpm --filter storefront build
   ```
