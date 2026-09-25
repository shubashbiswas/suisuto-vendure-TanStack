import { ID, OrderLine } from '@vendure/core';

export interface FulfillmentHubDto {
    id: ID;
    name: string;
    description?: string;
    hubCode?: string;
    countryCode?: string;
    domesticCarrier?: string;
    crossBorderCarrier?: string;
    standardTransitDays?: number;
}

export interface HubGroupedLines {
    hubCode: string;
    carrier: string;
    lines: Array<{
        orderLineId: ID;
        quantity: number;
        line: OrderLine;
    }>;
}

export interface AvailableMarketDto {
    id: ID;
    code: string;
    token: string;
    name: string;
    currencyCode: string;
    availableCurrencyCodes: string[];
    defaultLanguageCode: string;
    availableLanguageCodes: string[];
    pricesIncludeTax: boolean;
}
