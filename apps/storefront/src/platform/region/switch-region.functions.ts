import { createServerFn } from "@tanstack/react-start";
import { setCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import { getRegionConfig, setRegionCookie } from "./region.server";
import { type MarketRegion } from "./region.types";

const CURRENCY_COOKIE = "vendure-currency";

const regionSchema = z.object({
	region: z.string().min(1),
});

export const switchRegion = createServerFn({ method: "POST" })
	.validator(regionSchema)
	.handler(async ({ data }) => {
		const targetRegion = data.region.trim().toLowerCase() as MarketRegion;
		const regionConfig = getRegionConfig(targetRegion);
		const targetCurrency = regionConfig.currencyCode;

		// Persist the regional market preference
		setRegionCookie(targetRegion);

		// Synchronize market currency cookie
		setCookie(CURRENCY_COOKIE, targetCurrency, {
			path: "/",
			maxAge: 60 * 60 * 24 * 365,
			sameSite: "lax",
		});

		return {
			success: true,
			region: targetRegion,
			currencyCode: targetCurrency,
		};
	});

export const syncRegionParam = createServerFn({ method: "GET" })
	.validator((region: string) => region)
	.handler(async ({ data }) => {
		try {
			const targetRegion = data.trim().toLowerCase() as MarketRegion;
			const regionConfig = getRegionConfig(targetRegion);
			setRegionCookie(targetRegion);
			setCookie(CURRENCY_COOKIE, regionConfig.currencyCode, {
				path: "/",
				maxAge: 60 * 60 * 24 * 365,
				sameSite: "lax",
			});
			return { region: targetRegion };
		} catch {
			return { region: data };
		}
	});
