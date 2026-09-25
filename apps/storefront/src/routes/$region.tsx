import { createFileRoute, notFound, Outlet, redirect } from "@tanstack/react-router";
import { syncRegionParam } from "@/platform/region/switch-region.functions";
import { StorefrontNotFound } from "@/site/storefront-not-found";

export const Route = createFileRoute("/$region")({
	loader: async ({ params }) => {
		const regionParam = params.region.trim().toLowerCase();

		// Guard against static asset or system route pollution
		if (
			regionParam.includes(".") ||
			regionParam.startsWith("_") ||
			regionParam === "api"
		) {
			throw notFound();
		}

		if (regionParam === "global") {
			throw redirect({ to: "/" });
		}

		await syncRegionParam({ data: regionParam });

		return { region: regionParam };
	},
	component: () => <Outlet />,
	notFoundComponent: StorefrontNotFound,
});
