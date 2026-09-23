import { createServerFn } from '@tanstack/react-start';
import { GetCollectionProductsQuery } from '@/features/collections/graphql';
import { getLocale } from '@/paraglide/runtime';
import {
    getActiveRegionOnServer,
    getChannelTokenForRegion,
    getRegionConfig,
} from '@/platform/region/region.server';
import { queryOnServer } from '@/platform/vendure/api.server';
import { fetchCampaignBySlug } from './campaign.server';
import type { Campaign, CampaignLandingPage, HomepageSectionConfig } from './campaign.types';

export interface CampaignLandingDataResult {
    campaign: Campaign;
    activeLandingPage?: CampaignLandingPage;
    sections: HomepageSectionConfig[];
    products: any[];
    currencyCode: string;
    activeRegion: string;
    regionConfig: ReturnType<typeof getRegionConfig>;
    seo: {
        title: string;
        description: string;
        image?: string;
    };
}

export const getCampaignLandingData = createServerFn({ method: 'GET' })
    .validator(
        (data: { region?: string; slug: string; splat?: string }) => data
    )
    .handler(async ({ data }): Promise<CampaignLandingDataResult | null> => {
        const locale = getLocale();
        const regionCode = data?.region || getActiveRegionOnServer();
        const regionConfig = getRegionConfig(regionCode);
        const channelToken = getChannelTokenForRegion(regionCode);
        const currency = regionConfig.currencyCode;

        const campaign = await fetchCampaignBySlug(regionCode, data.slug);
        if (!campaign) {
            return null;
        }

        // Sub-page resolution
        let activeLandingPage: CampaignLandingPage | undefined;
        let sections: HomepageSectionConfig[] = campaign.homepageSections || [];

        const splat = (data.splat || '').replace(/^\/+|\/+$/g, '');
        if (splat && campaign.landingPages) {
            activeLandingPage = campaign.landingPages.find(
                (lp) => lp.subSlug.toLowerCase() === splat.toLowerCase()
            );
            if (activeLandingPage) {
                sections = activeLandingPage.sections || [];
            }
        }

        // Find collection slug from sections if specified
        let targetCollectionSlug = 'atelier';
        const featuredCollectionSection = sections.find(
            (s) => s.type === 'featured-collection' && s.props?.collectionSlug
        );
        if (featuredCollectionSection?.props?.collectionSlug) {
            targetCollectionSlug = String(featuredCollectionSection.props.collectionSlug);
        }

        const productsResult = await queryOnServer(
            GetCollectionProductsQuery,
            {
                slug: targetCollectionSlug,
                input: {
                    collectionSlug: targetCollectionSlug,
                    take: 12,
                    skip: 0,
                    groupByProduct: true,
                },
            },
            { languageCode: locale, currencyCode: currency, channelToken }
        ).catch(() => null);

        let products = productsResult?.data?.search?.items ?? [];
        if (products.length === 0) {
            const fallback = await queryOnServer(
                GetCollectionProductsQuery,
                {
                    slug: '',
                    input: {
                        take: 12,
                        skip: 0,
                        groupByProduct: true,
                    },
                },
                { languageCode: locale, currencyCode: currency, channelToken }
            ).catch(() => null);
            products = fallback?.data?.search?.items ?? [];
        }

        const title =
            activeLandingPage?.seoTitle ||
            activeLandingPage?.title ||
            campaign.seoTitle ||
            campaign.name;
        const description =
            activeLandingPage?.seoDescription ||
            campaign.seoDescription ||
            `${campaign.name} — Exclusive luxury collection at Suisuto.`;
        const image = campaign.seoImage || campaign.heroImageUrl;

        return {
            campaign,
            activeLandingPage,
            sections,
            products,
            currencyCode: currency,
            activeRegion: regionConfig.code,
            regionConfig,
            seo: {
                title,
                description,
                image,
            },
        };
    });
