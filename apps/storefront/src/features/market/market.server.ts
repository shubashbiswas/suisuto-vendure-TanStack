import { cachedPublicData } from "@/platform/cache/public-cache";
import { getChannelTokenForRegion } from "@/platform/region/region.server";
import { queryOnServer } from "@/platform/vendure/api.server";
import type { MarketConfigData } from "./market.types";
import { GetMarketByCodeQuery } from "./graphql";

export async function fetchMarketConfig(
	marketCode: string
): Promise<MarketConfigData | null> {
	const normalized = (marketCode || "global").toLowerCase().trim();
	const channelToken = getChannelTokenForRegion(normalized);

	return cachedPublicData<MarketConfigData | null>({
		key: `market:config:${normalized}`,
		tags: ["markets", `market-${normalized}`],
		ttlMs: 30_000,
		load: async () => {
			try {
				const response = await queryOnServer(
					GetMarketByCodeQuery,
					{ code: normalized },
					{ channelToken }
				);
				return response?.data?.market || null;
			} catch (err) {
				console.warn(
					`[MultiMarket] Failed to fetch market config for '${normalized}':`,
					err
				);
				return null;
			}
		},
	});
}
