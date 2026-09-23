import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/wishlist/routes/page";
import { storefrontHead } from "@/platform/tanstack/head";

export const Route = createFileRoute("/$region/wishlist")({
	head: ({ params }) =>
		storefrontHead({
			title: "Private Wishlist | Suisuto Atelier",
			path: `/${params.region}/wishlist`,
			noIndex: true,
		}),
	component: RegionalWishlistRoute,
});

function RegionalWishlistRoute() {
	return <Page />;
}
