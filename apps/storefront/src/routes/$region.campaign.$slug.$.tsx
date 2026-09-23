import { createFileRoute, notFound } from "@tanstack/react-router";
import {
	getCampaignLandingData,
	type CampaignLandingDataResult,
} from "@/features/campaigns/campaign-landing.functions";
import { CampaignLandingPage } from "@/site/campaigns/campaign-landing-page";
import { storefrontHead } from "@/platform/tanstack/head";

export const Route = createFileRoute("/$region/campaign/$slug/$")({
	loader: async ({ params }) => {
		const regionParam = params.region.trim().toLowerCase();
		const splat = (params as Record<string, string>)["_splat"] || "";
		const data = await getCampaignLandingData({
			data: { slug: params.slug, splat, region: regionParam },
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
	component: RegionalCampaignSplatRoute,
});

function RegionalCampaignSplatRoute() {
	const data = Route.useLoaderData() as unknown as CampaignLandingDataResult;
	return <CampaignLandingPage data={data} />;
}
