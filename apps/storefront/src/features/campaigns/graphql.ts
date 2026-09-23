import type { TadaDocumentNode } from 'gql.tada';
import { parse } from 'graphql';
import type { Campaign } from './campaign.types';

export interface GetActiveCampaignsResult {
    activeCampaigns: Campaign[];
}

export interface GetActiveCampaignsVariables {
    market: string;
}

export const GetActiveCampaignsQuery = parse(`
    query GetActiveCampaigns($market: String!) {
        activeCampaigns(market: $market) {
            id
            market
            name
            slug
            status
            startAt
            endAt
            heroImageUrl
            heroHeadline
            heroSubHeadline
            heroCtaLabel
            heroCtaHref
            heroTag
            homepageSections {
                type
                props
            }
            landingPages {
                subSlug
                title
                sections {
                    type
                    props
                }
                seoTitle
                seoDescription
            }
            promotionCode
            seoTitle
            seoDescription
            seoImage
            banners {
                imageUrl
                headline
                href
            }
        }
    }
`) as unknown as TadaDocumentNode<GetActiveCampaignsResult, GetActiveCampaignsVariables>;

export interface GetCampaignBySlugResult {
    campaignBySlug: Campaign | null;
}

export interface GetCampaignBySlugVariables {
    market: string;
    slug: string;
}

export const GetCampaignBySlugQuery = parse(`
    query GetCampaignBySlug($market: String!, $slug: String!) {
        campaignBySlug(market: $market, slug: $slug) {
            id
            market
            name
            slug
            status
            startAt
            endAt
            heroImageUrl
            heroHeadline
            heroSubHeadline
            heroCtaLabel
            heroCtaHref
            heroTag
            homepageSections {
                type
                props
            }
            landingPages {
                subSlug
                title
                sections {
                    type
                    props
                }
                seoTitle
                seoDescription
            }
            promotionCode
            seoTitle
            seoDescription
            seoImage
            banners {
                imageUrl
                headline
                href
            }
        }
    }
`) as unknown as TadaDocumentNode<GetCampaignBySlugResult, GetCampaignBySlugVariables>;
