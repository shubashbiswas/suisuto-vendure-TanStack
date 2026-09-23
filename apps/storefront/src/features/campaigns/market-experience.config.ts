import type { HomepageSectionConfig } from './campaign.types';

export const MARKET_EXPERIENCE: Record<string, HomepageSectionConfig[]> = {
    global: [
        { type: 'hero' },
        { type: 'featured-collection', props: { collectionSlug: 'atelier' } },
        { type: 'product-carousel' },
        { type: 'artisan-story' },
        { type: 'newsletter' },
    ],
    in: [
        { type: 'hero' },
        { type: 'featured-collection', props: { collectionSlug: 'atelier' } },
        { type: 'artisan-story' },
        { type: 'newsletter' },
    ],
    bd: [
        { type: 'hero' },
        { type: 'featured-collection', props: { collectionSlug: 'atelier' } },
        { type: 'newsletter' },
    ],
    ae: [
        { type: 'hero' },
        { type: 'featured-collection', props: { collectionSlug: 'atelier' } },
        { type: 'product-carousel' },
        { type: 'artisan-story' },
        { type: 'newsletter' },
    ],
    us: [
        { type: 'hero' },
        { type: 'featured-collection', props: { collectionSlug: 'atelier' } },
        { type: 'product-carousel' },
        { type: 'artisan-story' },
        { type: 'newsletter' },
    ],
};

export const DEFAULT_SECTIONS: HomepageSectionConfig[] = MARKET_EXPERIENCE.global;
