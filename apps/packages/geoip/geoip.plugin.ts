import { PluginCommonModule, Type, VendurePlugin } from '@vendure/core';
import { GEOIP_OPTIONS, GeoIpPluginOptions } from './types/geoip.types';
import { GeoIpHybridService } from './services/geoip-hybrid.service';
import { GeoIpDownloaderService } from './services/geoip-downloader.service';
import { createGeoIpMiddleware } from './middleware/geoip.middleware';
import { geoIpAdminApiSchema } from './api/geoip-admin.schema';
import { GeoIpAdminResolver } from './resolvers/geoip-admin.resolver';

@VendurePlugin({
    compatibility: '^3.0.0',
    imports: [PluginCommonModule],
    providers: [
        GeoIpHybridService,
        GeoIpDownloaderService,
        {
            provide: GEOIP_OPTIONS,
            useFactory: () => GeoIpPlugin.options,
        },
    ],
    adminApiExtensions: {
        schema: geoIpAdminApiSchema,
        resolvers: [GeoIpAdminResolver],
    },
    configuration: config => {
        config.apiOptions.middleware.push({
            route: '*',
            handler: createGeoIpMiddleware(GeoIpPlugin.options),
        });
        return config;
    },
    dashboard: './dashboard',
})
export class GeoIpPlugin {
    static options: GeoIpPluginOptions = {};

    static init(options: GeoIpPluginOptions = {}): Type<GeoIpPlugin> {
        this.options = options;
        return GeoIpPlugin;
    }
}
