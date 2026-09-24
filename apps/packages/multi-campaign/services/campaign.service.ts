import fs from 'fs';
import path from 'path';
import { Injectable, OnApplicationBootstrap, Optional } from '@nestjs/common';
import {
    EventBus,
    ID,
    Logger,
    RequestContext,
    TransactionalConnection,
    UserInputError,
} from '@vendure/core';
import { Campaign } from '../entities/campaign.entity';
import { CampaignEvent } from '../events/campaign.event';
import {
    CampaignFilterOptions,
    CampaignPluginStatus,
    CreateCampaignInput,
    DeletionResponse,
    DeletionResult,
    UpdateCampaignInput,
} from '../types/campaign.types';
import {
    CAMPAIGN_PLUGIN_LOGGER_CONTEXT,
    SLUG_REGEX,
} from '../constants/campaign.constants';

@Injectable()
export class CampaignService implements OnApplicationBootstrap {
    private isPluginEnabled = true;

    constructor(
        private connection: TransactionalConnection,
        @Optional() private eventBus?: EventBus,
    ) {}

    async onApplicationBootstrap() {
        this.isPluginEnabled = this.loadPluginStatus();
        try {
            await this.seedInitialCampaigns();
        } catch (err: any) {
            Logger.warn(`Campaign initial seed skipped: ${err?.message}`, CAMPAIGN_PLUGIN_LOGGER_CONTEXT);
        }
    }

    private getSettingsFilePath(): string {
        return path.join(process.cwd(), 'campaign-plugin-status.json');
    }

    private loadPluginStatus(): boolean {
        try {
            const filePath = this.getSettingsFilePath();
            if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                if (typeof data.enabled === 'boolean') {
                    return data.enabled;
                }
            }
        } catch {
            // default to true
        }
        return true;
    }

    private savePluginStatus(enabled: boolean): void {
        try {
            const filePath = this.getSettingsFilePath();
            fs.writeFileSync(
                filePath,
                JSON.stringify({ enabled, updatedAt: new Date().toISOString() }, null, 2),
                'utf-8'
            );
        } catch (err) {
            Logger.warn(`Failed to persist campaign plugin status: ${err}`, CAMPAIGN_PLUGIN_LOGGER_CONTEXT);
        }
    }

    getPluginStatus(): CampaignPluginStatus {
        return { enabled: this.isPluginEnabled };
    }

    setPluginStatus(enabled: boolean): CampaignPluginStatus {
        this.isPluginEnabled = enabled;
        this.savePluginStatus(enabled);
        Logger.info(
            `Campaign plugin master switch set to: ${enabled ? 'ENABLED' : 'DISABLED'}`,
            CAMPAIGN_PLUGIN_LOGGER_CONTEXT
        );
        if (this.eventBus) {
            const dummyCampaign = new Campaign();
            dummyCampaign.market = 'global';
            dummyCampaign.slug = 'all';
            this.eventBus.publish(new CampaignEvent(RequestContext.empty(), dummyCampaign, 'updated'));
        }
        return { enabled: this.isPluginEnabled };
    }

    private async seedInitialCampaigns() {
        const repo = this.connection.rawConnection.getRepository(Campaign);
        const count = await repo.count();
        if (count > 0) return;

        const now = new Date();
        const past = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const future = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        // India Diwali Campaign
        const diwali = new Campaign();
        Object.assign(diwali, {
            market: 'in',
            name: 'Diwali 2026 Festive Collection',
            slug: 'diwali',
            status: 'active',
            priority: 10,
            startAt: past,
            endAt: future,
            heroImageUrl: '/images/hero-campaign.jpg',
            heroHeadline: 'Light, Loom & Lineage',
            heroSubHeadline: 'Celebrating the Festival of Lights with master-crafted Banarasi silks and festive brocades.',
            heroCtaLabel: 'Explore Festive Collection',
            heroCtaHref: '/in/campaign/diwali',
            heroTag: 'Diwali 2026 Exclusive',
            promotionCode: 'DIWALI20',
            homepageSections: [
                { type: 'hero' },
                { type: 'countdown', props: { headline: 'Diwali Exclusive Window' } },
                { type: 'campaign-banner' },
                { type: 'featured-collection', props: { collectionSlug: 'atelier', title: 'Festive Silk Edit' } },
                { type: 'artisan-story' },
                { type: 'newsletter' },
            ],
            banners: [
                {
                    imageUrl: '/images/hero-campaign.jpg',
                    headline: 'Heirloom Banarasi Silk Brocades',
                    href: '/in/campaign/diwali/offers',
                },
            ],
            landingPages: [
                {
                    subSlug: 'offers',
                    title: 'Exclusive Diwali Privileges',
                    sections: [
                        { type: 'countdown' },
                        { type: 'featured-collection', props: { collectionSlug: 'atelier', title: 'Diwali Exclusives' } },
                    ],
                    seoTitle: 'Diwali 2026 Special Offers | Suisuto India',
                    seoDescription: 'Discover festive privileges on heirloom handloom sarees and kurtas.',
                },
            ],
            seoTitle: 'Diwali 2026 Luxury Collection | Suisuto India',
            seoDescription: 'Handcrafted festive handloom garments for Diwali.',
        });

        // Bangladesh Eid Campaign
        const eid = new Campaign();
        Object.assign(eid, {
            market: 'bd',
            name: 'Eid 2026 Jamdani Edit',
            slug: 'eid',
            status: 'active',
            priority: 10,
            startAt: past,
            endAt: future,
            heroImageUrl: '/images/hero-campaign.jpg',
            heroHeadline: 'Royal Dhakai Jamdani Showcase',
            heroSubHeadline: 'Generational master-weavers of Narayanganj bring heirloom cotton and silk muslins to Eid 2026.',
            heroCtaLabel: 'Discover Heritage Weaves',
            heroCtaHref: '/bd/campaign/eid',
            heroTag: 'Eid 2026 Heritage Edit',
            promotionCode: 'EID2026',
            homepageSections: [
                { type: 'hero' },
                { type: 'countdown', props: { headline: 'Eid Loom Drop Window' } },
                { type: 'featured-collection', props: { collectionSlug: 'atelier', title: 'Dhakai Muslin Edit' } },
                { type: 'newsletter' },
            ],
            seoTitle: 'Eid 2026 Jamdani Edit | Suisuto Bangladesh',
            seoDescription: 'Authentic royal Dhakai Jamdani for Eid celebration.',
        });

        await repo.save([diwali, eid]);
    }

    async findAll(
        ctx: RequestContext,
        options?: CampaignFilterOptions
    ): Promise<Campaign[]> {
        const qb = this.connection.getRepository(ctx, Campaign).createQueryBuilder('campaign');

        if (options?.market) {
            qb.andWhere('LOWER(campaign.market) = :market', {
                market: options.market.toLowerCase().trim(),
            });
        }
        if (options?.status) {
            qb.andWhere('campaign.status = :status', { status: options.status });
        }

        qb.orderBy('campaign.priority', 'DESC')
            .addOrderBy('campaign.createdAt', 'DESC');
        return qb.getMany();
    }

    async findActive(ctx: RequestContext, market: string): Promise<Campaign[]> {
        if (!this.isPluginEnabled) {
            return [];
        }
        const normalizedMarket = (market || 'global').toLowerCase().trim();
        const now = new Date();

        const qb = this.connection.getRepository(ctx, Campaign).createQueryBuilder('campaign');
        qb.where('LOWER(campaign.market) = :market', { market: normalizedMarket })
            .andWhere('campaign.status = :status', { status: 'active' })
            .andWhere('(campaign.startAt IS NULL OR campaign.startAt <= :now)', { now })
            .andWhere('(campaign.endAt IS NULL OR campaign.endAt >= :now)', { now })
            .orderBy('campaign.priority', 'DESC')
            .addOrderBy('campaign.startAt', 'DESC', 'NULLS LAST')
            .addOrderBy('campaign.createdAt', 'DESC');

        return qb.getMany();
    }

    async findBySlug(ctx: RequestContext, market: string, slug: string): Promise<Campaign | null> {
        if (!this.isPluginEnabled) {
            return null;
        }
        const normalizedMarket = (market || 'global').toLowerCase().trim();
        const normalizedSlug = (slug || '').toLowerCase().trim();

        const campaign = await this.connection.getRepository(ctx, Campaign).findOne({
            where: {
                market: normalizedMarket,
                slug: normalizedSlug,
            },
        });

        return campaign || null;
    }

    async findOne(ctx: RequestContext, id: ID): Promise<Campaign | null> {
        return this.connection.getRepository(ctx, Campaign).findOne({
            where: { id },
        });
    }

    private validateSlug(slug: string): string {
        const normalized = (slug || '').toLowerCase().trim();
        if (!normalized) {
            throw new UserInputError('Campaign slug cannot be empty');
        }
        if (!SLUG_REGEX.test(normalized)) {
            throw new UserInputError(
                `Invalid campaign slug "${slug}". Slugs must contain only lowercase letters, numbers, and hyphens.`
            );
        }
        return normalized;
    }

    private validateDates(startAt?: Date | string | null, endAt?: Date | string | null) {
        if (startAt && endAt) {
            const start = new Date(startAt);
            const end = new Date(endAt);
            if (start > end) {
                throw new UserInputError('Campaign startAt date must be before or equal to endAt date');
            }
        }
    }

    async create(ctx: RequestContext, input: CreateCampaignInput): Promise<Campaign> {
        const market = (input.market || 'global').toLowerCase().trim();
        const slug = this.validateSlug(input.slug || '');
        this.validateDates(input.startAt, input.endAt);

        const existing = await this.findBySlug(ctx, market, slug);
        if (existing) {
            throw new UserInputError(
                `A campaign with slug "${slug}" already exists in market "${market}"`
            );
        }

        const campaign = new Campaign();
        Object.assign(campaign, {
            ...input,
            market,
            slug,
            priority: typeof input.priority === 'number' ? input.priority : 0,
            status: input.status || 'draft',
        });

        const saved = await this.connection.getRepository(ctx, Campaign).save(campaign);
        if (this.eventBus) {
            this.eventBus.publish(new CampaignEvent(ctx, saved, 'created'));
        }
        return saved;
    }

    async update(ctx: RequestContext, input: UpdateCampaignInput): Promise<Campaign> {
        const campaign = await this.findOne(ctx, input.id);
        if (!campaign) {
            throw new UserInputError(`Campaign with id ${input.id} not found`);
        }

        const { id, ...updates } = input;
        if (updates.market) {
            updates.market = updates.market.toLowerCase().trim();
        }
        if (updates.slug !== undefined) {
            updates.slug = this.validateSlug(updates.slug);
        }

        const targetMarket = updates.market || campaign.market;
        const targetSlug = updates.slug || campaign.slug;
        if (targetMarket !== campaign.market || targetSlug !== campaign.slug) {
            const existing = await this.findBySlug(ctx, targetMarket, targetSlug);
            if (existing && String(existing.id) !== String(campaign.id)) {
                throw new UserInputError(
                    `A campaign with slug "${targetSlug}" already exists in market "${targetMarket}"`
                );
            }
        }

        const effectiveStart = updates.startAt !== undefined ? updates.startAt : campaign.startAt;
        const effectiveEnd = updates.endAt !== undefined ? updates.endAt : campaign.endAt;
        this.validateDates(effectiveStart, effectiveEnd);

        Object.assign(campaign, updates);
        const saved = await this.connection.getRepository(ctx, Campaign).save(campaign);
        if (this.eventBus) {
            this.eventBus.publish(new CampaignEvent(ctx, saved, 'updated'));
        }
        return saved;
    }

    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const campaign = await this.findOne(ctx, id);
        if (!campaign) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: `Campaign with id ${id} not found`,
            };
        }

        await this.connection.getRepository(ctx, Campaign).remove(campaign);
        if (this.eventBus) {
            this.eventBus.publish(new CampaignEvent(ctx, campaign, 'deleted'));
        }
        return {
            result: DeletionResult.DELETED,
            message: `Campaign ${id} deleted successfully`,
        };
    }
}
