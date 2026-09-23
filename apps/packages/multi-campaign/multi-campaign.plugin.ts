import { OnApplicationBootstrap } from '@nestjs/common';
import { EventBus, Logger, PluginCommonModule, Type, VendurePlugin } from '@vendure/core';
import { Campaign } from './entities/campaign.entity';
import { CampaignEvent } from './events/campaign.event';
import { CampaignService } from './services/campaign.service';
import { CampaignShopResolver, campaignShopApiSchema } from './resolvers/campaign-shop.resolver';
import { CampaignAdminResolver, campaignAdminApiSchema } from './resolvers/campaign-admin.resolver';
import { MultiCampaignPluginOptions } from './types/campaign.types';
import { CAMPAIGN_PLUGIN_LOGGER_CONTEXT } from './constants/campaign.constants';

@VendurePlugin({
    compatibility: '^3.0.0',
    imports: [PluginCommonModule],
    entities: [Campaign],
    providers: [CampaignService],
    shopApiExtensions: {
        schema: campaignShopApiSchema,
        resolvers: [CampaignShopResolver],
    },
    adminApiExtensions: {
        schema: campaignAdminApiSchema,
        resolvers: [CampaignAdminResolver],
    },
    dashboard: './dashboard',
})
export class MultiCampaignPlugin implements OnApplicationBootstrap {
    private static options: MultiCampaignPluginOptions = {};

    constructor(private eventBus: EventBus) {}

    static init(options: MultiCampaignPluginOptions = {}): Type<MultiCampaignPlugin> {
        this.options = options;
        return MultiCampaignPlugin;
    }

    async onApplicationBootstrap() {
        this.eventBus.ofType(CampaignEvent).subscribe(async event => {
            const rawUrl =
                MultiCampaignPlugin.options.storefrontRevalidateUrl ||
                process.env.STOREFRONT_URL ||
                'http://localhost:3001';
            const revalidateUrl = rawUrl.endsWith('/api/revalidate')
                ? rawUrl
                : `${rawUrl.replace(/\/+$/, '')}/api/revalidate`;
            const secret =
                MultiCampaignPlugin.options.revalidateSecret ||
                process.env.REVALIDATION_SECRET;

            if (revalidateUrl && secret) {
                const tags = [
                    'campaigns',
                    `campaign-${event.campaign.market}`,
                    `campaign-${event.campaign.slug}`,
                ];
                try {
                    const response = await fetch(revalidateUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${secret}`,
                        },
                        body: JSON.stringify({ tags }),
                        signal: AbortSignal.timeout(5000),
                    });
                    if (!response.ok) {
                        Logger.warn(
                            `Storefront campaign revalidation returned HTTP ${response.status} for '${event.campaign.slug}' (${event.action})`,
                            CAMPAIGN_PLUGIN_LOGGER_CONTEXT
                        );
                    } else {
                        Logger.info(
                            `Storefront cache revalidated for campaign '${event.campaign.slug}' (${event.action})`,
                            CAMPAIGN_PLUGIN_LOGGER_CONTEXT
                        );
                    }
                } catch (err: any) {
                    Logger.warn(
                        `Storefront campaign cache revalidation failed for '${event.campaign.slug}': ${err?.message || err}`,
                        CAMPAIGN_PLUGIN_LOGGER_CONTEXT
                    );
                }
            }
        });
    }
}

/**
 * Backward compatibility alias for existing imports
 */
export const CampaignPlugin = MultiCampaignPlugin;
export type CampaignPlugin = MultiCampaignPlugin;
