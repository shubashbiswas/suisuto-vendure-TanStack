export interface MarketSeoConfig {
    siteTitle?: string;
    titleTemplate?: string;
    defaultMetaDescription?: string;
    openGraph?: {
        type?: string;
        locale?: string;
        image?: string;
    };
    hreflang?: Record<string, string>;
}

export interface MarketNavigationMenuItem {
    title: string;
    href: string;
    featured?: boolean;
    items?: Array<{ title: string; href: string }>;
}

export interface MarketNavigationConfig {
    header?: {
        megaMenu?: MarketNavigationMenuItem[];
        topUtility?: Array<{ label: string; href: string }>;
    };
    footer?: {
        columns?: Array<{
            title: string;
            links: Array<{ label: string; href: string }>;
        }>;
    };
}

export interface MarketConfigData {
    id?: string;
    code: string;
    name: string;
    countryCode?: string;
    supportedCountryCodes?: string[];
    currency: string;
    defaultLanguage: string;
    supportedLanguages?: string[];
    urlPrefix?: string;
    channelCode?: string;
    channelToken?: string;
    enabled?: boolean;
    isDefault?: boolean;
    navigation?: MarketNavigationConfig;
    homepage?: {
        sections?: Array<{
            type: string;
            props?: Record<string, any>;
        }>;
    };
    merchandising?: Record<string, any>;
    content?: Record<string, any>;
    seo?: MarketSeoConfig;
}
