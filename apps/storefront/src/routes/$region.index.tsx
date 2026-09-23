import { createFileRoute } from "@tanstack/react-router";
import { ProductCardFragment } from "@/features/products/graphql";
import { storefrontHead } from "@/platform/tanstack/head";
import { readFragment } from "@/platform/vendure/graphql";
import { getHomeData } from "@/site/home/home.functions";
import Home from "@/site/home/page";

function getAssetOrigin(preview?: string) {
	if (!preview) return undefined;
	try {
		return new URL(preview).origin;
	} catch {
		return undefined;
	}
}

export const Route = createFileRoute("/$region/")({
	loader: async ({ params }) => {
		const regionParam = params.region.trim().toLowerCase();
		const data = await getHomeData({ data: { region: regionParam } });
		return data;
	},
	staleTime: 30_000,
	head: ({ loaderData }) => {
		const regionName = loaderData?.marketConfig?.name || loaderData?.regionConfig?.name || "Market";
		const title =
			loaderData?.marketConfig?.seo?.siteTitle ||
			loaderData?.campaign?.seoTitle ||
			`${regionName} Atelier | Luxury Fashion House`;
		const description =
			loaderData?.marketConfig?.seo?.defaultMetaDescription ||
			loaderData?.campaign?.seoDescription ||
			`Explore the handcrafted luxury collection for ${regionName}.`;

		const head = storefrontHead({
			title,
			description,
		});
		const firstProduct = loaderData?.products?.[0];
		const preview = firstProduct
			? readFragment(ProductCardFragment, firstProduct).productAsset?.preview
			: undefined;
		const assetOrigin = getAssetOrigin(preview);

		return {
			...head,
			links: [
				...head.links,
				...(assetOrigin
					? [{ rel: "preconnect", href: assetOrigin }]
					: []),
			],
		};
	},
	component: RegionalHomeRoute,
});

function RegionalHomeRoute() {
	const { products, collections, currencyCode, homepageSections, campaign } = Route.useLoaderData();
	return (
		<Home
			products={products}
			collections={collections}
			currencyCode={currencyCode}
			homepageSections={homepageSections}
			campaign={campaign}
		/>
	);
}
