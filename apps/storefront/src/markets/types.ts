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
