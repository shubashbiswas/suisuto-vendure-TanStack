import { Injectable } from '@nestjs/common';
import {
    CreateFulfillmentResult,
    Fulfillment,
    ID,
    isGraphQlErrorResult,
    Logger,
    Order,
    OrderLine,
    OrderService,
    RequestContext,
    StockLocation,
    StockLocationService,
    TransactionalConnection,
} from '@vendure/core';
import { HubGroupedLines } from '../types/multi-hub.types';
import {
    CARRIER_DELHIVERY,
    CARRIER_DHL_EXPRESS,
    CARRIER_PATHAO,
    LOGGER_CTX_FULFILLMENT,
} from '../constants/multi-hub.constants';

@Injectable()
export class MultiHubFulfillmentService {
    constructor(
        private connection: TransactionalConnection,
        private orderService: OrderService,
        private stockLocationService: StockLocationService,
    ) {}

    /**
     * Inspects an Order and returns all order lines grouped by their physical origin supply hub.
     */
    groupOrderLinesByHub(order: Order, locations: StockLocation[] = []): Map<string, HubGroupedLines> {
        const groups = new Map<string, HubGroupedLines>();

        for (const line of order.lines || []) {
            const rawOrigin = ((line.productVariant?.product?.customFields as any)?.originHub || '').trim().toUpperCase();
            const hubCode = rawOrigin || 'DEFAULT_HUB';

            // Resolve matching carrier from StockLocation custom fields if available
            const matchingLoc = locations.find(l => {
                const locCode = (((l.customFields as any)?.hubCode || '') as string).trim().toUpperCase();
                return locCode === hubCode || l.name.toUpperCase().includes(hubCode);
            });

            const carrier = ((matchingLoc?.customFields as any)?.domesticCarrier as string) ||
                matchingLoc?.name ||
                'Standard Logistics';

            if (!groups.has(hubCode)) {
                groups.set(hubCode, {
                    hubCode,
                    carrier,
                    lines: [],
                });
            }

            groups.get(hubCode)!.lines.push({
                orderLineId: line.id,
                quantity: line.quantity,
                line,
            });
        }

        return groups;
    }

    /**
     * Determines whether an order is a multi-hub split order.
     */
    isMultiHubOrder(order: Order): boolean {
        const groups = this.groupOrderLinesByHub(order);
        return groups.size > 1;
    }

    /**
     * Automatically splits and creates distinct Vendure Fulfillment records per supply hub for an Order.
     * Generates traceable tracking numbers: TRK-{HUB}-{ORDER_CODE}-{TIMESTAMP}
     */
    async splitFulfillOrder(ctx: RequestContext, orderId: ID): Promise<Fulfillment[]> {
        const order = await this.connection.getRepository(ctx, Order).findOne({
            where: { id: orderId },
            relations: [
                'lines',
                'lines.productVariant',
                'lines.productVariant.product',
                'fulfillments',
                'fulfillments.lines',
            ],
        });

        if (!order) {
            throw new Error(`Order with ID ${orderId} not found`);
        }

        if (order.state !== 'PaymentSettled' && order.state !== 'PartiallyShipped') {
            Logger.warn(
                `Order ${order.code} is in state ${order.state}. Automatic fulfillment split typically expects PaymentSettled or PartiallyShipped.`,
                LOGGER_CTX_FULFILLMENT
            );
        }

        const locations = (await this.stockLocationService.findAll(ctx)).items;
        const groups = this.groupOrderLinesByHub(order, locations);
        const fulfillments: Fulfillment[] = [];

        for (const [hubCode, group] of groups.entries()) {
            const trackingCode = `TRK-${hubCode}-${order.code}-${Date.now().toString().slice(-4)}`;
            const linesInput = group.lines.map(l => ({
                orderLineId: l.orderLineId,
                quantity: l.quantity,
            }));

            Logger.info(
                `Creating split fulfillment for order ${order.code}: Hub ${hubCode}, Handler: ${group.carrier}, Tracking: ${trackingCode}, Lines: ${linesInput.length}`,
                LOGGER_CTX_FULFILLMENT
            );

            try {
                const result = await this.orderService.createFulfillment(ctx, {
                    lines: linesInput,
                    handler: {
                        code: 'manual-fulfillment',
                        arguments: [
                            { name: 'method', value: group.carrier },
                            { name: 'trackingCode', value: trackingCode },
                        ],
                    },
                });

                if (isGraphQlErrorResult(result)) {
                    Logger.error(
                        `Failed to create fulfillment for Hub ${hubCode} on order ${order.code}: ${result.message}`,
                        LOGGER_CTX_FULFILLMENT
                    );
                    throw new Error(result.message);
                }

                fulfillments.push(result as Fulfillment);
            } catch (err: any) {
                Logger.error(
                    `Exception creating split fulfillment for Hub ${hubCode}: ${err.message}`,
                    LOGGER_CTX_FULFILLMENT
                );
                throw err;
            }
        }

        return fulfillments;
    }
}
