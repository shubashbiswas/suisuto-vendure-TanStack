import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/wishlist/routes/page";
import { storefrontHead } from "@/platform/tanstack/head";

export const Route = createFileRoute("/wishlist")({
	head: () =>
		storefrontHead({
			title: "Private Wishlist | Suisuto Atelier",
			path: "/wishlist",
			noIndex: true,
		}),
	component: WishlistRoute,
});

function WishlistRoute() {
	return <Page />;
}
