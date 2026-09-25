import {
    LanguageCode,
    ShippingCalculator,
    ShippingEligibilityChecker,
} from '@vendure/core';
import {
    DEFAULT_DOMESTIC_RATE,
    DEFAULT_INTERNATIONAL_RATE_PER_HUB,
} from '../constants/multi-hub.constants';

export const multiHubShippingEligibilityChecker = new ShippingEligibilityChecker({
    code: 'multi-hub-shipping-eligibility-checker',
    description: [
        { languageCode: LanguageCode.en, value: 'Checks shipping eligibility for multi-hub regional routing' },
    ],
    args: {
        allowedRegion: {
            type: 'string',
            defaultValue: 'ALL',
            description: [{ languageCode: LanguageCode.en, value: 'Allowed country code (e.g. BD, IN) or ALL' }],
        },
    },
    check: (ctx, order, args) => {
        if (!order.shippingAddress?.countryCode) {
            return true;
        }
        if (args.allowedRegion === 'ALL') {
            return true;
        }
        return order.shippingAddress.countryCode.toUpperCase() === args.allowedRegion.toUpperCase();
    },
});

export const multiHubShippingCalculator = new ShippingCalculator({
    code: 'multi-hub-shipping-calculator',
    description: [
        { languageCode: LanguageCode.en, value: 'Calculates shipping fees based on single-hub vs. split-hub parcels' },
    ],
    args: {
        domesticRate: {
            type: 'int',
            defaultValue: DEFAULT_DOMESTIC_RATE, // minor currency units (e.g. 120 BDT or 120 INR)
            description: [{ languageCode: LanguageCode.en, value: 'Domestic flat rate (in minor currency units)' }],
        },
        internationalRatePerHub: {
            type: 'int',
            defaultValue: DEFAULT_INTERNATIONAL_RATE_PER_HUB, // minor currency units (e.g. $25.00 USD)
            description: [{ languageCode: LanguageCode.en, value: 'International shipping rate per originating supply hub' }],
        },
    },
    calculate: (ctx, order, args) => {
        const destCountry = order.shippingAddress?.countryCode?.toUpperCase();
        const hubsInOrder = new Set<string>();

        for (const line of order.lines) {
            const originHub = (line.productVariant.product?.customFields as any)?.originHub || '';
            if (originHub) {
                hubsInOrder.add(originHub);
            }
        }

        const singleHub = hubsInOrder.size === 1 ? Array.from(hubsInOrder)[0].toUpperCase() : null;
        const hubCountry = singleHub ? singleHub.split('_')[0] : null;

        const isDomestic = Boolean(
            destCountry &&
            singleHub &&
            hubCountry &&
            (
                hubCountry === destCountry ||
                (destCountry === 'BD' && (hubCountry === 'BD' || singleHub.includes('BANGLADESH'))) ||
                (destCountry === 'IN' && (hubCountry === 'IN' || singleHub.includes('INDIA')))
            )
        );

        if (isDomestic) {
            return {
                price: args.domesticRate,
                priceIncludesTax: false,
                taxRate: 0,
            };
        }

        const distinctHubCount = Math.max(1, hubsInOrder.size);
        const totalPrice = distinctHubCount * args.internationalRatePerHub;

        return {
            price: totalPrice,
            priceIncludesTax: false,
            taxRate: 0,
        };
    },
});
