import { ID } from '@vendure/core';

export type CampaignStatus = 'draft' | 'active' | 'archived';

export interface HomepageSectionConfig {
    type: string;
    props?: Record<string, any>;
}

export interface CampaignLandingPage {
    subSlug: string;
    title: string;
    sections: HomepageSectionConfig[];
    seoTitle?: string;
    seoDescription?: string;
}

export interface CampaignBanner {
    imageUrl: string;
    headline?: string;
    href?: string;
}

export interface CreateCampaignInput {
    market: string;
    name: string;
    slug: string;
    status?: CampaignStatus | string;
    priority?: number;
    startAt?: Date | string;
    endAt?: Date | string;
    heroImageUrl?: string;
    heroHeadline?: string;
    heroSubHeadline?: string;
    heroCtaLabel?: string;
    heroCtaHref?: string;
    heroTag?: string;
    homepageSections?: HomepageSectionConfig[];
    landingPages?: CampaignLandingPage[];
    promotionCode?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoImage?: string;
    banners?: CampaignBanner[];
}

export interface UpdateCampaignInput extends Partial<CreateCampaignInput> {
    id: ID;
}

export interface CampaignFilterOptions {
    market?: string;
    status?: string;
}

export enum DeletionResult {
    DELETED = 'DELETED',
    NOT_DELETED = 'NOT_DELETED',
}

export interface DeletionResponse {
    result: DeletionResult;
    message?: string;
}

export interface MultiCampaignPluginOptions {
    /**
     * URL of the storefront webhook to trigger cache revalidation on campaign changes.
     * Defaults to process.env.STOREFRONT_URL or http://localhost:3001
     */
    storefrontRevalidateUrl?: string;

    /**
     * Shared secret to authenticate cache revalidation requests.
     * Defaults to process.env.REVALIDATION_SECRET
     */
    revalidateSecret?: string;

    /**
     * Default target market fallback when omitted in queries.
     * Defaults to 'global'
     */
    defaultMarket?: string;
}
