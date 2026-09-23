import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getAccountSession } from "@/features/account/auth.functions";
import Layout from "@/features/account/routes/layout";

export const Route = createFileRoute("/$region/account")({
	beforeLoad: async ({ location, params }) => {
		const customer = await getAccountSession();
		if (!customer) {
			throw redirect({
				to: "/$region/sign-in",
				params: { region: params.region },
				search: { redirectTo: location.href },
			});
		}
		return { customer };
	},
	head: () => ({
		meta: [{ name: "robots", content: "noindex, nofollow" }],
	}),
	component: RegionalAccountRoute,
});

function RegionalAccountRoute() {
	return (
		<Layout>
			<Outlet />
		</Layout>
	);
}
