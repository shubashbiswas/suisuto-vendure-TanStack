import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { gql } from 'graphql-tag';
import { MultiHubStockLocationStrategy } from './strategies/multi-hub-stock-location.strategy';
import { MultiHubService } from './services/multi-hub.service';
import { MultiHubShopResolver } from './resolvers/multi-hub-shop.resolver';
import {
    multiHubShippingEligibilityChecker,
    multiHubShippingCalculator,
} from './shipping/multi-hub-shipping';
import { MultiHubFulfillmentService } from './services/multi-hub-fulfillment.service';
import { MultiHubAdminResolver } from './resolvers/multi-hub-admin.resolver';

const shopApiExtensions = gql`
    type AvailableMarket {
        id: ID!
        code: String!
        token: String!
        name: String!
        currencyCode: String!
        availableCurrencyCodes: [String!]!
        defaultLanguageCode: String!
        availableLanguageCodes: [String!]!
        pricesIncludeTax: Boolean!
    }

    extend type Query {
        availableMarkets: [AvailableMarket!]!
    }
`;

const adminApiExtensions = gql`
    type FulfillmentHub {
        id: ID!
        name: String!
        description: String
        hubCode: String
        countryCode: String
        domesticCarrier: String
        crossBorderCarrier: String
        standardTransitDays: Int
    }

    extend type Query {
        fulfillmentHubs: [FulfillmentHub!]!
        multiHubOrders(take: Int, skip: Int): OrderList!
    }

    extend type Mutation {
        updateProductOriginHub(productId: ID!, originHub: String!): Product!
        splitFulfillOrder(orderId: ID!): [Fulfillment!]!
    }
`;

@VendurePlugin({
    compatibility: '^3.0.0',
    imports: [PluginCommonModule],
    providers: [MultiHubService, MultiHubFulfillmentService],
    shopApiExtensions: {
        schema: shopApiExtensions,
        resolvers: [MultiHubShopResolver],
    },
    adminApiExtensions: {
        schema: adminApiExtensions,
        resolvers: [MultiHubAdminResolver],
    },
    configuration: config => {
        config.catalogOptions.stockLocationStrategy = new MultiHubStockLocationStrategy();
        config.shippingOptions.shippingEligibilityCheckers = [
            ...(config.shippingOptions.shippingEligibilityCheckers || []),
            multiHubShippingEligibilityChecker,
        ];
        config.shippingOptions.shippingCalculators = [
            ...(config.shippingOptions.shippingCalculators || []),
            multiHubShippingCalculator,
        ];
        return config;
    },
    dashboard: './dashboard',
})
export class MultiHubPlugin {}
