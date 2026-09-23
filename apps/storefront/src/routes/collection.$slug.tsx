import { createFileRoute, redirect } from "@tanstack/react-router";
import { catalogSearchSchema } from "@/platform/tanstack/search";

export const Route = createFileRoute("/collection/$slug")({
	validateSearch: catalogSearchSchema,
	loader: ({ params, location }) => {
		const search = location.search as any;
		throw redirect({
			to: "/collections/$slug",
			params: { slug: params.slug },
			search: {
				page: search?.page ?? 1,
				sort: search?.sort ?? "name-asc",
				facets: search?.facets ?? [],
				q: search?.q,
			},
		});
	},
});

