import { Ctx, RequestContext, TransactionalConnection, Channel, Country } from '@vendure/core';
import { Query, Resolver } from '@nestjs/graphql';
import { AvailableMarketDto } from '../types/multi-hub.types';

function normalizeString(val: string): string {
    return (val || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

@Resolver()
export class MultiHubShopResolver {
    private countryCache: { code: string; name: string; normalizedName: string }[] | null = null;

    constructor(private connection: TransactionalConnection) {}

    private async getCountries(ctx: RequestContext) {
        if (!this.countryCache) {
            const countries = await this.connection.getRepository(ctx, Country).find({
                relations: ['translations'],
            });
            this.countryCache = countries.map(c => {
                const trans = c.translations?.find(t => t.languageCode === ctx.languageCode)?.name ||
                              c.translations?.[0]?.name || '';
                let intl = '';
                if (c.code && c.code.length === 2) {
                    try {
                        intl = new Intl.DisplayNames(['en'], { type: 'region' }).of(c.code.toUpperCase()) || '';
                    } catch {}
                }
                const name = trans || intl || c.code;
                return {
                    code: c.code.toLowerCase(),
                    name,
                    normalizedName: normalizeString(name),
                };
            });
        }
        return this.countryCache;
    }

    private resolveMarket(
        channel: Channel,
        countries: { code: string; name: string; normalizedName: string }[]
    ): { slug: string; name: string } {
        const rawCode = (channel.code || '').trim().toLowerCase();
        const rawToken = (channel.token || '').trim().toLowerCase();

        if (rawCode === '__default_channel__' || rawCode === 'global' || rawToken === 'global') {
            return { slug: 'global', name: 'Global' };
        }

        // 1. Check if shipping zone has a single country member
        if (channel.defaultShippingZone?.members?.length === 1) {
            const member = channel.defaultShippingZone.members[0];
            if (member?.code && member.code.length === 2) {
                const iso = member.code.toLowerCase();
                const matched = countries.find(c => c.code === iso);
                let intl = '';
                try {
                    intl = new Intl.DisplayNames(['en'], { type: 'region' }).of(member.code.toUpperCase()) || '';
                } catch {}
                return {
                    slug: iso,
                    name: matched?.name || intl || member.code,
                };
            }
        }

        // 2. Direct 2-letter ISO match against code or token
        for (const candidate of [rawCode, rawToken]) {
            if (candidate.length === 2) {
                const matched = countries.find(c => c.code === candidate);
                let intl = '';
                try {
                    intl = new Intl.DisplayNames(['en'], { type: 'region' }).of(candidate.toUpperCase()) || '';
                } catch {}
                return {
                    slug: candidate,
                    name: matched?.name || intl || candidate.toUpperCase(),
                };
            }
        }

        // 3. Fallback matching
        for (const candidate of [rawCode, rawToken]) {
            const normCandidate = normalizeString(candidate);
            const matched = countries.find(c => {
                const codeMatch = normCandidate.includes(c.code);
                const nameMatch = c.normalizedName && (normCandidate.includes(c.normalizedName) || c.normalizedName.includes(normCandidate));
                return codeMatch || nameMatch;
            });
            if (matched) {
                return {
                    slug: matched.code,
                    name: matched.name,
                };
            }
        }

        return {
            slug: rawToken || rawCode,
            name: channel.code.charAt(0).toUpperCase() + channel.code.slice(1),
        };
    }

    @Query()
    async availableMarkets(@Ctx() ctx: RequestContext): Promise<AvailableMarketDto[]> {
        const countries = await this.getCountries(ctx);
        const channels = await this.connection.getRepository(ctx, Channel).find({
            relations: [
                'defaultShippingZone',
                'defaultShippingZone.members',
            ],
        });

        const activeChannels = channels.filter(c => c.code !== '__default_channel__');

        const channelMap = new Map<string, AvailableMarketDto>();

        for (const c of activeChannels) {
            const market = this.resolveMarket(c, countries);
            const isGlobal = market.slug === 'global';

            let availableCurrencyCodes = c.availableCurrencyCodes || [];
            if (!availableCurrencyCodes.includes(c.defaultCurrencyCode)) {
                availableCurrencyCodes = [c.defaultCurrencyCode, ...availableCurrencyCodes];
            }

            let availableLanguageCodes = (c.availableLanguageCodes || []).map(l => l.toString());
            if (!availableLanguageCodes.includes(c.defaultLanguageCode.toString())) {
                availableLanguageCodes = [c.defaultLanguageCode.toString(), ...availableLanguageCodes];
            }

            channelMap.set(market.slug, {
                id: c.id,
                code: market.slug,
                token: c.token,
                name: isGlobal ? 'Global' : market.name,
                currencyCode: c.defaultCurrencyCode,
                availableCurrencyCodes,
                defaultLanguageCode: c.defaultLanguageCode,
                availableLanguageCodes,
                pricesIncludeTax: c.pricesIncludeTax,
            });
        }

        const result: AvailableMarketDto[] = [];
        if (channelMap.has('global')) {
            result.push(channelMap.get('global')!);
        }

        for (const [slug, market] of channelMap.entries()) {
            if (slug !== 'global') {
                result.push(market);
            }
        }

        return result;
    }
}
