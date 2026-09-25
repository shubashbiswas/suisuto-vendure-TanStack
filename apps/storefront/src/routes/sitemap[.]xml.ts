import { createFileRoute } from "@tanstack/react-router";
import { createSitemapResponse } from "@/platform/seo/sitemap.server";
import { fetchActiveCampaigns } from "@/features/campaigns/campaign.server";

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: () => createSitemapResponse({ fetchCampaigns: fetchActiveCampaigns }),
		},
	},
});
