import { getCookie, getRequest, setCookie } from "@tanstack/react-start/server";
import { cachedPublicData } from "../cache/public-cache.ts";
import { env } from "../env.server.ts";
import {
	createRegionConfig,
	DEFAULT_GLOBAL_REGION,
	DEFAULT_REGION,
	type MarketRegion,
	type RegionConfig,
} from "./region.types.ts";

export const REGION_COOKIE = "vendure-region";

let dynamicMarketsMemoryCache: RegionConfig[] = [
	DEFAULT_GLOBAL_REGION,
	createRegionConfig({
		code: "bd",
		token: "bangladesh",
		name: "Bangladesh",
		currencyCode: "BDT",
		hubName: "Dhaka Hub",
	}),
	createRegionConfig({
		code: "in",
		token: "india",
		name: "India",
		currencyCode: "INR",
		hubName: "Mumbai Hub",
	}),
];

export function setRegionCookie(region: MarketRegion) {
	setCookie(REGION_COOKIE, region, {
		path: "/",
		maxAge: 60 * 60 * 24 * 365,
		sameSite: "lax",
	});
}

export function getRegionCookie(): MarketRegion | undefined {
	try {
		const val = getCookie(REGION_COOKIE);
		if (val && typeof val === "string" && val.trim().length > 0) {
			return val.trim().toLowerCase() as MarketRegion;
		}
	} catch {
		return undefined;
	}
	return undefined;
}

/**
 * Fetch all available channels and markets dynamically from Vendure GraphQL API.
 * Never hardcoded — any new channel added to Vendure is automatically recognized.
 */
async function fetchAvailableMarketsFromVendure(): Promise<RegionConfig[]> {
	try {
		const res = await fetch(env.VENDURE_SHOP_API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				query: `
						query GetAvailableMarkets {
						availableMarkets {
							id
							code
							token
							name
							currencyCode
							availableCurrencyCodes
							defaultLanguageCode
							availableLanguageCodes
						}
					}
				`,
			}),
		});
		if (!res.ok) return [DEFAULT_GLOBAL_REGION];
		const json = await res.json();
		const items = json?.data?.availableMarkets;
		if (Array.isArray(items) && items.length > 0) {
			return items.map((m: {
				code: string;
				token: string;
				name: string;
				currencyCode: string;
				defaultLanguageCode?: string;
				availableLanguageCodes?: string[];
				availableCurrencyCodes?: string[];
			}) =>
				createRegionConfig({
					code: m.code,
					token: m.token,
					name: m.name,
					currencyCode: m.currencyCode,
					defaultLanguageCode: m.defaultLanguageCode,
					availableLanguageCodes: m.availableLanguageCodes,
					availableCurrencyCodes: m.availableCurrencyCodes,
				})
			);
		}
	} catch (e) {
		console.warn("Failed to fetch available markets from Vendure:", e);
	}
	return [DEFAULT_GLOBAL_REGION];
}

export async function getDynamicRegions(): Promise<RegionConfig[]> {
	const ttlMs = process.env.NODE_ENV === "production" ? 5 * 60 * 1000 : 5 * 1000;
	const markets = await cachedPublicData({
		key: "vendure:available-markets",
		tags: ["markets", "channel", "channels"],
		ttlMs,
		load: () => fetchAvailableMarketsFromVendure(),
	});
	if (markets && markets.length > 0) {
		dynamicMarketsMemoryCache = markets;
	}
	return markets;
}

export function getActiveRegionOnServer(): MarketRegion {
	try {
		const req = getRequest();
		if (req?.url) {
			const pathname = new URL(req.url).pathname;
			const segments = pathname.split("/").filter(Boolean);
			if (segments.length > 0) {
				const first = segments[0].toLowerCase();
				// Check for known or valid 2-letter ISO market codes in the URL path
				if (
					(first.length === 2 && /^[a-z]{2}$/.test(first)) ||
					dynamicMarketsMemoryCache.some((m) => m.code === first)
				) {
					return first;
				}
			}

			// If this is an RPC call or internal route (e.g. /_serverFn), inspect Referer
			const referer = req.headers?.get("referer");
			if (referer) {
				const refPathname = new URL(referer).pathname;
				const refSegments = refPathname.split("/").filter(Boolean);
				if (refSegments.length > 0) {
					const refFirst = refSegments[0].toLowerCase();
					if (
						(refFirst.length === 2 && /^[a-z]{2}$/.test(refFirst)) ||
						dynamicMarketsMemoryCache.some((m) => m.code === refFirst)
					) {
						return refFirst;
					}
				}
			}
		}
	} catch {
		// Fallback to cookie or default if request URL is unavailable
	}

	return getRegionCookie() || DEFAULT_REGION;
}

export function getChannelTokenForRegion(region?: MarketRegion): string {
	const activeRegion = (region || getActiveRegionOnServer()).trim().toLowerCase();

	if (activeRegion === "__default_channel__") {
		return "";
	}

	const match = dynamicMarketsMemoryCache.find(
		(m) => m.code.toLowerCase() === activeRegion || m.token.toLowerCase() === activeRegion
	);
	if (match && match.token) {
		return match.token;
	}

	if (activeRegion === "global" || activeRegion === "") {
		return "global";
	}

	// Dynamic market fallback: if a dedicated channel is not yet configured, use default channel
	return "";
}

export function getRegionConfig(region?: MarketRegion): RegionConfig {
	const activeRegion = region || getActiveRegionOnServer();
	const target = activeRegion.trim().toLowerCase();

	const match = dynamicMarketsMemoryCache.find(
		(m) => m.code.toLowerCase() === target || m.token.toLowerCase() === target
	);
	if (match) {
		return match;
	}

	return createRegionConfig({
		code: target,
		currencyCode: dynamicMarketsMemoryCache[0]?.currencyCode,
	});
}
