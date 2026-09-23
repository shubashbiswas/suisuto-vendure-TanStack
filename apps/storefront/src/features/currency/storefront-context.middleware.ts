import { createMiddleware } from "@tanstack/react-start";
import { getActiveCurrencyCodeOnServer } from "@/features/currency/active-currency.server";
import { getActiveRegionOnServer } from "@/platform/region/region.server";
import { getRouteLocale } from "@/platform/i18n/server";

/** Resolves locale + active currency + market region once and exposes them on handler context. */
export const storefrontContextMiddleware = createMiddleware({
	type: "function",
}).server(async ({ next }) => {
	const [locale, currencyCode, region] = await Promise.all([
		getRouteLocale(),
		getActiveCurrencyCodeOnServer(),
		getActiveRegionOnServer(),
	]);
	return next({ context: { locale, currencyCode, region } });
});
