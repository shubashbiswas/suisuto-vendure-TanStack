import { HomepageSectionConfig } from '../types/campaign.types';

export const CAMPAIGN_PLUGIN_LOGGER_CONTEXT = 'MultiCampaignPlugin';
export const CAMPAIGN_CACHE_TAG = 'campaigns';

export const DEFAULT_HERO_IMAGE = '/images/hero-campaign.jpg';
export const DEFAULT_COLLECTION_SLUG = 'atelier';

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSectionConfig[] = [
    { type: 'hero' },
    { type: 'countdown' },
    { type: 'campaign-banner' },
    { type: 'featured-collection', props: { collectionSlug: 'atelier', title: 'Curated Silks' } },
    { type: 'artisan-story' },
    { type: 'newsletter' },
];
