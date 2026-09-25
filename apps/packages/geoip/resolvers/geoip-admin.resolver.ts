import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Allow, Permission } from '@vendure/core';
import {
    FlushGeoIpCacheResult,
    GeoIpHybridService,
    GeoIpResolutionResult,
    GeoIpStats,
} from '../services/geoip-hybrid.service';
import {
    GeoIpDownloaderService,
    UpdateMaxMindDatabaseResult,
} from '../services/geoip-downloader.service';
import { CountryMetadata } from '../constants/country-metadata';

@Resolver()
export class GeoIpAdminResolver {
    constructor(
        private geoIpService: GeoIpHybridService,
        private downloaderService: GeoIpDownloaderService
    ) {}

    @Query()
    @Allow(Permission.SuperAdmin, Permission.Authenticated)
    async testGeoIpResolution(
        @Args('ip') ip: string
    ): Promise<GeoIpResolutionResult> {
        return this.geoIpService.testResolution(ip);
    }

    @Query()
    @Allow(Permission.SuperAdmin, Permission.Authenticated)
    async geoIpStats(): Promise<GeoIpStats> {
        return this.geoIpService.getStats();
    }

    @Query()
    @Allow(Permission.SuperAdmin, Permission.Authenticated)
    async countryMetadata(
        @Args('code') code: string
    ): Promise<CountryMetadata | null> {
        return this.geoIpService.getCountryMetadata(code);
    }

    @Query()
    @Allow(Permission.SuperAdmin, Permission.Authenticated)
    async allCountryMetadata(): Promise<CountryMetadata[]> {
        return this.geoIpService.getAllCountryMetadata();
    }

    @Mutation()
    @Allow(Permission.SuperAdmin)
    async flushGeoIpCache(): Promise<FlushGeoIpCacheResult> {
        return this.geoIpService.flushCache();
    }

    @Mutation()
    @Allow(Permission.SuperAdmin)
    async updateMaxMindDatabase(
        @Args('licenseKey', { nullable: true }) licenseKey?: string,
        @Args('customUrl', { nullable: true }) customUrl?: string
    ): Promise<UpdateMaxMindDatabaseResult> {
        return this.downloaderService.downloadAndReload({ licenseKey, customUrl });
    }
}
