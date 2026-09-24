import Page from "@/features/authentication/routes/verify-pending/page";
import { redirectSearchSchema } from "@/platform/tanstack/search";
import { createFileRoute } from "@tanstack/react-router";
import { storefrontHead } from "@/platform/tanstack/head";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/$region/verify-pending")({
	head: ({ params }) =>
		storefrontHead({
			title: m.Verify_pending_pageTitle(),
			path: `/${params.region}/verify-pending`,
			noIndex: true,
		}),
	validateSearch: redirectSearchSchema,
	component: RegionalVerifyPendingRoute,
});

function RegionalVerifyPendingRoute() {
	return <Page redirectTo={Route.useSearch().redirectTo} />;
}
