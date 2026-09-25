import { gql } from 'graphql-tag';

export const geoIpAdminApiSchema: any = gql`
    type CountryMetadata {
        countryCode: String!
        countryName: String!
        flag: String!
        currencyCode: String!
        currencySymbol: String!
        callingCode: String!
        defaultLanguage: String!
        continent: String!
        isEuropeanUnion: Boolean!
    }

    type GeoIpResolutionResult {
        ip: String!
        isPrivate: Boolean!
        detectedCountry: String
        countryName: String
        marketCode: String
        urlPrefix: String
        atelier: String
        hubCode: String
        currency: String
        tierUsed: String!
        latencyMs: Float!
        cached: Boolean!
        metadata: CountryMetadata
    }

    type GeoIpStats {
        cacheEntriesCount: Int!
        maxmindLoaded: Boolean!
        maxmindDbPath: String
        fallbackApiEnabled: Boolean!
        totalLookups: Int!
        cacheHits: Int!
        tier0Hits: Int!
        tier1Hits: Int!
        tier2Hits: Int!
    }

    type FlushGeoIpCacheResult {
        success: Boolean!
        clearedEntries: Int!
        message: String!
    }

    type UpdateMaxMindDatabaseResult {
        success: Boolean!
        message: String!
        bytesDownloaded: Int
        databasePath: String
        lastModified: String
    }

    extend type Query {
        testGeoIpResolution(ip: String!): GeoIpResolutionResult!
        geoIpStats: GeoIpStats!
        countryMetadata(code: String!): CountryMetadata
        allCountryMetadata: [CountryMetadata!]!
    }

    extend type Mutation {
        flushGeoIpCache: FlushGeoIpCacheResult!
        updateMaxMindDatabase(licenseKey: String, customUrl: String): UpdateMaxMindDatabaseResult!
    }
`;
