import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import {
    MultiHubStockLocationStrategy,
    multiHubShippingEligibilityChecker,
    multiHubShippingCalculator,
    MultiHubFulfillmentService,
} from '../index';

describe('Multi-Hub Plugin Test Suite', () => {

    const mockLocations: any[] = [
        {
            id: '1',
            name: 'Bangladesh Hub',
            customFields: {
                hubCode: 'BD_HUB',
                countryCode: 'BD',
                domesticCarrier: 'Pathao',
                crossBorderCarrier: 'DHL Express',
                standardTransitDays: 2,
            },
        },
        {
            id: '2',
            name: 'India Hub',
            customFields: {
                hubCode: 'IN_HUB',
                countryCode: 'IN',
                domesticCarrier: 'Delhivery',
                crossBorderCarrier: 'DHL Express',
                standardTransitDays: 3,
            },
        },
        {
            id: '3',
            name: 'Global Dual Hub',
            customFields: {
                hubCode: 'DUAL_HUB',
                countryCode: 'US',
                domesticCarrier: 'FedEx',
                crossBorderCarrier: 'DHL Express',
                standardTransitDays: 5,
            },
        },
    ];

    describe('1. MultiHubStockLocationStrategy Allocation', () => {
        const strategy = new MultiHubStockLocationStrategy();
        const mockCtx: any = {};

        it('allocates to stock location matching customFields.hubCode', async () => {
            const orderLine: any = {
                productVariant: {
                    product: {
                        customFields: { originHub: 'BD_HUB' },
                    },
                },
            };

            const result = await strategy.forAllocation(mockCtx, mockLocations, orderLine, 2);
            assert.equal(result.length, 1);
            assert.equal(result[0].location.id, '1');
            assert.equal(result[0].quantity, 2);
        });

        it('allocates to stock location matching location name', async () => {
            const locationsWithoutCodes: any[] = [
                { id: 'loc-bd', name: 'Bangladesh Hub', customFields: {} },
                { id: 'loc-in', name: 'India Hub', customFields: {} },
            ];
            const orderLine: any = {
                productVariant: {
                    product: {
                        customFields: { originHub: 'bangladesh hub' },
                    },
                },
            };

            const result = await strategy.forAllocation(mockCtx, locationsWithoutCodes, orderLine, 1);
            assert.equal(result.length, 1);
            assert.equal(result[0].location.id, 'loc-bd');
        });

        it('allocates by country code prefix (e.g. IN_HUB matching India Hub)', async () => {
            const locationsWithoutCodes: any[] = [
                { id: 'loc-bd', name: 'Bangladesh Hub', customFields: {} },
                { id: 'loc-in', name: 'India Hub', customFields: {} },
            ];
            const orderLine: any = {
                productVariant: {
                    product: {
                        customFields: { originHub: 'IN_HUB' },
                    },
                },
            };

            const result = await strategy.forAllocation(mockCtx, locationsWithoutCodes, orderLine, 3);
            assert.equal(result.length, 1);
            assert.equal(result[0].location.id, 'loc-in');
        });

        it('falls back safely to primary location if originHub is unassigned', async () => {
            const orderLine: any = {
                productVariant: {
                    product: {
                        customFields: {},
                    },
                },
            };

            const result = await strategy.forAllocation(mockCtx, mockLocations, orderLine, 1);
            assert.equal(result.length, 1);
            assert.equal(result[0].location.id, '1'); // first in list
        });

        it('calculates available stock on hand minus allocated', () => {
            const stockLevels: any[] = [
                { stockOnHand: 15, stockAllocated: 5 },
                { stockOnHand: 30, stockAllocated: 10 },
            ];
            const available = strategy.getAvailableStock(mockCtx, 'variant-1', stockLevels);
            assert.equal(available.stockOnHand, 45);
            assert.equal(available.stockAllocated, 15);
        });
    });

    describe('2. Multi-Hub Shipping Eligibility Checker', () => {
        const checker = multiHubShippingEligibilityChecker as any;
        const mockCtx: any = {};

        it('allows all orders when allowedRegion is "ALL"', () => {
            const order: any = { shippingAddress: { countryCode: 'FR' } };
            const eligible = checker.checkFn(mockCtx, order, { allowedRegion: 'ALL' });
            assert.strictEqual(eligible, true);
        });

        it('allows order when destination matches allowedRegion exactly', () => {
            const order: any = { shippingAddress: { countryCode: 'BD' } };
            const eligible = checker.checkFn(mockCtx, order, { allowedRegion: 'BD' });
            assert.strictEqual(eligible, true);
        });

        it('rejects order when destination does not match allowedRegion', () => {
            const order: any = { shippingAddress: { countryCode: 'US' } };
            const eligible = checker.checkFn(mockCtx, order, { allowedRegion: 'IN' });
            assert.strictEqual(eligible, false);
        });

        it('passes check if shippingAddress is not yet entered during checkout', () => {
            const order: any = { shippingAddress: null };
            const eligible = checker.checkFn(mockCtx, order, { allowedRegion: 'BD' });
            assert.strictEqual(eligible, true);
        });
    });

    describe('3. Multi-Hub Split Shipping Calculator', () => {
        const calculator = multiHubShippingCalculator as any;
        const mockCtx: any = { channel: { pricesIncludeTax: false } };
        const rates = { domesticRate: 120, internationalRatePerHub: 2500 };

        it('charges domestic flat rate for single-hub domestic delivery (BD to BD)', () => {
            const order: any = {
                shippingAddress: { countryCode: 'BD' },
                lines: [
                    { productVariant: { product: { customFields: { originHub: 'BD_HUB' } } } },
                    { productVariant: { product: { customFields: { originHub: 'BD_HUB' } } } },
                ],
            };

            const quote = calculator.calculateFn(mockCtx, order, rates);
            assert.equal(quote.price, 120);
        });

        it('charges domestic flat rate for single-hub domestic delivery (IN to IN)', () => {
            const order: any = {
                shippingAddress: { countryCode: 'IN' },
                lines: [
                    { productVariant: { product: { customFields: { originHub: 'IN_HUB' } } } },
                ],
            };

            const quote = calculator.calculateFn(mockCtx, order, rates);
            assert.equal(quote.price, 120);
        });

        it('charges single international rate when 1 hub ships to cross-border destination (BD to US)', () => {
            const order: any = {
                shippingAddress: { countryCode: 'US' },
                lines: [
                    { productVariant: { product: { customFields: { originHub: 'BD_HUB' } } } },
                ],
            };

            const quote = calculator.calculateFn(mockCtx, order, rates);
            assert.equal(quote.price, 2500); // 1 hub * 2500
        });

        it('charges 2x international rate for dual-hub split shipment (BD + IN to US)', () => {
            const order: any = {
                shippingAddress: { countryCode: 'US' },
                lines: [
                    { productVariant: { product: { customFields: { originHub: 'BD_HUB' } } } },
                    { productVariant: { product: { customFields: { originHub: 'IN_HUB' } } } },
                ],
            };

            const quote = calculator.calculateFn(mockCtx, order, rates);
            assert.equal(quote.price, 5000); // 2 distinct hubs * 2500 = 5000
        });

        it('charges 3x international rate for 3 distinct origin hubs in a global cart', () => {
            const order: any = {
                shippingAddress: { countryCode: 'GB' },
                lines: [
                    { productVariant: { product: { customFields: { originHub: 'BD_HUB' } } } },
                    { productVariant: { product: { customFields: { originHub: 'IN_HUB' } } } },
                    { productVariant: { product: { customFields: { originHub: 'AE_HUB' } } } },
                ],
            };

            const quote = calculator.calculateFn(mockCtx, order, rates);
            assert.equal(quote.price, 7500); // 3 hubs * 2500 = 7500
        });

        it('handles fallback when line item originHub is undefined', () => {
            const order: any = {
                shippingAddress: { countryCode: 'US' },
                lines: [
                    { productVariant: { product: { customFields: {} } } },
                ],
            };

            const quote = calculator.calculateFn(mockCtx, order, rates);
            assert.equal(quote.price, 2500); // at least 1 hub default
        });
    });

    describe('4. Multi-Hub Fulfillment Service & Order Splitting', () => {
        const mockConn: any = {};
        const mockOrderService: any = {};
        const mockLocationService: any = {};
        const service = new MultiHubFulfillmentService(mockConn, mockOrderService, mockLocationService);

        it('detects isMultiHubOrder correctly', () => {
            const singleHubOrder: any = {
                lines: [
                    { productVariant: { product: { customFields: { originHub: 'BD_HUB' } } } },
                    { productVariant: { product: { customFields: { originHub: 'BD_HUB' } } } },
                ],
            };
            assert.strictEqual(service.isMultiHubOrder(singleHubOrder), false);

            const multiHubOrder: any = {
                lines: [
                    { productVariant: { product: { customFields: { originHub: 'BD_HUB' } } } },
                    { productVariant: { product: { customFields: { originHub: 'IN_HUB' } } } },
                ],
            };
            assert.strictEqual(service.isMultiHubOrder(multiHubOrder), true);
        });

        it('groups order lines by hub and assigns associated carriers', () => {
            const order: any = {
                lines: [
                    { id: 'line-1', quantity: 2, productVariant: { product: { customFields: { originHub: 'BD_HUB' } } } },
                    { id: 'line-2', quantity: 1, productVariant: { product: { customFields: { originHub: 'BD_HUB' } } } },
                    { id: 'line-3', quantity: 1, productVariant: { product: { customFields: { originHub: 'IN_HUB' } } } },
                ],
            };

            const grouped = service.groupOrderLinesByHub(order, mockLocations);
            assert.equal(grouped.size, 2);

            const bdGroup = grouped.get('BD_HUB');
            assert.ok(bdGroup);
            assert.equal(bdGroup.carrier, 'Pathao');
            assert.equal(bdGroup.lines.length, 2);
            assert.equal(bdGroup.lines[0].orderLineId, 'line-1');
            assert.equal(bdGroup.lines[1].orderLineId, 'line-2');

            const inGroup = grouped.get('IN_HUB');
            assert.ok(inGroup);
            assert.equal(inGroup.carrier, 'Delhivery');
            assert.equal(inGroup.lines.length, 1);
            assert.equal(inGroup.lines[0].orderLineId, 'line-3');
        });
    });
});
