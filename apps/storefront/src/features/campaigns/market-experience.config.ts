import type { HomepageSectionConfig } from "./campaign.types";
import {
	BD_SLIDES,
	BD_CATEGORIES,
	BD_BRANDS,
	IN_SLIDES,
	IN_CATEGORIES,
	IN_BRANDS,
	GLOBAL_SLIDES,
	GLOBAL_CATEGORIES,
	GLOBAL_BRANDS,
} from "./market-data";

export const MARKET_EXPERIENCE: Record<string, HomepageSectionConfig[]> = {
	// ==========================================
	// 🌍 GLOBAL / INTERNATIONAL STOREFRONT
	// ==========================================
	global: [
		{
			type: "video-banner",
			props: {
				videoUrl:
					"https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/ial51gLkY5fNrB0YWt2Jls4l6hcaKKeQr5109ocJ.mp4",
				title: "Sovereign Sartorial Craft · Global Collection",
				subtitle:
					"Ancient South Asian loom archives reimagined through minimalist architectural tailoring, fluid silhouettes, and numbered artisan editions.",
				ctaHref: "/shop",
				ctaText: "Discover Runway 2026",
			},
		},
		{
			type: "full-width-slides",
			props: {
				slides: GLOBAL_SLIDES,
			},
		},
		{
			type: "seasonal-collection",
			props: {
				title: "The Monolith Capsule 2026",
				subtitle:
					"Limited edition numbered garments created in single-artisan atelier runs. Accompanied by lifetime provenance deeds and worldwide priority courier.",
				bannerUrl:
					"https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=85",
				ctaHref: "/shop?category=capsule",
				ctaText: "Acquire Capsule Piece",
			},
		},
		{
			type: "featured-collection",
			props: {
				collectionSlug: "atelier",
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
				categories: GLOBAL_CATEGORIES,
				badge: "Haute Couture Departments",
				title: "SHOP BY ARCHITECTURAL DEPARTMENT",
				subtitle:
					"Explore fluid silks, sculptural outerwear, and artisan leather crafted for contemporary collectors.",
			},
		},
		{
			type: "brand-grid-3x3",
			props: {
				brands: GLOBAL_BRANDS,
				badge: "The Global Maison Portfolio",
				title: "CURATED ARTISAN HOUSES",
				subtitle:
					"Distinctive heritage guilds and architectural studios dedicated to uncompromising textile provenance.",
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
			type: "shop-the-mood",
			props: {
				moodTitle: "MONOCHROME ATELIER · ARCHITECTURAL SLOW FASHION",
				moodSubtitle:
					"Matte slate tones, unbleached hand-spun organic cotton, and sculptural minimalist drape.",
				moodCategory: "Architectural Capsule Collection",
				moodImageUrl:
					"https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=85",
				ctaHref: "/shop?category=capsule",
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
			type: "video-banner",
			props: {
				videoUrl:
					"https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/ial51gLkY5fNrB0YWt2Jls4l6hcaKKeQr5109ocJ.mp4",
				title: "The Royal Loom · India Atelier Edition",
				subtitle:
					"Preserving imperial Varanasi brocades, hand-woven Chanderi tissue, and master artisan silks across India.",
				ctaHref: "/in/shop",
				ctaText: "Explore Royal Edit",
			},
		},
		{
			type: "full-width-slides",
			props: {
				slides: IN_SLIDES,
			},
		},
		{
			type: "seasonal-collection",
			props: {
				title: "Grand Festive & Wedding Edit 2026",
				subtitle:
					"Curated heirloom ensembles, pure Mulberry silks, and ceremonial couture dispatched directly from our New Delhi and Varanasi studios in INR (₹).",
				bannerUrl:
					"https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
				ctaHref: "/in/shop?category=festive",
				ctaText: "Explore Festive Collection",
			},
		},
		{
			type: "featured-collection",
			props: {
				collectionSlug: "atelier",
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
				categories: IN_CATEGORIES,
				badge: "Royal Atelier Matrix",
				title: "SHOP BY INDIAN ETHNIC CATEGORY",
				subtitle:
					"Explore pure Katan silks, royal groom sherwanis, bridal lehengas, and handcrafted accessories.",
			},
		},
		{
			type: "brand-grid-3x3",
			props: {
				brands: IN_BRANDS,
				badge: "Heritage Weaver Guilds of India",
				title: "LEGENDARY TEXTILE HOUSES",
				subtitle:
					"Generational weaver clusters from Varanasi, Chanderi, Lucknow, and Kashmir certified for pure craftsmanship.",
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
			type: "shop-the-mood",
			props: {
				moodTitle: "THE IMPERIAL SULTANATE · NOCTURNE GOLD",
				moodSubtitle:
					"Deep crimson katan silks, hand-beaten electroplated gold zari, and royal court silhouettes.",
				moodCategory: "Imperial Bridal & Royal Court Ensembles",
				moodImageUrl:
					"https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85",
				ctaHref: "/in/shop?category=festive",
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
			type: "video-banner",
			props: {
				videoUrl:
					"https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/ial51gLkY5fNrB0YWt2Jls4l6hcaKKeQr5109ocJ.mp4",
				title: "The Atelier Movement · Bangladesh Edition",
				subtitle:
					"Celebrating timeless craftsmanship, sovereign handloom muslins, and master artisan silks across Bengal in BDT (৳).",
				ctaHref: "/shop",
				ctaText: "Explore Collection",
			},
		},
		{
			type: "full-width-slides",
			props: {
				slides: BD_SLIDES,
			},
		},
		{
			type: "seasonal-collection",
			props: {
				title: "Festive Seasonal Collection 2026",
				subtitle:
					"A royal celebration of ancestral Bengali looms, Dhakai Jamdani supplementary wefts, and bespoke festive panjabis.",
				bannerUrl:
					"https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/R4KUiGCjERrYo2b0TZaclu4BMxqqAEBr6rh0H99V.png",
				ctaHref: "/shop?category=seasonal",
				ctaText: "Shop Seasonal Collection",
			},
		},
		{
			type: "featured-collection",
			props: {
				collectionSlug: "atelier",
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
				categories: BD_CATEGORIES,
				badge: "Curated Catalog Matrix",
				title: "SHOP BY CATEGORY / কালেকশন ডিপার্টমেন্ট",
				subtitle:
					"Explore distinct wardrobe departments handcrafted for contemporary Bangladeshi lifestyle and celebrations.",
			},
		},
		{
			type: "brand-grid-3x3",
			props: {
				brands: BD_BRANDS,
				badge: "The Fashion House Portfolio",
				title: "SHOP BY BRAND / স্বনামধন্য ব্র্যান্ড",
				subtitle:
					"Distinctive heritage and contemporary labels curated for quality, pedigree, and longevity.",
			},
		},
		{
			type: "bestselling-slides",
			props: {
				title: "Best Selling Across Bangladesh",
				subtitle: "Customer favorites from Richman, Lubnan, and Suisuto Atelier trending nationwide.",
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
			type: "shop-the-mood",
			props: {
				moodTitle: "ROYAL FESTIVE MIDNIGHT",
				moodSubtitle:
					"An ode to dusk ceremonies, opulent midnight indigos, and hand-loomed gold zari.",
				moodCategory: "Festive Panjabi & Jamdani",
				moodImageUrl:
					"https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/Zz8bqMREyksoM6KdKTJuBF76AHrKEan329vW8gAr.jpg",
				ctaHref: "/shop?category=festive-mood",
			},
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
