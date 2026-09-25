# 06. Frontend Architecture & Storefront (TanStack Start)

## 1. System Overview & Technology Stack

The storefront in `apps/storefront` is built on modern, full-stack React using **TanStack Start with Vite and Nitro**:

* **Core Framework**: [TanStack Start](https://tanstack.com/start) (`@tanstack/react-start` v1.x) with isomorphic SSR and streaming.
* **Routing**: [TanStack Router](https://tanstack.com/router) (`@tanstack/react-router`) with type-safe file routes in `src/routes/`.
* **Bundler & Server Engine**: [Vite](https://vite.dev/) with [Nitro](https://nitro.unjs.io/) server runtime.
* **Internationalization (i18n)**: [@inlang/paraglide-js](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) for zero-runtime compiled messages and locale detection middleware.
* **GraphQL Layer**: [gql.tada](https://gql-tada.0708.me/) with strict server-side operation allowlisting (`registerShopOperations`).
* **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) with Base UI and custom accessible design primitives.

---

## 2. Multi-Channel Market Architecture

The storefront operates on a unified domain with multi-market routing and channel token resolution:

| Route / Market               | Target Channel         | Currency    | Fulfillment Hub        | Payment Gateways                    |
| :--------------------------- | :--------------------- | :---------- | :--------------------- | :---------------------------------- |
| **Global (`/` or `/global`)**| 🌍 Global Export       | **USD ($)** | Multi-Hub (BD + India) | Stripe, PayPal, Apple Pay, Google Pay |
| **Bangladesh (`/bd`)**       | 🇧🇩 Bangladesh Domestic | **BDT (৳)** | Bangladesh Hub         | SSLCOMMERZ, bKash Direct, Nagad, COD|
| **India (`/in`)**            | 🇮🇳 India Domestic      | **INR (₹)** | India Hub              | Razorpay, UPI, NetBanking, COD      |

---

## 3. Server Entry & Channel Token Resolution

In TanStack Start, the server entry point is [src/server.ts](file:///c:/laragon/www/vendure/apps/storefront/src/server.ts), evaluated inside Nitro's SSR environment.

### 3.1 Middleware Pipeline in `src/server.ts`

Incoming requests pass through Paraglide's locale middleware before invoking TanStack Start's handler:

```typescript
// apps/storefront/src/server.ts
import handler from "@tanstack/react-start/server-entry";
import { assertServerEnv } from "./platform/env.server.ts";
import "./config/shop-operations.ts";
import { paraglideMiddleware } from "./paraglide/server";

assertServerEnv();

export default {
  async fetch(request: Request): Promise<Response> {
    if (new URL(request.url).pathname.startsWith("/api/")) {
      return handler.fetch(request);
    }
    return paraglideMiddleware(request, () => handler.fetch(request));
  },
};
```

### 3.2 Dynamic Channel Token Resolution in `api.server.ts`

All communication with the Vendure backend passes through [src/platform/vendure/api.server.ts](file:///c:/laragon/www/vendure/apps/storefront/src/platform/vendure/api.server.ts). The active channel token is resolved dynamically:

```typescript
// apps/storefront/src/platform/vendure/api.server.ts
export function resolveChannelToken(market?: string): string {
  switch (market?.toLowerCase()) {
    case 'bd':
    case 'bangladesh':
      return process.env.VENDURE_CHANNEL_TOKEN_BD || 'bangladesh';
    case 'in':
    case 'india':
      return process.env.VENDURE_CHANNEL_TOKEN_IN || 'india';
    case 'global':
    default:
      return process.env.VENDURE_CHANNEL_TOKEN_GLOBAL || 'global';
  }
}
```

When the `vendure-token` header is forwarded with the request:
1. Vendure isolates catalog queries to products assigned to that channel.
2. Products excluded from the channel automatically return `null` or 404.
3. Currency amounts and prices reflect the channel's base currency (`BDT`, `INR`, or `USD`).

---

## 4. GeoIP Detection & Region Persistence

1. **Edge Country Header Detection**:
   * Reads incoming reverse proxy headers (`x-ip-country`, `cf-ipcountry`, or `x-vercel-ip-country`).
   * `BD` $\to$ default to Bangladesh Channel (`BDT ৳`).
   * `IN` $\to$ default to India Channel (`INR ₹`).
   * All others $\to$ default to Global Channel (`USD $`).
2. **Persistent Cookie Override**:
   * User selection in the navbar region picker is saved to `vendure-region` cookie.
   * Subsequent SSR and client requests use the cookie value to maintain user preference across sessions.

---

## 5. Fashion UX & Multi-Hub Components

### 5.1 Product Origin Badges

Products include `customFields.originHub` from the Vendure schema (`BD_HUB`, `IN_HUB`, `DUAL_HUB`). Components in `src/components/` and `src/features/products/` render context-aware dispatch badges:

```tsx
// Example badge rendering logic
export function OriginBadge({ originHub, currentMarket }: { originHub: string; currentMarket: string }) {
  const isDomestic = 
    (currentMarket === 'bd' && originHub === 'BD_HUB') ||
    (currentMarket === 'in' && originHub === 'IN_HUB');

  if (isDomestic) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
        <span>⚡</span> Domestic Express (2–3 Days)
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
      <span>✈️</span> International Atelier Import (5–8 Days)
    </span>
  );
}
```

### 5.2 Mixed-Cart Split Fulfillment Drawer

When a customer's cart contains items originating from multiple hubs:
* Items are grouped in the cart drawer by physical studio:
  * **India Studio Parcel** (Dispatched from New Delhi / Mumbai)
  * **Dhaka Studio Parcel** (Dispatched from Dhaka)
* Each parcel displays its shipping rate and estimated transit time independently.
* Total shipping fee transparently aggregates both parcels.

### 5.3 Conditional Indian Customs KYC at Checkout

In [src/routes/checkout.tsx](file:///c:/laragon/www/vendure/apps/storefront/src/routes/checkout.tsx):
* If `shippingAddress.countryCode === 'IN'` **AND** any line item has `originHub === 'BD_HUB'`:
* The checkout form conditionally requires Indian Customs identification:
  * Document Type: `Aadhaar` | `PAN` | `Passport`
  * Document Identification Number
* The value is saved to `Order.customFields.recipientKycId` via GraphQL mutation for automated courier commercial invoice generation.

---

## 6. Modular Market Feature Modules (`src/markets/`)

To support distinct cultural, aesthetic, and merchandising requirements across Bangladesh (`/bd`), India (`/in`), and Global Export (`/` or `/global`), the storefront uses **Strategy 1: Modular Market Feature Folders**:

* **Market Modules (`src/markets/`)**:
  * `bd/`: Bangladesh handloom heritage (Jamdani, Panjabi, Narayanganj hub, BDT ৳).
  * `in/`: Indian royal couture & wedding bridal (Banarasi, Chanderi, Varanasi hub, INR ₹).
  * `global/`: International runway ateliers (Haute Couture, dual-origin linen, USD $).
* **Registry & Interface Contract**:
  * `src/markets/types.ts`: `MarketExperience` TypeScript interface defining navigation, hero typography, editorial storytelling, and boutique footer configurations.
  * `src/markets/registry.ts`: `getMarketExperience(regionCode)` with safe resolution and fallback to Global.
* **Zero Hardcoded Branching**:
  * Header navigation ([`navbar.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/navigation/navbar.tsx)) and footer ([`footer.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/footer.tsx)) dynamically render the active market's navigation trees and contact concierges without nested `if/else` checks.

For deep architectural patterns and adding new country markets, see **[10. Modular Multi-Market & Animation Architecture](./10_MODULAR_MARKET_AND_ANIMATION_ARCHITECTURE.md)**.

---

## 7. Dynamic Section Engine & Luxury Animations

* **Dynamic Section Dispatcher**:
  * [`HomepageSectionRenderer`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/homepage-section-renderer.tsx) supports 8 modular sections (`hero`, `video-banner`, `shop-by-category`, `seasonal-collection`, `now-trending`, `shop-by-brand`, `bestselling-slides`, `full-width-slide`).
* **High-Fashion Animation Suite**:
  * **Composited Performance (CLS = 0)**: Transforms, opacities, and filters only.
  * **CSS Scroll-Driven Parallax**: Native `@supports ((animation-timeline: view()) and (animation-range: entry))` for 120 FPS banner parallax without runtime JS overhead.
  * **Dual-Shot Hover**: Instant crossfade from studio mannequin shot to secondary drape/editorial look on product cards.
  * **Masked Headline Reveals**: Grand serif headlines slide upward from overflow masks on load.
  * **Physical Spring Cart Drawer**: `cubic-bezier(0.16, 1, 0.3, 1)` easing with deep frosted glass backdrop blur.
  * **Accessibility**: Automatic fallback and reduction via `@media (prefers-reduced-motion: reduce)`.

