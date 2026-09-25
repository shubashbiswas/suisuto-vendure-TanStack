import {
    AvailableStock,
    ID,
    LocationWithQuantity,
    OrderLine,
    RequestContext,
    StockLevel,
    StockLocation,
    StockLocationStrategy,
} from '@vendure/core';

export class MultiHubStockLocationStrategy implements StockLocationStrategy {
    getAvailableStock(
        ctx: RequestContext,
        productVariantId: ID,
        stockLevels: StockLevel[],
    ): AvailableStock {
        const stockOnHand = stockLevels.reduce((sum, sl) => sum + sl.stockOnHand, 0);
        const stockAllocated = stockLevels.reduce((sum, sl) => sum + sl.stockAllocated, 0);
        return { stockOnHand, stockAllocated };
    }

    async forAllocation(
        ctx: RequestContext,
        stockLocations: StockLocation[],
        orderLine: OrderLine,
        quantity: number,
    ): Promise<LocationWithQuantity[]> {
        const product = orderLine.productVariant.product;
        const originHub = ((product?.customFields as any)?.originHub || '').trim().toLowerCase();

        let targetLocation: StockLocation | undefined;
        if (originHub) {
            // 1. Direct match by location customFields.hubCode (e.g. 'BD_HUB')
            targetLocation = stockLocations.find(l => {
                const code = (((l.customFields as any)?.hubCode || '') as string).trim().toLowerCase();
                return code === originHub || (code && originHub.startsWith(code));
            });

            // 2. Match by location name
            if (!targetLocation) {
                targetLocation = stockLocations.find(l => l.name.toLowerCase() === originHub);
            }

            // 3. Dynamic match by code or localized region name (e.g. originHub 'BD_HUB' matches 'Bangladesh Hub')
            if (!targetLocation) {
                const code = originHub.split('_')[0];
                let regionName = '';
                if (code.length === 2) {
                    try {
                        regionName = (new Intl.DisplayNames(['en'], { type: 'region' }).of(code.toUpperCase()) || '').toLowerCase();
                    } catch {}
                }
                targetLocation = stockLocations.find(l => {
                    const locName = l.name.toLowerCase();
                    return (
                        locName.includes(originHub) ||
                        locName.includes(code) ||
                        (regionName && locName.includes(regionName))
                    );
                });
            }
        }

        // Fallback to primary target or first available location
        const location = targetLocation || stockLocations[0];
        return [{ location, quantity }];
    }

    async forRelease(
        ctx: RequestContext,
        stockLocations: StockLocation[],
        orderLine: OrderLine,
        quantity: number,
    ): Promise<LocationWithQuantity[]> {
        return this.forAllocation(ctx, stockLocations, orderLine, quantity);
    }

    async forSale(
        ctx: RequestContext,
        stockLocations: StockLocation[],
        orderLine: OrderLine,
        quantity: number,
    ): Promise<LocationWithQuantity[]> {
        return this.forAllocation(ctx, stockLocations, orderLine, quantity);
    }

    async forCancellation(
        ctx: RequestContext,
        stockLocations: StockLocation[],
        orderLine: OrderLine,
        quantity: number,
    ): Promise<LocationWithQuantity[]> {
        return this.forAllocation(ctx, stockLocations, orderLine, quantity);
    }
}
