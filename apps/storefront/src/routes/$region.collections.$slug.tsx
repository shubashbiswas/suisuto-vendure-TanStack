import {
	createFileRoute,
	notFound,
	stripSearchParams,
} from "@tanstack/react-router";
import { getCollectionPageData } from "@/features/collections/catalog.functions";
import Loading from "@/features/collections/routes/loading";
import Page from "@/features/collections/routes/page";
import { StorefrontNotFound } from "@/site/storefront-not-found";
import { storefrontHead } from "@/platform/tanstack/head";
import { catalogSearchSchema } from "@/platform/tanstack/search";

export const Route = createFileRoute("/$region/collections/$slug")({
	validateSearch: catalogSearchSchema,
	search: {
		middlewares: [stripSearchParams({ page: 1, sort: "name-asc" })],
	},
	loaderDeps: ({ search: { q, page, sort, facets } }) => ({
		q,
		page,
		sort,
		facets,
	}),
	loader: async ({ params, deps }) => {
		const data = await getCollectionPageData({
			data: { slug: params.slug, region: params.region, ...deps },
		});
		if (!data) throw notFound();
		return data;
	},
	staleTime: 30_000,
	head: ({ loaderData }) =>
		loaderData ? storefrontHead(loaderData.metadata) : {},
	pendingComponent: Loading,
	notFoundComponent: StorefrontNotFound,
	component: RegionalCollectionRoute,
});

function RegionalCollectionRoute() {
	const loaderData = Route.useLoaderData();
	if (!loaderData) {
		return <StorefrontNotFound />;
	}
	const { metadata, productData } = loaderData;
	return (
		<Page
			searchParams={Route.useSearch()}
			collectionName={metadata.title}
			productData={productData}
		/>
	);
}
