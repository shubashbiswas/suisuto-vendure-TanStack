import { GeoIpHybridService } from '../services/geoip-hybrid.service';
import { GeoIpPluginOptions, GeoProvider } from '../types/geoip.types';

/**
 * Hybrid GeoProvider implementation compatible with MultiMarketPlugin.
 * Can be passed directly into MultiMarketPlugin.init({ geoProvider: new HybridGeoProvider() }).
 */
export class HybridGeoProvider implements GeoProvider {
    private service: GeoIpHybridService;

    constructor(serviceOrOptions?: GeoIpHybridService | GeoIpPluginOptions) {
        if (serviceOrOptions instanceof GeoIpHybridService) {
            this.service = serviceOrOptions;
        } else {
            this.service = new GeoIpHybridService(serviceOrOptions);
        }
    }

    async getCountry(request: unknown): Promise<string | null> {
        return this.service.resolveCountry(request);
    }
}
