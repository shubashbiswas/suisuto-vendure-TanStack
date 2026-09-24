import Loading from "@/features/cart/routes/loading";
import Page from "@/features/cart/routes/page";
import { createFileRoute } from "@tanstack/react-router";
import { storefrontHead } from "@/platform/tanstack/head";
import { m } from "@/paraglide/messages.js";
import { getCartRouteData } from "@/features/cart/cart.functions";

export const Route = createFileRoute("/$region/cart")({
	loader: () => getCartRouteData(),
	head: ({ params }) =>
		storefrontHead({
			title: m.Cart_title(),
			path: `/${params.region}/cart`,
			noIndex: true,
		}),
	component: RegionalCartRoute,
	pendingComponent: Loading,
});
function RegionalCartRoute() {
	return <Page activeOrder={Route.useLoaderData()} />;
}
