import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import Loading from "@/features/search/routes/loading";
import Page from "@/features/search/routes/page";
import { getSearchPageData } from "@/features/search/search.functions";
import { m } from "@/paraglide/messages.js";
import { storefrontHead } from "@/platform/tanstack/head";
import { catalogSearchSchema } from "@/platform/tanstack/search";

export const Route = createFileRoute("/$region/search")({
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
	head: () =>
		storefrontHead({
			title: m.Search_pageTitle(),
			path: "/search",
			noIndex: true,
		}),
	pendingComponent: Loading,
	component: RegionalSearchRoute,
});

function RegionalSearchRoute() {
	return (
		<Page
			searchParams={Route.useSearch()}
			productData={Route.useLoaderData()}
		/>
	);
}
