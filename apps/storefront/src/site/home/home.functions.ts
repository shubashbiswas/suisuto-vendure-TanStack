import { createServerFn } from "@tanstack/react-start";
import {
	GetCollectionProductsQuery,
	GetTopCollectionsQuery,
} from "@/features/collections/graphql";
import { SearchProductsQuery } from "@/features/search/graphql";
import { fetchMarketConfig } from "@/features/market/market.server";
import { getMarketHomepageSections, type HomepageSectionConfig } from "@/markets";
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
		const regionCode = data?.region || getActiveRegionOnServer();
		const regionConfig = getRegionConfig(regionCode);
		const currency = regionConfig.currencyCode;

		try {
			const locale = getLocale();
			const channelToken = getChannelTokenForRegion(regionCode);

			// 1. Fetch market configuration from Multi-Market plugin
			const marketConfig = await fetchMarketConfig(regionCode).catch(() => null);

			// 2. Resolve market homepage sections adhering to hierarchy:
			//    Priority 1: Multi-Market plugin homepage sections configured in Vendure
			//    Priority 2: Market experience layout defined for this market
			const configuredSections = marketConfig?.homepage?.sections as HomepageSectionConfig[] | undefined;
			const marketSections = getMarketHomepageSections(regionCode);
			const homepageSections: HomepageSectionConfig[] =
				configuredSections && configuredSections.length > 0
					? configuredSections
					: marketSections && marketSections.length > 0
					? marketSections
					: [];

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
							SearchProductsQuery,
							{
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
			}).catch(() => ({ products: [], collections: [] }));

			return {
				products: catalogData?.products ?? [],
				collections: catalogData?.collections ?? [],
				homepageSections,
				marketConfig,
				currencyCode: currency,
				activeRegion: regionConfig.code,
				regionConfig,
			};
		} catch (error) {
			console.error("[getHomeData] Unexpected error resolving home data:", error);
			const marketSections = getMarketHomepageSections(regionCode);
			return {
				products: [],
				collections: [],
				homepageSections: marketSections || [],
				marketConfig: null,
				currencyCode: currency,
				activeRegion: regionConfig.code,
				regionConfig,
			};
		}
	});
