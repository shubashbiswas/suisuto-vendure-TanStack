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
        { type: 'video-banner' },
        { type: 'full-width-slides' },
        { type: 'seasonal-collection' },
        { type: 'category-grid-3x3' },
        { type: 'brand-grid-3x3' },
        { type: 'bestselling-slides' },
        { type: 'now-trending' },
        { type: 'shop-the-mood' },
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
