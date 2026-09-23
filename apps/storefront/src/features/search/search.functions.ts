import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getLocale } from "@/paraglide/runtime";
import {
	getActiveRegionOnServer,
	getChannelTokenForRegion,
	getRegionConfig,
} from "@/platform/region/region.server";
import { catalogSearchSchema } from "@/platform/tanstack/search";
import { queryOnServer } from "@/platform/vendure/api.server";
import { SearchProductsQuery } from "./graphql";
import { buildSearchInput } from "./search-helpers";

export const getSearchPageData = createServerFn({ method: "GET" })
	.validator(catalogSearchSchema.extend({ region: z.string().optional() }))
	.handler(async ({ data }) => {
		const locale = getLocale();
		const regionCode = data.region || getActiveRegionOnServer();
		const channelToken = getChannelTokenForRegion(regionCode);
		const regionConfig = getRegionConfig(regionCode);
		const currencyCode = regionConfig.currencyCode;

		const result = await queryOnServer(
			SearchProductsQuery,
			{ input: buildSearchInput({ searchParams: data }) },
			{ languageCode: locale, currencyCode, channelToken },
		);
		// Only expose the query data; the raw result may carry a session token
		return { data: result.data, currencyCode };
	});
