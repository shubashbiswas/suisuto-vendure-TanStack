import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { Campaign } from '../entities/campaign.entity';
import { CampaignService } from '../services/campaign.service';
import { CampaignEvent } from '../events/campaign.event';
import { DeletionResult } from '../types/campaign.types';
import { RequestContext, UserInputError } from '@vendure/core';

// Mock TransactionalConnection
class MockConnection {
    constructor(public campaigns: Campaign[]) {}

    getRepository(_ctx: any, _entity: any) {
        return {
            find: async (options?: any) => {
                if (options?.where?.id) {
                    return this.campaigns.filter(c => c.id === options.where.id);
                }
                return [...this.campaigns];
            },
            findOne: async (options: any) => {
                if (options?.where?.id) {
                    return this.campaigns.find(c => String(c.id) === String(options.where.id)) || null;
                }
                if (options?.where?.market !== undefined && options?.where?.slug !== undefined) {
                    return (
                        this.campaigns.find(
                            c =>
                                c.market.toLowerCase() === options.where.market.toLowerCase() &&
                                c.slug.toLowerCase() === options.where.slug.toLowerCase()
                        ) || null
                    );
                }
                return null;
            },
            count: async () => this.campaigns.length,
            save: async (entity: Campaign) => {
                const existingIndex = this.campaigns.findIndex(
                    c => String(c.id) === String(entity.id) ||
                         (c.market.toLowerCase() === entity.market?.toLowerCase() &&
                          c.slug.toLowerCase() === entity.slug?.toLowerCase())
                );
                if (existingIndex >= 0) {
                    this.campaigns[existingIndex] = entity;
                } else {
                    (entity as any).id = (this.campaigns.length + 1).toString();
                    (entity as any).createdAt = new Date();
                    (entity as any).updatedAt = new Date();
                    this.campaigns.push(entity);
                }
                return entity;
            },
            remove: async (entity: Campaign) => {
                const idx = this.campaigns.findIndex(c => String(c.id) === String(entity.id));
                if (idx >= 0) {
                    this.campaigns.splice(idx, 1);
                }
                return entity;
            },
            createQueryBuilder: (_alias: string) => {
                let items = [...this.campaigns];
                const qb = {
                    where: (expr: string, params: any) => {
                        if (params?.market) {
                            items = items.filter(c => c.market.toLowerCase() === params.market.toLowerCase());
                        }
                        return qb;
                    },
                    andWhere: (expr: string, params: any) => {
                        if (params?.status) {
                            items = items.filter(c => c.status === params.status);
                        }
                        if (params?.now) {
                            const now = params.now as Date;
                            if (expr.includes('startAt')) {
                                items = items.filter(c => !c.startAt || new Date(c.startAt) <= now);
                            }
                            if (expr.includes('endAt')) {
                                items = items.filter(c => !c.endAt || new Date(c.endAt) >= now);
                            }
                        }
                        if (params?.market) {
                            items = items.filter(c => c.market.toLowerCase() === params.market.toLowerCase());
                        }
                        return qb;
                    },
                    orderBy: (field: string, dir: 'ASC' | 'DESC' = 'ASC') => {
                        items.sort((a: any, b: any) => {
                            const key = field.replace('campaign.', '');
                            const valA = a[key] ?? 0;
                            const valB = b[key] ?? 0;
                            return dir === 'DESC' ? (valB > valA ? 1 : -1) : (valA > valB ? 1 : -1);
                        });
                        return qb;
                    },
                    addOrderBy: (field: string, dir: 'ASC' | 'DESC' = 'ASC') => {
                        return qb;
                    },
                    getMany: async () => items,
                };
                return qb;
            },
        };
    }

    get rawConnection() {
        return {
            getRepository: (entity: any) => this.getRepository(null, entity),
        };
    }
}

// Mock EventBus
class MockEventBus {
    public publishedEvents: any[] = [];

    publish(event: any) {
        this.publishedEvents.push(event);
    }
}

const mockCtx = {} as RequestContext;

describe('MultiCampaignPlugin Test Suite', () => {
    it('1. Filters active campaigns by time window and status', async () => {
        const now = new Date();
        const past = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const future = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const expired = new Date(now.getTime() - 48 * 60 * 60 * 1000);

        const campaigns: Campaign[] = [
            Object.assign(new Campaign(), {
                id: '1',
                market: 'in',
                name: 'Active Diwali',
                slug: 'diwali',
                status: 'active',
                priority: 10,
                startAt: past,
                endAt: future,
            }),
            Object.assign(new Campaign(), {
                id: '2',
                market: 'in',
                name: 'Expired Holi',
                slug: 'holi',
                status: 'active',
                priority: 5,
                startAt: expired,
                endAt: past,
            }),
            Object.assign(new Campaign(), {
                id: '3',
                market: 'in',
                name: 'Future Durga Puja',
                slug: 'durga-puja',
                status: 'active',
                priority: 5,
                startAt: future,
                endAt: new Date(future.getTime() + 10000),
            }),
            Object.assign(new Campaign(), {
                id: '4',
                market: 'in',
                name: 'Draft Navratri',
                slug: 'navratri',
                status: 'draft',
                priority: 20,
                startAt: past,
                endAt: future,
            }),
        ];

        const mockConn = new MockConnection(campaigns);
        const mockBus = new MockEventBus();
        const service = new CampaignService(mockConn as any, mockBus as any);

        const active = await service.findActive(mockCtx, 'in');
        assert.strictEqual(active.length, 1);
        assert.strictEqual(active[0].slug, 'diwali');
    });

    it('2. Orders active campaigns by priority descending', async () => {
        const now = new Date();
        const past = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const future = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const campaigns: Campaign[] = [
            Object.assign(new Campaign(), {
                id: '1',
                market: 'in',
                name: 'Standard Festive',
                slug: 'standard',
                status: 'active',
                priority: 5,
                startAt: past,
                endAt: future,
            }),
            Object.assign(new Campaign(), {
                id: '2',
                market: 'in',
                name: 'VIP Festive',
                slug: 'vip',
                status: 'active',
                priority: 50,
                startAt: past,
                endAt: future,
            }),
        ];

        const mockConn = new MockConnection(campaigns);
        const service = new CampaignService(mockConn as any);

        const active = await service.findActive(mockCtx, 'in');
        assert.strictEqual(active.length, 2);
        assert.strictEqual(active[0].slug, 'vip');
        assert.strictEqual(active[1].slug, 'standard');
    });

    it('3. Validates slug format and normalizes case/trimming', async () => {
        const mockConn = new MockConnection([]);
        const mockBus = new MockEventBus();
        const service = new CampaignService(mockConn as any, mockBus as any);

        // Valid slug
        const created = await service.create(mockCtx, {
            market: 'IN',
            name: 'Diwali Festive',
            slug: '  diwali-2026  ',
            status: 'active',
        });
        assert.strictEqual(created.slug, 'diwali-2026');
        assert.strictEqual(created.market, 'in');

        // Invalid slug with spaces
        await assert.rejects(
            async () => {
                await service.create(mockCtx, {
                    market: 'in',
                    name: 'Invalid',
                    slug: 'bad slug',
                });
            },
            (err: any) => err instanceof UserInputError && err.message.includes('Invalid campaign slug')
        );

        // Invalid slug with special characters
        await assert.rejects(
            async () => {
                await service.create(mockCtx, {
                    market: 'in',
                    name: 'Invalid',
                    slug: 'bad$lug!',
                });
            },
            (err: any) => err instanceof UserInputError && err.message.includes('Invalid campaign slug')
        );
    });

    it('4. Rejects duplicate slug in same market but allows across different markets', async () => {
        const mockConn = new MockConnection([
            Object.assign(new Campaign(), {
                id: '1',
                market: 'in',
                slug: 'festive',
                name: 'India Festive',
            }),
        ]);
        const service = new CampaignService(mockConn as any);

        // Duplicate in 'in' market
        await assert.rejects(
            async () => {
                await service.create(mockCtx, {
                    market: 'in',
                    name: 'Duplicate India Festive',
                    slug: 'festive',
                });
            },
            (err: any) => err instanceof UserInputError && err.message.includes('already exists in market "in"')
        );

        // Same slug in 'bd' market is allowed
        const bdCampaign = await service.create(mockCtx, {
            market: 'bd',
            name: 'Bangladesh Festive',
            slug: 'festive',
        });
        assert.strictEqual(bdCampaign.market, 'bd');
        assert.strictEqual(bdCampaign.slug, 'festive');
    });

    it('5. Validates startAt <= endAt date boundaries', async () => {
        const mockConn = new MockConnection([]);
        const service = new CampaignService(mockConn as any);

        const now = new Date();
        const past = new Date(now.getTime() - 10000);
        const future = new Date(now.getTime() + 10000);

        // startAt > endAt should fail
        await assert.rejects(
            async () => {
                await service.create(mockCtx, {
                    market: 'in',
                    name: 'Invalid Dates',
                    slug: 'invalid-dates',
                    startAt: future,
                    endAt: past,
                });
            },
            (err: any) => err instanceof UserInputError && err.message.includes('startAt date must be before or equal to endAt')
        );
    });

    it('6. Emits CampaignEvent on create, update, and delete', async () => {
        const mockConn = new MockConnection([]);
        const mockBus = new MockEventBus();
        const service = new CampaignService(mockConn as any, mockBus as any);

        // Create
        const created = await service.create(mockCtx, {
            market: 'in',
            name: 'Event Test',
            slug: 'event-test',
            status: 'draft',
        });
        assert.strictEqual(mockBus.publishedEvents.length, 1);
        assert.ok(mockBus.publishedEvents[0] instanceof CampaignEvent);
        assert.strictEqual(mockBus.publishedEvents[0].action, 'created');
        assert.strictEqual(mockBus.publishedEvents[0].campaign.slug, 'event-test');

        // Update
        await service.update(mockCtx, {
            id: created.id,
            status: 'active',
            priority: 15,
        });
        assert.strictEqual(mockBus.publishedEvents.length, 2);
        assert.strictEqual(mockBus.publishedEvents[1].action, 'updated');
        assert.strictEqual(mockBus.publishedEvents[1].campaign.status, 'active');

        // Delete
        const delRes = await service.delete(mockCtx, created.id);
        assert.strictEqual(delRes.result, DeletionResult.DELETED);
        assert.strictEqual(mockBus.publishedEvents.length, 3);
        assert.strictEqual(mockBus.publishedEvents[2].action, 'deleted');
    });
});
