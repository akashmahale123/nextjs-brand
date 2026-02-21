/**
 * nextjs-brand
 * A generic branding, i18n, and configuration module for Next.js applications
 */

export interface BrandConfig {
    name: string;
    tagline?: string;
    logoUrl?: string | null;
    primaryColor?: string;
    secondaryColor?: string;
    tertiaryColor?: string;
}

export interface Currency {
    code: string;
    flag: string;
    name: string;
    symbol: string;
}

export interface Language {
    code: string;
    flag: string;
    name: string;
}

export interface PricingEntry {
    price: string;
    symbol: string;
}

export interface BrandModuleOptions {
    brand?: BrandConfig;
    regional?: {
        defaultCurrency?: string;
        defaultLocale?: string;
    };
    currencies?: Currency[];
    languages?: Language[];
    marketingLanguages?: Language[];
    pricingMap?: Record<string, PricingEntry>;
    translations?: Record<string, any>;
    customConfig?: Record<string, any>;
}

export interface BrandModule {
    CONFIG: {
        brand: BrandConfig;
        regional: {
            defaultCurrency: string;
            defaultLocale: string;
        };
        currencies: Currency[];
        languages: Language[];
        marketingLanguages: Language[];
        PRICING_MAP: Record<string, PricingEntry>;
        i18n: {
            enabled: boolean;
            supportedLocales: string[];
        };
        [key: string]: any;
    };
    t: (key: string, locale?: string) => string;
    setLocaleCookie: (locale: string) => void;
    getLocaleCookie: () => string | null;
}

// Default configurations
const DEFAULT_BRAND: BrandConfig = {
    name: "MyApp",
    tagline: "Your Application",
    logoUrl: null,
    primaryColor: "#4f46e5",
    secondaryColor: "#10b981",
    tertiaryColor: "#f59e0b",
};

const DEFAULT_CURRENCIES: Currency[] = [
    { code: "USD", flag: "🇺🇸", name: "US Dollar", symbol: "$" },
    { code: "EUR", flag: "🇪🇺", name: "Euro", symbol: "€" },
    { code: "GBP", flag: "🇬🇧", name: "British Pound", symbol: "£" },
    { code: "JPY", flag: "🇯🇵", name: "Japanese Yen", symbol: "¥" },
    { code: "INR", flag: "🇮🇳", name: "Indian Rupee", symbol: "₹" },
    { code: "SGD", flag: "🇸🇬", name: "Singapore Dollar", symbol: "$" },
    { code: "AUD", flag: "🇦🇺", name: "Australian Dollar", symbol: "$" },
    { code: "CAD", flag: "🇨🇦", name: "Canadian Dollar", symbol: "$" },
    { code: "SEK", flag: "🇸🇪", name: "Swedish Krona", symbol: "kr" },
];

const DEFAULT_LANGUAGES: Language[] = [
    { code: "en-US", flag: "🇺🇸", name: "English (US)" },
    { code: "es-ES", flag: "🇪🇸", name: "Spanish" },
    { code: "fr-FR", flag: "🇫🇷", name: "French" },
];

/**
 * Create a brand configuration module
 */
export function createBrandConfig(options: BrandModuleOptions = {}): BrandModule {
    const {
        brand = {},
        regional = {},
        currencies = DEFAULT_CURRENCIES,
        languages = DEFAULT_LANGUAGES,
        marketingLanguages = DEFAULT_LANGUAGES,
        pricingMap = {},
        translations = {},
        customConfig = {},
    } = options;

    // Merge brand config with defaults
    const brandConfig: BrandConfig = {
        name: brand.name || process.env.NEXT_PUBLIC_APP_NAME || DEFAULT_BRAND.name,
        tagline: brand.tagline || process.env.NEXT_PUBLIC_APP_TAGLINE || DEFAULT_BRAND.tagline,
        logoUrl: brand.logoUrl !== undefined ? brand.logoUrl : (process.env.NEXT_PUBLIC_APP_LOGO_URL || DEFAULT_BRAND.logoUrl),
        primaryColor: brand.primaryColor || process.env.NEXT_PUBLIC_PRIMARY_COLOR || DEFAULT_BRAND.primaryColor,
        secondaryColor: brand.secondaryColor || process.env.NEXT_PUBLIC_SECONDARY_COLOR || DEFAULT_BRAND.secondaryColor,
        tertiaryColor: brand.tertiaryColor || process.env.NEXT_PUBLIC_TERTIARY_COLOR || DEFAULT_BRAND.tertiaryColor,
    };

    const regionalConfig = {
        defaultCurrency: regional.defaultCurrency || process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "USD",
        defaultLocale: regional.defaultLocale || process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en-US",
    };

    // Extract supported locales from languages
    const supportedLocales = Array.from(
        new Set([
            ...languages.map(l => l.code),
            ...marketingLanguages.map(l => l.code),
        ])
    );

    const CONFIG = {
        brand: brandConfig,
        regional: regionalConfig,
        currencies,
        languages,
        marketingLanguages,
        PRICING_MAP: pricingMap,
        i18n: {
            enabled: true,
            supportedLocales,
        },
        ...customConfig,
    };

    /**
     * Translation helper with nested key support and fallback logic
     */
    const t = (key: string, locale: string = regionalConfig.defaultLocale): string => {
        const dict = translations[locale] || translations["en-US"] || {};
        const enDict = translations["en-US"] || {};

        const getValue = (d: any, k: string): any => {
            const keys = k.split('.');
            let value = d;
            for (const part of keys) {
                if (value === undefined || value === null) return undefined;
                value = value[part];
            }
            return value;
        };

        const value = getValue(dict, key);
        if (value !== undefined && value !== null) return value;

        // Fallback to English
        if (locale !== "en-US") {
            const enValue = getValue(enDict, key);
            if (enValue !== undefined && enValue !== null) return enValue;
        }

        return key;
    };

    /**
     * Cookie helpers for locale syncing
     */
    const setLocaleCookie = (locale: string): void => {
        if (typeof document === 'undefined') return;
        document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    };

    const getLocaleCookie = (): string | null => {
        if (typeof document === 'undefined') return null;
        const cookies = document.cookie.split('; ');
        const localeCookie = cookies.find(row => row.startsWith('NEXT_LOCALE='));
        return localeCookie ? localeCookie.split('=')[1] : null;
    };

    return {
        CONFIG,
        t,
        setLocaleCookie,
        getLocaleCookie,
    };
}

// Export types for consumers
export type { BrandModuleOptions as BrandOptions };
