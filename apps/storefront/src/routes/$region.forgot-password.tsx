import Page from '@/features/authentication/routes/forgot-password/page'
import { createFileRoute } from '@tanstack/react-router'
import { storefrontHead } from '@/platform/tanstack/head'
import { m } from '@/paraglide/messages.js'

export const Route = createFileRoute('/$region/forgot-password')({
	head: ({ params }) =>
		storefrontHead({
			title: m.Auth_forgotPasswordPageTitle(),
			path: `/${params.region}/forgot-password`,
			noIndex: true,
		}),
	component: Page,
});
