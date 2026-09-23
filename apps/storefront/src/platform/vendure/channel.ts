import type { MarketRegion } from '@/platform/region/region.types';
import { queryOnServer } from './api.server';
import { GetActiveChannelQuery } from './channel-graphql';
import { cachedPublicData } from '@/platform/cache/public-cache';
import { getChannelTokenForRegion } from '@/platform/region/region.server';

/**
 * Get the active channel with caching enabled.
 * Channel configuration is cached per channel token for one hour in production,
 * and 5 seconds in development so backend changes reflect immediately.
 * Channel configuration is language-independent, so no locale is required.
 */
export async function getActiveChannel(region?: MarketRegion) {
    const channelToken = getChannelTokenForRegion(region);
    const ttlMs = process.env.NODE_ENV === 'production' ? 60 * 60 * 1000 : 5 * 1000;
    return cachedPublicData({
        key: `channel:active:${channelToken}`,
        tags: ['channel', `channel:${channelToken}`],
        ttlMs,
        load: async () => {
            const result = await queryOnServer(GetActiveChannelQuery, {}, { channelToken });
            return result.data.activeChannel;
        },
    });
}

