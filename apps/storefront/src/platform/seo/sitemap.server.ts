import { SITE_URL } from "@/config/metadata";
import { baseLocale, locales } from "@/paraglide/runtime";
import { queryOnServer } from "@/platform/vendure/api.server";
import type { ResultOf } from "@/platform/vendure/graphql";
import { SitemapEntriesQuery } from "./graphql";
import { getDynamicRegions } from "@/platform/region/region.server";

const PAGE_SIZE = 100;

type Locale = (typeof locales)[number];

interface SitemapEntry {
	path: string;
	lastModified?: string;
}

type SitemapResult = ResultOf<typeof SitemapEntriesQuery>;

function escapeXml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

function localizedUrl(locale: Locale, path: string) {
	const localizedPath = `/${locale}${path === "/" ? "" : path}`;
	return new URL(localizedPath, SITE_URL).href;
}

async function loadLocaleEntries(locale: Locale) {
	const collections: Array<SitemapResult["collections"]["items"][number]> = [];
	const products: Array<SitemapResult["search"]["items"][number]> = [];
	let skip = 0;
	let totalItems = 0;

	do {
		const result = await queryOnServer(
			SitemapEntriesQuery,
			{ skip, take: PAGE_SIZE },
			{ languageCode: locale },
		);
		collections.push(
			...result.data.collections.items.filter(
				(collection) => collection.parent,
			),
		);
		products.push(...result.data.search.items);
		totalItems = Math.max(
			result.data.collections.totalItems,
			result.data.search.totalItems,
		);
		skip += PAGE_SIZE;
	} while (skip < totalItems);

	return { collections, products };
}

export async function createSitemapResponse() {
	const entries = new Map<string, Map<Locale, SitemapEntry>>();

	for (const locale of locales) {
		const home = entries.get("page:home") ?? new Map();
		home.set(locale, { path: "/" });
		entries.set("page:home", home);
		const { collections, products } = await loadLocaleEntries(locale);

		const shop = entries.get("page:shop") ?? new Map();
		shop.set(locale, { path: "/shop" });
		entries.set("page:shop", shop);

		for (const collection of collections) {
			const localized = entries.get(`collection:${collection.id}`) ?? new Map();
			localized.set(locale, {
				path: `/collections/${encodeURIComponent(collection.slug)}`,
				lastModified: collection.updatedAt,
			});
			entries.set(`collection:${collection.id}`, localized);
		}

		for (const product of products) {
			const localized =
				entries.get(`product:${product.productId}`) ?? new Map();
			localized.set(locale, {
				path: `/products/${encodeURIComponent(product.slug)}`,
			});
			entries.set(`product:${product.productId}`, localized);
		}
	}

	const regions = await getDynamicRegions().catch(() => []);

	for (const reg of regions) {
		if (reg.code !== "global") {
			const regHome = entries.get(`page:home:${reg.code}`) ?? new Map();
			regHome.set(baseLocale, { path: `/${reg.code}` });
			entries.set(`page:home:${reg.code}`, regHome);

			const regShop = entries.get(`page:shop:${reg.code}`) ?? new Map();
			regShop.set(baseLocale, { path: `/${reg.code}/shop` });
			entries.set(`page:shop:${reg.code}`, regShop);
		}
	}

	const urls = Array.from(entries.values()).flatMap((localized) =>
		Array.from(localized, ([locale, entry]) => {
			const alternates = Array.from(
				localized,
				([alternateLocale, alternate]) =>
					`    <xhtml:link rel="alternate" hreflang="${alternateLocale}" href="${escapeXml(localizedUrl(alternateLocale, alternate.path))}" />`,
			).join("\n");
			const fallback = localized.get(baseLocale) ?? entry;
			const lastModified = entry.lastModified
				? `\n    <lastmod>${escapeXml(entry.lastModified)}</lastmod>`
				: "";

			return `  <url>
    <loc>${escapeXml(localizedUrl(locale, entry.path))}</loc>${lastModified}
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(localizedUrl(baseLocale, fallback.path))}" />
  </url>`;
		}),
	);

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			"Cache-Control": "public, max-age=300, s-maxage=3600",
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
}
