import { createServerFn } from "@tanstack/react-start";
import {
	GetCollectionProductsQuery,
	GetTopCollectionsQuery,
} from "@/features/collections/graphql";
import { getActiveCampaign, getMarketHomepageSections } from "@/features/campaigns/campaign.server";
import { fetchMarketConfig } from "@/features/market/market.server";
import type { HomepageSectionConfig } from "@/features/campaigns/campaign.types";
import { getLocale } from "@/paraglide/runtime";
import { cachedPublicData } from "@/platform/cache/public-cache";
import {
	getActiveRegionOnServer,
	getChannelTokenForRegion,
	getRegionConfig,
} from "@/platform/region/region.server";
import { queryOnServer } from "@/platform/vendure/api.server";

export const getHomeData = createServerFn({ method: "GET" })
	.validator((data?: { region?: string }) => data)
	.handler(async ({ data }) => {
		const locale = getLocale();
		const regionCode = data?.region || getActiveRegionOnServer();
		const regionConfig = getRegionConfig(regionCode);
		const channelToken = getChannelTokenForRegion(regionCode);
		const currency = regionConfig.currencyCode;

		// 1. Fetch active campaign and market configuration in parallel
		const [campaign, marketConfig] = await Promise.all([
			getActiveCampaign(regionCode),
			fetchMarketConfig(regionCode),
		]);

		// 2. Resolve market homepage sections adhering to hierarchy:
		//    Priority 1: Active campaign sections (if campaign has custom sections)
		//    Priority 2: Multi-Market plugin homepage sections configured in Vendure
		//    Priority 3: Fallback default sections
		const homepageSections: HomepageSectionConfig[] =
			campaign?.homepageSections && campaign.homepageSections.length > 0
				? campaign.homepageSections
				: marketConfig?.homepage?.sections && marketConfig.homepage.sections.length > 0
				? (marketConfig.homepage.sections as HomepageSectionConfig[])
				: getMarketHomepageSections(regionCode, campaign);

		// 3. Determine collection to showcase
		let targetCollectionSlug = "atelier";
		const featuredSection = homepageSections.find(
			(s) =>
				(s.type === "featured-collection" || s.type === "product-carousel") &&
				s.props?.collectionSlug
		);
		if (featuredSection?.props?.collectionSlug) {
			targetCollectionSlug = String(featuredSection.props.collectionSlug);
		}

		const catalogData = await cachedPublicData({
			key: `home-catalog:${regionConfig.code}:${targetCollectionSlug}:${locale}:${currency}`,
			tags: [`home-${regionConfig.code}-${locale}-${currency}`],
			ttlMs: 30_000,
			load: async () => {
				const [productsResult, collectionsResult] = await Promise.all([
					queryOnServer(
						GetCollectionProductsQuery,
						{
							slug: targetCollectionSlug,
							input: {
								collectionSlug: targetCollectionSlug,
								take: 12,
								skip: 0,
								groupByProduct: true,
							},
						},
						{ languageCode: locale, currencyCode: currency, channelToken },
					).catch(() => null),
					queryOnServer(
						GetTopCollectionsQuery,
						{},
						{ languageCode: locale, channelToken },
					).catch(() => null),
				]);

				let products = productsResult?.data?.search?.items ?? [];
				if (products.length === 0) {
					const fallback = await queryOnServer(
						GetCollectionProductsQuery,
						{
							slug: "",
							input: {
								take: 12,
								skip: 0,
								groupByProduct: true,
							},
						},
						{ languageCode: locale, currencyCode: currency, channelToken },
					).catch(() => null);
					products = fallback?.data?.search?.items ?? [];
				}

				return {
					products,
					collections: collectionsResult?.data?.collections?.items ?? [],
				};
			},
		});

		return {
			...catalogData,
			homepageSections,
			campaign,
			marketConfig,
			currencyCode: currency,
			activeRegion: regionConfig.code,
			regionConfig,
		};
	});
