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

export const Route = createFileRoute("/")({
	loader: () => getHomeData({ data: { region: "global" } }),
	staleTime: 30_000,
	head: ({ loaderData }) => {
		const title =
			loaderData?.marketConfig?.seo?.siteTitle ||
			"Global Atelier | Luxury Fashion House";
		const description =
			loaderData?.marketConfig?.seo?.defaultMetaDescription ||
			"Explore handcrafted haute couture and artisanal luxury collections.";

		const head = storefrontHead({
			title,
			description,
		});
		const firstProduct = loaderData?.products[0];
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
	component: HomeRoute,
});

function HomeRoute() {
	const { products, collections, currencyCode, homepageSections } = Route.useLoaderData();
	return (
		<Home
			products={products}
			collections={collections}
			currencyCode={currencyCode}
			homepageSections={homepageSections}
		/>
	);
}
