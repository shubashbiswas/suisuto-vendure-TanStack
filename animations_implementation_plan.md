# Implementation Plan: Luxury E-Commerce Animations & Micro-Interactions

This plan outlines the architecture and execution strategy for introducing high-fashion, editorial-grade animations and micro-interactions across the **Suisuto Storefront** across all three regional markets (`/`, `/in`, `/bd`).

---

## 1. Architectural Philosophy & Performance Constraints

In line with our high-end aesthetic and modern web guidance standards:
- **Zero Layout Shifts (CLS = 0)**: All animations must operate exclusively on compositor-friendly CSS properties: `transform`, `opacity`, and `filter`. No animating `width`, `height`, `margin`, or `top/left`.
- **CSS Scroll-Driven Animations First**: Utilize native `@supports ((animation-timeline: view()) and (animation-range: entry))` for scroll parallax and entrance effects. This provides 120 FPS buttery-smooth performance off the main thread with zero JavaScript CPU overhead.
- **Progressive Enhancement**: Browsers without CSS Scroll-Driven Animation support smoothly fall back to standard transitions or lightweight `IntersectionObserver` triggers.
- **Accessibility & Motion Preference**: Strict adherence to `@media (prefers-reduced-motion: reduce)` across all keyframes and utility classes to ensure accessibility compliance.
- **Modular Integration**: Enhancements integrate cleanly with our newly structured `src/markets/` architecture (`bd`, `in`, `global`) and shared section renderers.

---

## 2. Animation Catalog & Component Mapping

| # | Animation Feature | Target Components | Technical Approach |
|---|---|---|---|
| **1** | **Editorial Hero Reveal (On Load)** | [`hero-section.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/hero-section.tsx) | Staggered CSS keyframes: slow cinematic image unmask (scale 1.08 -> 1.00), tag slide-down, clip-path masked headline reveal, and button float-up. |
| **2** | **Parallax Scroll on Campaign Banners** | [`video-banner-section.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/video-banner-section.tsx), [`seasonal-collection-section.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/seasonal-collection-section.tsx), [`full-width-slide.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/full-width-slide.tsx) | CSS `animation-timeline: view()` parallax displacement (`translateY(-6%)` to `translateY(6%)`) relative to the viewport. |
| **3** | **"Reveal Second Shot" Grid Hover** | [`product-card.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/features/products/components/product-card.tsx) | Dual-image layering: Primary studio photo crossfades to secondary editorial / back angle with smooth 1.05x scale and quick-action slide-up. |
| **4** | **Text Reveal & Masking for Titles** | [`shop-by-category-grid.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/shop-by-category-grid.tsx), [`now-trending-section.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/now-trending-section.tsx), section headers | Overflow-hidden wrapper with sliding text lines (`translateY(100%)` -> `0`) and expanding gold/monochrome accent rules (`scale-x-0` -> `scale-x-100`). |
| **5** | **Product Grid Crossfade & Stagger** | [`bestselling-slides-section.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/bestselling-slides-section.tsx), [`product-grid.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/features/products/product-grid.tsx) | Staggered child item entrance with index-based transition delays (`animation-delay: calc(var(--index) * 60ms)`). |
| **6** | **Product Image Zoom on Hover** | [`product-card.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/features/products/components/product-card.tsx), Lookbook cards | Fine-tuned cubic easing `cubic-bezier(0.25, 1, 0.5, 1)` with subtle high-fashion contrast enhancement (`brightness-105`). |
| **7** | **Smooth Drawer Cart Slide-In** | [`cart-drawer.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/features/cart/components/cart-drawer.tsx), [`sheet.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/components/ui/sheet.tsx) | Apple-style spring slide curve (`cubic-bezier(0.16, 1, 0.3, 1)`), rich `backdrop-blur-md bg-black/60` overlay, and staggered item cascade. |
| **8** | **Fade-In Image Crossfade** | [`storefront-image.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/components/storefront-image.tsx) | Smooth opacity crossfade on `onLoad` from placeholder shimmer to fully rendered WebP asset without content jumping. |
| **9** | **Bonus: Magnetic Luxury Buttons & Underlines** | Navigation links, CTAs, Marquee ticker | Expanding border lines from center/left (`transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)`), hover lift on pill buttons. |

---

## 3. Step-by-Step Implementation Roadmap

### Phase 1: CSS Animation Design System & Tokens
- **Target File**: [`apps/storefront/src/storefront.css`](file:///c:/laragon/www/vendure/apps/storefront/src/storefront.css)
- **Actions**:
  1. Define keyframes and utility classes:
     - `@keyframes hero-zoom-reveal` (scale 1.08 -> 1.00 + opacity 0 -> 1)
     - `@keyframes mask-slide-up` (clip/translate reveal for luxury typography)
     - `@keyframes banner-parallax` (scroll-driven translateY range)
     - `@keyframes drawer-slide-spring` & `@keyframes backdrop-fade`
     - `@keyframes shimmer-pulse` for skeleton loaders
  2. Implement CSS Scroll-Driven Animation utilities using `@supports (animation-timeline: view())`.
  3. Enforce `@media (prefers-reduced-motion: reduce)` overrides to zero out transforms and infinite loops.

### Phase 2: Editorial Hero Reveal (On Load)
- **Target File**: [`apps/storefront/src/site/home/hero-section.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/hero-section.tsx)
- **Actions**:
  1. Wrap the hero backdrop image in an unmask container with 1.4s luxury cubic easing.
  2. Structure the headline with an `overflow-hidden` clipping mask so the serif lines slide into view.
  3. Stagger the capsule badge (`delay-100`), headline (`delay-300`), narrative (`delay-500`), and CTA action cluster (`delay-700`).

### Phase 3: The "Reveal Second Shot" Grid Hover & Image Zoom
- **Target Files**:
  - [`apps/storefront/src/features/products/components/product-card.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/features/products/components/product-card.tsx)
  - [`apps/storefront/src/features/products/product-fallback.ts`](file:///c:/laragon/www/vendure/apps/storefront/src/features/products/product-fallback.ts)
- **Actions**:
  1. Extend `product-fallback.ts` to provide a secondary look / editorial angle mapping for products (e.g. front look vs. drape detail / back shot).
  2. Update `ProductCard` to render both primary and secondary images:
     - Primary image fades smoothly to `opacity-0` while secondary image transitions to `opacity-100` and scales up gently (`scale-105`).
  3. Add a floating quick-action pill ("Quick Add" / variant preview) that glides up from the bottom on hover (`translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300`).

### Phase 4: Scroll Parallax on Video & Campaign Banners
- **Target Files**:
  - [`apps/storefront/src/site/home/video-banner-section.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/video-banner-section.tsx)
  - [`apps/storefront/src/site/home/seasonal-collection-section.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/seasonal-collection-section.tsx)
  - [`apps/storefront/src/site/home/full-width-slide.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/full-width-slide.tsx)
- **Actions**:
  1. Add `.parallax-scroll-container` and `.parallax-media` classes with CSS `view()` animation timeline.
  2. Set media dimensions to `115%` height with `-7.5%` top offset so the parallax movement is cleanly clipped within the container without white gaps.
  3. Overlay dynamic gradient highlights that subtly shift with scroll angle.

### Phase 5: Text Reveal, Masking & Staggered Category Grids
- **Target Files**:
  - [`apps/storefront/src/site/home/shop-by-category-grid.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/shop-by-category-grid.tsx)
  - [`apps/storefront/src/site/home/shop-by-brand-grid.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/site/home/shop-by-brand-grid.tsx)
- **Actions**:
  1. Add title entrance reveal: An animated serif header with a reveal mask and an accent line that unrolls horizontally.
  2. Implement staggered card entrance animation for the 3x3 category grid cards using CSS custom property `--item-index`.

### Phase 6: Luxury Cart Drawer & Backdrop Slide-In
- **Target Files**:
  - [`apps/storefront/src/components/ui/sheet.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/components/ui/sheet.tsx)
  - [`apps/storefront/src/features/cart/components/cart-drawer.tsx`](file:///c:/laragon/www/vendure/apps/storefront/src/features/cart/components/cart-drawer.tsx)
- **Actions**:
  1. Refine `sheet.tsx` backdrop blur to `backdrop-blur-md bg-black/60` with smooth fade.
  2. Upgrade slide-in curve to `cubic-bezier(0.16, 1, 0.3, 1)` (350ms duration) for that quintessential luxury drawer feel.
  3. Add staggered entrance for cart line items when the drawer mounts.

---

## 4. Verification & Testing Strategy

1. **Static Analysis & Type Integrity**:
   - Run `pnpm --filter storefront check-types`
   - Run `pnpm --filter storefront build`
2. **Visual & Interaction Verification**:
   - Inspect `http://localhost:3001/` (Global Storefront)
   - Inspect `http://localhost:3001/in` (India Storefront)
   - Inspect `http://localhost:3001/bd` (Bangladesh Storefront)
   - Test mouse hover transitions on product cards (first-to-second shot crossfade).
   - Test scroll behavior on banners (parallax depth).
   - Test cart drawer trigger (smooth slide-in and backdrop blur).
3. **Motion Accessibility Check**:
   - Verify that enabling `prefers-reduced-motion` suppresses dramatic parallax and translates into graceful static presentation.
