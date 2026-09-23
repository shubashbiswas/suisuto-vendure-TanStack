import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import Loading from "@/features/search/routes/loading";
import Page from "@/features/search/routes/page";
import { getSearchPageData } from "@/features/search/search.functions";
import { storefrontHead } from "@/platform/tanstack/head";
import { catalogSearchSchema } from "@/platform/tanstack/search";

export const Route = createFileRoute("/shop")({
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
	loader: ({ deps }) =>
		getSearchPageData({ data: { ...deps, region: "global" } }),
	staleTime: 30_000,
	head: () =>
		storefrontHead({
			title: "Haute Couture Shop | Atelier Catalog",
			path: "/shop",
		}),
	pendingComponent: Loading,
	component: ShopRoute,
});

function ShopRoute() {
	return (
		<Page
			searchParams={Route.useSearch()}
			productData={Route.useLoaderData()}
		/>
	);
}
