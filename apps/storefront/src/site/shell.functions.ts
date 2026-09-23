import { createServerFn } from "@tanstack/react-start";
import {
	ActiveCustomerFragment,
	GetActiveCustomerQuery,
} from "@/features/account/graphql";
import { GetActiveOrderQuery } from "@/features/cart/graphql";
import { GetTopCollectionsQuery } from "@/features/collections/graphql";
import { getCurrencyCookie } from "@/features/currency/currency.server";
import { getLocale } from "@/paraglide/runtime";
import { cachedPublicData } from "@/platform/cache/public-cache";
import { noStoreMiddleware } from "@/platform/middleware";
import { queryOnServer } from "@/platform/vendure/api.server";
import { getActiveChannel } from "@/platform/vendure/channel";
import { readFragment } from "@/platform/vendure/graphql";
import {
	getActiveRegionOnServer,
	getChannelTokenForRegion,
	getDynamicRegions,
	getRegionConfig,
} from "@/platform/region/region.server";

/** Public shell with internally cached catalog/channel data and request currency. */
export const getPublicShellData = createServerFn({ method: "GET" }).handler(
	async () => {
		const locale = getLocale();
		const activeRegion = getActiveRegionOnServer();
		const channelToken = getChannelTokenForRegion(activeRegion);
		const currencyCookie = getCurrencyCookie();
		const availableRegions = await getDynamicRegions();
		const regionConfig = getRegionConfig(activeRegion);
		const [channel, collections] = await Promise.all([
			getActiveChannel(activeRegion),
			cachedPublicData({
				key: `collections:top:${activeRegion}:${locale}`,
				tags: [`collections-${activeRegion}-${locale}`],
				ttlMs: 5 * 60 * 1000,
				load: async () =>
					(
						await queryOnServer(
							GetTopCollectionsQuery,
							{},
							{ languageCode: locale, channelToken },
						)
					).data.collections.items,
			}),
		]);

		const availableCurrencyCodes =
			regionConfig.availableCurrencyCodes && regionConfig.availableCurrencyCodes.length > 0
				? regionConfig.availableCurrencyCodes
				: channel.availableCurrencyCodes;

		const activeCurrencyCode =
			currencyCookie && availableCurrencyCodes.includes(currencyCookie)
				? currencyCookie
				: (regionConfig.currencyCode ?? channel.defaultCurrencyCode);

		return {
			collections,
			availableCurrencyCodes,
			availableLanguageCodes:
				regionConfig.availableLanguageCodes && regionConfig.availableLanguageCodes.length > 0
					? regionConfig.availableLanguageCodes
					: channel.availableLanguageCodes,
			activeCurrencyCode,
			activeRegion,
			availableRegions,
		};
	},
);

/** Personalized shell — cart count + customer name; must not be cached. */
export const getPersonalizedShellData = createServerFn({ method: "GET" })
	.middleware([noStoreMiddleware])
	.handler(async () => {
		const [customerResult, orderResult] = await Promise.all([
			queryOnServer(GetActiveCustomerQuery, {}, { useAuthToken: true }),
			queryOnServer(GetActiveOrderQuery, {}, { useAuthToken: true }),
		]);
		const customer = readFragment(
			ActiveCustomerFragment,
			customerResult.data.activeCustomer,
		);
		return {
			cartItemCount: orderResult.data.activeOrder?.totalQuantity ?? 0,
			customerFirstName: customer?.firstName ?? null,
		};
	});
