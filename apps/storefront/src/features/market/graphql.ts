import type { TadaDocumentNode } from 'gql.tada';
import { parse } from 'graphql';
import type { MarketConfigData } from './market.types';

export interface GetMarketByCodeResult {
    market: MarketConfigData | null;
}

export interface GetMarketByCodeVariables {
    code: string;
}

export const GetMarketByCodeQuery = parse(`
    query GetMarketByCode($code: String!) {
        market(code: $code) {
            id
            code
            name
            countryCode
            supportedCountryCodes
            currency
            defaultLanguage
            supportedLanguages
            urlPrefix
            channelCode
            channelToken
            enabled
            isDefault
            navigation
            homepage
            merchandising
            content
            seo
        }
    }
`) as unknown as TadaDocumentNode<GetMarketByCodeResult, GetMarketByCodeVariables>;
