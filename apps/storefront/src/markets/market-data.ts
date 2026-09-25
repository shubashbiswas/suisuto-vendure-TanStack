// Luxury fashion types for regional storefronts

export interface MarketCategoryItem {
	name: string;
	banglaName?: string;
	tagline: string;
	imageUrl: string;
	href: string;
	itemCount?: string;
}

export interface MarketBrandItem {
	name: string;
	tagline: string;
	desc: string;
	founded?: string;
	href: string;
	initials: string;
}

export interface MarketSlideItem {
	id: string;
	title: string;
	subtitle: string;
	tag: string;
	imageUrl: string;
	link: string;
	ctaText: string;
}

export const BD_SLIDES: MarketSlideItem[] = [];
export const BD_CATEGORIES: MarketCategoryItem[] = [];
export const BD_BRANDS: MarketBrandItem[] = [];

export const IN_SLIDES: MarketSlideItem[] = [];
export const IN_CATEGORIES: MarketCategoryItem[] = [];
export const IN_BRANDS: MarketBrandItem[] = [];

export const GLOBAL_SLIDES: MarketSlideItem[] = [];
export const GLOBAL_CATEGORIES: MarketCategoryItem[] = [];
export const GLOBAL_BRANDS: MarketBrandItem[] = [];
