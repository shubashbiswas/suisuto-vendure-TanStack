import { createFileRoute, notFound } from "@tanstack/react-router";
import {
	getCampaignLandingData,
	type CampaignLandingDataResult,
} from "@/features/campaigns/campaign-landing.functions";
import { CampaignLandingPage } from "@/site/campaigns/campaign-landing-page";
import { storefrontHead } from "@/platform/tanstack/head";

export const Route = createFileRoute("/campaign/$slug")({
	loader: async ({ params }) => {
		const data = await getCampaignLandingData({
			data: { slug: params.slug, region: "global" },
		});
		if (!data) throw notFound();
		return data;
	},
	staleTime: 30_000,
	head: ({ loaderData }) =>
		loaderData
			? storefrontHead({
					title: loaderData.seo.title,
					description: loaderData.seo.description,
				})
			: {},
	component: CampaignRoute,
});

function CampaignRoute() {
	const data = Route.useLoaderData() as unknown as CampaignLandingDataResult;
	return <CampaignLandingPage data={data} />;
}
