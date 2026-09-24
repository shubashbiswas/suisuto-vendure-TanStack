import Loading from "@/features/checkout/routes/loading";
import Page from "@/features/checkout/routes/page";
import { getCheckoutRouteData } from "@/features/checkout/checkout.functions";
import { createFileRoute } from "@tanstack/react-router";
import { storefrontHead } from "@/platform/tanstack/head";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/$region/checkout")({
	loader: () => getCheckoutRouteData(),
	head: ({ params }) =>
		storefrontHead({
			title: m.Checkout_pageTitle(),
			path: `/${params.region}/checkout`,
			noIndex: true,
		}),
	component: RegionalCheckoutRoute,
	pendingComponent: Loading,
});

function RegionalCheckoutRoute() {
	return <Page data={Route.useLoaderData()} />;
}
