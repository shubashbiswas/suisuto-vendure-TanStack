import { createFileRoute, redirect } from "@tanstack/react-router";
import { productSearchSchema } from "@/platform/tanstack/search";

export const Route = createFileRoute("/$region/product/$slug")({
	validateSearch: productSearchSchema,
	loader: ({ params, location }) => {
		throw redirect({
			to: "/$region/products/$slug",
			params: { region: params.region, slug: params.slug },
			search: location.search,
		});
	},
});

