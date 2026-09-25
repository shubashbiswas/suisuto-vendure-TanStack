import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    Allow,
    Ctx,
    Fulfillment,
    ID,
    Order,
    OrderService,
    Permission,
    Product,
    ProductService,
    RequestContext,
    StockLocation,
    StockLocationService,
    TransactionalConnection,
} from '@vendure/core';
import { MultiHubFulfillmentService } from '../services/multi-hub-fulfillment.service';
import { FulfillmentHubDto } from '../types/multi-hub.types';
import {
    CARRIER_DELHIVERY,
    CARRIER_DHL_EXPRESS,
    CARRIER_PATHAO,
    HUB_CODE_BD,
    HUB_CODE_IN,
} from '../constants/multi-hub.constants';

@Resolver()
export class MultiHubAdminResolver {
    constructor(
        private connection: TransactionalConnection,
        private stockLocationService: StockLocationService,
        private productService: ProductService,
        private orderService: OrderService,
        private fulfillmentService: MultiHubFulfillmentService,
    ) {}

    @Query()
    @Allow(Permission.ReadStockLocation, Permission.ReadCatalog)
    async fulfillmentHubs(@Ctx() ctx: RequestContext): Promise<FulfillmentHubDto[]> {
        const locations = await this.stockLocationService.findAll(ctx);
        return locations.items.map(loc => {
            const cf = (loc.customFields as any) || {};
            const upperName = (loc.name || '').toUpperCase();

            const inferredHub = cf.hubCode || (loc.name ? loc.name.toUpperCase().replace(/[^A-Z0-9]/g, '_') : 'HUB');
            const inferredCountry = cf.countryCode || (inferredHub.split('_')[0]?.length === 2 ? inferredHub.split('_')[0] : '');
            const inferredDomesticCarrier = cf.domesticCarrier || 'Standard Domestic Courier';

            return {
                id: loc.id,
                name: loc.name,
                description: loc.description,
                hubCode: inferredHub,
                countryCode: inferredCountry,
                domesticCarrier: inferredDomesticCarrier,
                crossBorderCarrier: cf.crossBorderCarrier || CARRIER_DHL_EXPRESS,
                standardTransitDays: cf.standardTransitDays ?? 3,
            };
        });
    }

    @Query()
    @Allow(Permission.ReadOrder)
    async multiHubOrders(
        @Ctx() ctx: RequestContext,
        @Args('take', { nullable: true }) take?: number,
        @Args('skip', { nullable: true }) skip?: number,
    ) {
        const orders = await this.orderService.findAll(ctx, {
            take: take ?? 50,
            skip: skip ?? 0,
            filter: {
                active: { eq: false },
            },
        });

        // Filter and augment with multiHub metadata
        const multiHubItems = orders.items.filter(order => this.fulfillmentService.isMultiHubOrder(order));

        return {
            items: multiHubItems,
            totalItems: multiHubItems.length,
        };
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async updateProductOriginHub(
        @Ctx() ctx: RequestContext,
        @Args('productId') productId: ID,
        @Args('originHub') originHub: string,
    ): Promise<Product> {
        return this.productService.update(ctx, {
            id: productId,
            customFields: { originHub },
        });
    }

    @Mutation()
    @Allow(Permission.UpdateOrder)
    async splitFulfillOrder(
        @Ctx() ctx: RequestContext,
        @Args('orderId') orderId: ID,
    ): Promise<Fulfillment[]> {
        return this.fulfillmentService.splitFulfillOrder(ctx, orderId);
    }
}
