import Page from '@/features/authentication/routes/sign-in/page'
import { redirectSearchSchema } from '@/platform/tanstack/search'
import { createFileRoute } from '@tanstack/react-router'
import { storefrontHead } from '@/platform/tanstack/head'
import { m } from '@/paraglide/messages.js'

export const Route = createFileRoute('/$region/sign-in')({
	head: ({ params }) =>
		storefrontHead({
			title: m.Auth_pageTitle(),
			path: `/${params.region}/sign-in`,
			noIndex: true,
		}),
	validateSearch: redirectSearchSchema,
	component: RegionalSignInRoute,
});

function RegionalSignInRoute() {
	return <Page redirectTo={Route.useSearch().redirectTo} />;
}
