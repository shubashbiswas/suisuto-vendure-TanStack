import type { ComponentType } from "react";
import type { MarketRegion, RegionConfig } from "@/platform/region/region.types";
import type { getPersonalizedShellData } from "@/site/shell.functions";

export interface MarketHeaderProps {
	collections: Array<{ id: string; name: string; slug: string }>;
	availableCurrencyCodes: string[];
	activeCurrencyCode: string;
	activeRegion?: MarketRegion;
	availableRegions?: RegionConfig[];
	personalized: Promise<Awaited<ReturnType<typeof getPersonalizedShellData>>>;
	campaignAnnouncement?: string;
}

export interface MarketFooterProps {
	collections: Array<{ id: string; name: string; slug: string }>;
	activeRegion?: MarketRegion;
	activeCurrencyCode?: string;
	availableRegions?: RegionConfig[];
}

export interface MarketConfig {
	code: string;
	name: string;
	supportPhone?: string;
	supportEmail?: string;
	supportHours?: string;
	address?: string;
	trustBadges?: Array<{ title: string; subtitle: string }>;
}

export interface MarketExperienceModule {
	Header: ComponentType<MarketHeaderProps>;
	Footer: ComponentType<MarketFooterProps>;
	config: MarketConfig;
}

export type HomepageSectionType =
	| "hero"
	| "campaign-banner"
	| "featured-collection"
	| "product-carousel"
	| "editorial"
	| "artisan-story"
	| "newsletter"
	| "countdown"
	| "video-banner"
	| "full-width-slides"
	| "seasonal-collection"
	| "category-grid-3x3"
	| "brand-grid-3x3"
	| "bestselling-slides"
	| "now-trending"
	| "shop-the-mood"
	| "atelier-pillars";

export interface HomepageSectionConfig {
	type: HomepageSectionType;
	props?: Record<string, any>;
}

