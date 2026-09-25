import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import {
    Channel,
    ChannelService,
    ConfigService,
    CurrencyCode,
    LanguageCode,
    Logger,
    Permission,
    RequestContextService,
    RoleService,
    StockLocationService,
    TransactionalConnection,
    User,
} from '@vendure/core';
import { LOGGER_CTX_MULTI_HUB } from '../constants/multi-hub.constants';

@Injectable()
export class MultiHubService implements OnApplicationBootstrap {
    constructor(
        private connection: TransactionalConnection,
        private channelService: ChannelService,
        private stockLocationService: StockLocationService,
        private roleService: RoleService,
        private configService: ConfigService,
        private requestContextService: RequestContextService,
    ) {}

    async onApplicationBootstrap() {
        try {
            await this.initMultiHubEntities();
        } catch (err: any) {
            Logger.error(`Failed to initialize Multi-Hub entities: ${err?.message}`, LOGGER_CTX_MULTI_HUB, err?.stack);
        }
    }

    private getChannelDisplayName(channel: Channel): string {
        const raw = (channel.token || channel.code || '').trim();
        if (raw.length === 2) {
            try {
                const intlName = new Intl.DisplayNames(['en'], { type: 'region' }).of(raw.toUpperCase());
                if (intlName) return intlName;
            } catch {}
        }
        return raw.charAt(0).toUpperCase() + raw.slice(1);
    }

    private async initMultiHubEntities() {
        const { superadminCredentials } = this.configService.authOptions;
        const superAdminUser = await this.connection.rawConnection.getRepository(User).findOne({
            where: { identifier: superadminCredentials.identifier },
            relations: { roles: { channels: true } },
        });

        if (!superAdminUser) {
            Logger.warn('SuperAdmin user not found, skipping Multi-Hub entity bootstrap', LOGGER_CTX_MULTI_HUB);
            return;
        }

        const ctx = await this.requestContextService.create({
            apiType: 'admin',
            user: superAdminUser,
        });
        const channels = await this.channelService.findAll(ctx);

        // Ensure Stock Locations and Regional Agent Roles exist dynamically for all regional channels
        const locations = await this.stockLocationService.findAll(ctx);
        const locationNames = new Set(locations.items.map(l => l.name.toLowerCase()));

        const roles = await this.roleService.findAll(ctx);
        const roleCodes = new Set(roles.items.map(r => r.code));

        const agentPermissions = [
            Permission.ReadCatalog,
            Permission.UpdateCatalog,
            Permission.ReadOrder,
            Permission.CreateOrder,
            Permission.UpdateOrder,
            Permission.ReadCustomer,
            Permission.ReadStockLocation,
            Permission.UpdateStockLocation,
        ];

        for (const channel of channels.items) {
            if (channel.code === '__default_channel__' || channel.code === 'global') {
                continue;
            }

            const displayName = this.getChannelDisplayName(channel);
            const hubName = `${displayName} Hub`;
            const cleanCode = (channel.code || channel.token || '').trim().toUpperCase();
            const countryCode = cleanCode.length === 2 ? cleanCode : cleanCode.slice(0, 2) || 'GLOBAL';
            const hubCode = `${countryCode}_HUB`;
            const domesticCarrier = 'Standard Domestic Courier';
            const crossBorderCarrier = 'DHL Express';
            const standardTransitDays = 3;

            if (!locationNames.has(hubName.toLowerCase())) {
                Logger.info(`Creating StockLocation dynamically: ${hubName} (${hubCode})`, LOGGER_CTX_MULTI_HUB);
                await this.stockLocationService.create(ctx, {
                    name: hubName,
                    description: `Primary dispatch & fulfilment center for ${displayName} Region`,
                    customFields: {
                        hubCode,
                        countryCode,
                        domesticCarrier,
                        crossBorderCarrier,
                        standardTransitDays,
                    },
                });
            }

            // Dynamically ensure role exists for each regional channel
            const roleCode = `${countryCode.toLowerCase()}-hub-agent`;
            if (!roleCodes.has(roleCode)) {
                Logger.info(`Creating Regional Agent Role dynamically: ${roleCode}`, LOGGER_CTX_MULTI_HUB);
                await this.roleService.create(ctx, {
                    code: roleCode,
                    description: `Fulfillment and dispatch operator for ${displayName} Hub`,
                    permissions: agentPermissions,
                    channelIds: [channel.id],
                });
            }
        }
    }
}
