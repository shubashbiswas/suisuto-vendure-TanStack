import Page from '@/features/authentication/routes/register/page'
import { redirectSearchSchema } from '@/platform/tanstack/search'
import { createFileRoute } from '@tanstack/react-router'
import { storefrontHead } from '@/platform/tanstack/head'
import { m } from '@/paraglide/messages.js'

export const Route = createFileRoute('/$region/register')({
	head: ({ params }) =>
		storefrontHead({
			title: m.Auth_createAccount(),
			path: `/${params.region}/register`,
			noIndex: true,
		}),
	validateSearch: redirectSearchSchema,
	component: RegionalRegisterRoute,
});

function RegionalRegisterRoute() {
	return <Page redirectTo={Route.useSearch().redirectTo} />;
}
