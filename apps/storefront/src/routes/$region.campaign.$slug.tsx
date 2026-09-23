import { createFileRoute, notFound } from "@tanstack/react-router";
import {
	getCampaignLandingData,
	type CampaignLandingDataResult,
} from "@/features/campaigns/campaign-landing.functions";
import { CampaignLandingPage } from "@/site/campaigns/campaign-landing-page";
import { storefrontHead } from "@/platform/tanstack/head";

export const Route = createFileRoute("/$region/campaign/$slug")({
	loader: async ({ params }) => {
		const regionParam = params.region.trim().toLowerCase();
		const data = await getCampaignLandingData({
			data: { slug: params.slug, region: regionParam },
		});
		if (!data) throw notFound();
		return data;
	},
	staleTime: 30_000,
	head: ({ loaderData }) =>
		loaderData
			? storefrontHead({
					title: (loaderData as CampaignLandingDataResult).seo?.title || "Campaign",
					description:
						(loaderData as CampaignLandingDataResult).seo?.description || "",
				})
			: {},
	component: RegionalCampaignRoute,
});

function RegionalCampaignRoute() {
	const data = Route.useLoaderData() as unknown as CampaignLandingDataResult;
	return <CampaignLandingPage data={data} />;
}
