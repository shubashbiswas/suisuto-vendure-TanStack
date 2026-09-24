import Page from "@/features/authentication/routes/reset-password/page";
import { tokenSearchSchema } from "@/platform/tanstack/search";
import { createFileRoute } from "@tanstack/react-router";
import { storefrontHead } from "@/platform/tanstack/head";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/$region/reset-password")({
	head: ({ params }) =>
		storefrontHead({
			title: m.Auth_resetPasswordPageTitle(),
			path: `/${params.region}/reset-password`,
			noIndex: true,
		}),
	validateSearch: tokenSearchSchema,
	component: RegionalResetRoute,
});

function RegionalResetRoute() {
	return <Page token={Route.useSearch().token} />;
}
