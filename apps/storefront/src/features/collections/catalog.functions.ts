import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { truncateDescription } from "@/config/metadata";
import { buildSearchInput } from "@/features/search/search-helpers";
import { getLocale } from "@/paraglide/runtime";
import {
	getActiveRegionOnServer,
	getChannelTokenForRegion,
	getRegionConfig,
} from "@/platform/region/region.server";
import { catalogSearchSchema } from "@/platform/tanstack/search";
import { queryOnServer } from "@/platform/vendure/api.server";
import { GetCollectionPageQuery } from "./graphql";

const collectionPageSchema = catalogSearchSchema.extend({
	slug: z.string().min(1),
	region: z.string().optional(),
});

export const getCollectionPageData = createServerFn({ method: "GET" })
	.validator(collectionPageSchema)
	.handler(async ({ data }) => {
		const locale = getLocale();
		const regionCode = data.region || getActiveRegionOnServer();
		const channelToken = getChannelTokenForRegion(regionCode);
		const regionConfig = getRegionConfig(regionCode);
		const currencyCode = regionConfig.currencyCode;

		const productData = await queryOnServer(
			GetCollectionPageQuery,
			{
				slug: data.slug,
				input: buildSearchInput({
					searchParams: data,
					collectionSlug: data.slug,
				}),
			},
			{ languageCode: locale, currencyCode, channelToken },
		);
		const collection = productData.data.collection;
		if (!collection) return null;

		return {
			metadata: {
				title: collection.name,
				description: truncateDescription(collection.description),
				path: `/collections/${collection.slug}`,
				image: collection.featuredAsset?.preview ?? null,
			},
			// Only expose the query data; the raw result may carry a session token
			productData: { data: productData.data, currencyCode },
		};
	});
