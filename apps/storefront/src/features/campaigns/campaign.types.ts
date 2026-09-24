export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'ended';

export type HomepageSectionType =
    | 'hero'
    | 'campaign-banner'
    | 'featured-collection'
    | 'product-carousel'
    | 'editorial'
    | 'artisan-story'
    | 'newsletter'
    | 'countdown'
    | 'video-banner'
    | 'full-width-slides'
    | 'seasonal-collection'
    | 'category-grid-3x3'
    | 'brand-grid-3x3'
    | 'bestselling-slides'
    | 'now-trending'
    | 'shop-the-mood'
    | 'atelier-pillars';

export interface HomepageSectionConfig {
    type: HomepageSectionType;
    props?: Record<string, any>;
}

export interface CampaignBanner {
    imageUrl: string;
    headline?: string;
    href?: string;
}

export interface CampaignLandingPage {
    subSlug: string;
    title: string;
    sections: HomepageSectionConfig[];
    seoTitle?: string;
    seoDescription?: string;
}

export interface Campaign {
    id: string;
    market: string;
    name: string;
    slug: string;
    status: CampaignStatus;
    startAt?: string;
    endAt?: string;
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
