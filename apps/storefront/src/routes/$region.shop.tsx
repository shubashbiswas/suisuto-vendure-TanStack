import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import Loading from "@/features/search/routes/loading";
import Page from "@/features/search/routes/page";
import { getSearchPageData } from "@/features/search/search.functions";
import { storefrontHead } from "@/platform/tanstack/head";
import { catalogSearchSchema } from "@/platform/tanstack/search";

export const Route = createFileRoute("/$region/shop")({
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
	loader: ({ params, deps }) =>
		getSearchPageData({ data: { ...deps, region: params.region } }),
	staleTime: 30_000,
	head: ({ params }) =>
		storefrontHead({
			title: `Haute Couture Shop | Atelier Catalog`,
			path: `/${params.region}/shop`,
		}),
	pendingComponent: Loading,
	component: RegionalShopRoute,
});

function RegionalShopRoute() {
	return (
		<Page
			searchParams={Route.useSearch()}
			productData={Route.useLoaderData()}
		/>
	);
}
