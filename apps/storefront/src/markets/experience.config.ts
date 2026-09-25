import type { HomepageSectionConfig } from "./types";

export const MARKET_EXPERIENCE: Record<string, HomepageSectionConfig[]> = {
	// ==========================================
	// 🌍 GLOBAL / INTERNATIONAL STOREFRONT
	// ==========================================
	global: [
		{
			type: "hero",
			props: {
				heroHeadline: "Sovereign Sartorial Craft",
				heroSubHeadline:
					"Ancient South Asian loom archives reimagined through minimalist architectural tailoring, fluid silhouettes, and numbered artisan editions.",
				heroCtaLabel: "Discover Collection",
				heroCtaHref: "/shop",
				heroTag: "Global Atelier Edition",
			},
		},
		{
			type: "featured-collection",
			props: {
				title: "Curated Runway Archive",
				subtitle:
					"Hand-selected garments from our master weaving clusters, ready for immediate worldwide dispatch in USD ($).",
				ctaHref: "/shop",
				ctaLabel: "View All Runway Pieces",
			},
		},
		{
			type: "category-grid-3x3",
			props: {
				badge: "Haute Couture Departments",
				title: "SHOP BY ARCHITECTURAL DEPARTMENT",
				subtitle:
					"Explore fluid silks, sculptural outerwear, and artisan leather crafted for contemporary collectors.",
			},
		},
		{
			type: "bestselling-slides",
			props: {
				title: "Collector Favorites",
				subtitle: "The most coveted handloom creations acquired by international clients this season.",
			},
		},
		{
			type: "now-trending",
			props: {
				title: "Runway Direct Dispatch",
				subtitle: "In-stock atelier pieces available for immediate express transit with DHL Express.",
			},
		},
		{
			type: "atelier-pillars",
		},
		{
			type: "newsletter",
		},
	],

	// ==========================================
	// 🇮🇳 INDIA STOREFRONT
	// ==========================================
	in: [
		{
			type: "hero",
			props: {
				heroHeadline: "The Royal Loom · India Atelier Edition",
				heroSubHeadline:
					"Preserving imperial Varanasi brocades, hand-woven Chanderi tissue, and master artisan silks across India.",
				heroCtaLabel: "Explore Royal Edit",
				heroCtaHref: "/in/shop",
				heroTag: "India Atelier Edition",
			},
		},
		{
			type: "featured-collection",
			props: {
				title: "Imperial Handloom Silk Showcase",
				subtitle:
					"Hand-woven Banarasi brocades and ceremonial silks certified with authentic Silk Mark provenance.",
				ctaHref: "/in/shop",
				ctaLabel: "View All Indian Heirlooms",
			},
		},
		{
			type: "category-grid-3x3",
			props: {
				badge: "Royal Atelier Matrix",
				title: "SHOP BY INDIAN ETHNIC CATEGORY",
				subtitle:
					"Explore pure Katan silks, royal groom sherwanis, bridal lehengas, and handcrafted accessories.",
			},
		},
		{
			type: "bestselling-slides",
			props: {
				title: "Most Loved Festive Ensembles",
				subtitle: "Top-selling bridal and ceremonial masterworks trending across India this wedding season.",
			},
		},
		{
			type: "now-trending",
			props: {
				title: "Pan-India Express Dispatch",
				subtitle: "Priority 2-3 day domestic delivery via Delhivery with Cash on Delivery and instant UPI.",
			},
		},
		{
			type: "atelier-pillars",
		},
		{
			type: "newsletter",
		},
	],

	// ==========================================
	// 🇧🇩 BANGLADESH STOREFRONT
	// ==========================================
	bd: [
		{
			type: "hero",
			props: {
				heroHeadline: "The Atelier Movement · Bangladesh Edition",
				heroSubHeadline:
					"Celebrating timeless craftsmanship, sovereign handloom muslins, and master artisan silks across Bengal in BDT (৳).",
				heroCtaLabel: "Explore Collection",
				heroCtaHref: "/shop",
				heroTag: "Bengal Atelier Edition",
			},
		},
		{
			type: "featured-collection",
			props: {
				title: "Master Artisan Handloom Pieces",
				subtitle:
					"Curated festive panjabis, formal executive wear, and certified Dhakai Jamdani ready for express delivery.",
				ctaHref: "/shop",
				ctaLabel: "View All BD Collections",
			},
		},
		{
			type: "category-grid-3x3",
			props: {
				badge: "Curated Catalog Matrix",
				title: "SHOP BY CATEGORY / কালেকশন ডিপার্টমেন্ট",
				subtitle:
					"Explore distinct wardrobe departments handcrafted for contemporary Bangladeshi lifestyle and celebrations.",
			},
		},
		{
			type: "bestselling-slides",
			props: {
				title: "Best Selling Across Bangladesh",
				subtitle: "Customer favorites and master artisan creations trending nationwide.",
			},
		},
		{
			type: "now-trending",
			props: {
				title: "Fresh Off The Loom",
				subtitle: "New weekly drops ready for same-day dispatch in Dhaka and 48h express nationwide.",
			},
		},
		{
			type: "atelier-pillars",
		},
		{
			type: "newsletter",
		},
	],

	// Fallback mappings for aliases
	ae: [],
	us: [],
};

// Aliases
MARKET_EXPERIENCE.ae = MARKET_EXPERIENCE.global;
MARKET_EXPERIENCE.us = MARKET_EXPERIENCE.global;

export const DEFAULT_SECTIONS: HomepageSectionConfig[] = MARKET_EXPERIENCE.global;

export function getMarketHomepageSections(market?: string): HomepageSectionConfig[] {
	const normalizedMarket = (market || "global").toLowerCase().trim();
	return MARKET_EXPERIENCE[normalizedMarket] || DEFAULT_SECTIONS;
}
