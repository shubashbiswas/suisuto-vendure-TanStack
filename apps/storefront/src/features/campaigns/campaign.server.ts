import { cachedPublicData } from '@/platform/cache/public-cache';
import { getChannelTokenForRegion } from '@/platform/region/region.server';
import { queryOnServer } from '@/platform/vendure/api.server';
import type { Campaign, HomepageSectionConfig } from './campaign.types';
import { GetActiveCampaignsQuery, GetCampaignBySlugQuery } from './graphql';
import { DEFAULT_SECTIONS, MARKET_EXPERIENCE } from './market-experience.config';

export async function fetchActiveCampaigns(market: string): Promise<Campaign[]> {
    const normalizedMarket = (market || 'global').toLowerCase().trim();
    const channelToken = getChannelTokenForRegion(normalizedMarket);

    return cachedPublicData<Campaign[]>({
        key: `campaigns:active:${normalizedMarket}`,
        tags: [`campaigns-${normalizedMarket}`],
        ttlMs: 30_000,
        load: async () => {
            try {
                const response = await queryOnServer(
                    GetActiveCampaignsQuery,
                    { market: normalizedMarket },
                    { channelToken }
                );
                return response?.data?.activeCampaigns || [];
            } catch (err) {
                console.error(`Failed to fetch active campaigns for market ${normalizedMarket}:`, err);
                return [];
            }
        },
    });
}

export async function getActiveCampaign(market: string): Promise<Campaign | null> {
    const campaigns = await fetchActiveCampaigns(market);
    return campaigns.length > 0 ? campaigns[0] : null;
}

export function getMarketHomepageSections(
    market: string,
    campaign: Campaign | null
): HomepageSectionConfig[] {
    if (campaign?.homepageSections && campaign.homepageSections.length > 0) {
        return campaign.homepageSections;
    }

    const normalizedMarket = (market || 'global').toLowerCase().trim();
    return MARKET_EXPERIENCE[normalizedMarket] || DEFAULT_SECTIONS;
}

export async function fetchCampaignBySlug(
    market: string,
    slug: string
): Promise<Campaign | null> {
    const normalizedMarket = (market || 'global').toLowerCase().trim();
    const normalizedSlug = (slug || '').toLowerCase().trim();
    const channelToken = getChannelTokenForRegion(normalizedMarket);

    return cachedPublicData<Campaign | null>({
        key: `campaign:slug:${normalizedMarket}:${normalizedSlug}`,
        tags: [`campaign-${normalizedMarket}-${normalizedSlug}`],
        ttlMs: 30_000,
        load: async () => {
            try {
                const response = await queryOnServer(
                    GetCampaignBySlugQuery,
                    { market: normalizedMarket, slug: normalizedSlug },
                    { channelToken }
                );
                return response?.data?.campaignBySlug || null;
            } catch (err) {
                console.error(
                    `Failed to fetch campaign for market ${normalizedMarket} and slug ${normalizedSlug}:`,
                    err
                );
                return null;
            }
        },
    });
}
