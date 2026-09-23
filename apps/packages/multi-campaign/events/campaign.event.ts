import { RequestContext, VendureEvent } from '@vendure/core';
import { Campaign } from '../entities/campaign.entity';

export type CampaignAction = 'created' | 'updated' | 'deleted';

/**
 * @description
 * An event that is published whenever a Campaign is created, updated, or deleted.
 */
export class CampaignEvent extends VendureEvent {
    constructor(
        public ctx: RequestContext,
        public campaign: Campaign,
        public action: CampaignAction
    ) {
        super();
    }
}
