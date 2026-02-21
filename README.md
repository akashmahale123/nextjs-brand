# nextjs-brand

A generic branding, i18n, and configuration module for Next.js applications.

## Features

- **Branding Configuration**: Centralized brand settings (name, tagline, logo, colors)
- **Theming**: Dynamic CSS variable injection for brand colors (Primary, Secondary, Tertiary)
- **Localization**: Custom `t()` helper supporting nested keys and fallback logic
- **Currency Engine**: Registry of global currencies with symbol and flag mapping
- **Language Support**: Configurable language lists for dashboard and marketing
- **Cookie Helpers**: Locale persistence via cookies
- **Environment Variable Support**: Override defaults via `NEXT_PUBLIC_*` env vars

## Installation

```bash
npm install /path/to/nextjs-brand
```

## Usage

### Basic Setup

```typescript
import { createBrandConfig } from "nextjs-brand";
import enUS from "@/messages/en-US.json";
import esES from "@/messages/es-ES.json";
import frFR from "@/messages/fr-FR.json";

const { CONFIG, t, setLocaleCookie, getLocaleCookie } = createBrandConfig({
  brand: {
    name: "MyApp",
    tagline: "Your Awesome Application",
    primaryColor: "#4f46e5",
    secondaryColor: "#10b981",
    tertiaryColor: "#f59e0b",
  },
  regional: {
    defaultCurrency: "USD",
    defaultLocale: "en-US",
  },
  translations: {
    "en-US": enUS,
    "es-ES": esES,
    "fr-FR": frFR,
  },
  currencies: [
    { code: "USD", flag: "🇺🇸", name: "US Dollar", symbol: "$" },
    { code: "EUR", flag: "🇪🇺", name: "Euro", symbol: "€" },
  ],
  languages: [
    { code: "en-US", flag: "🇺🇸", name: "English (US)" },
    { code: "es-ES", flag: "🇪🇸", name: "Spanish" },
  ],
});

export { CONFIG, t, setLocaleCookie, getLocaleCookie };
```

### Using Translations

```typescript
import { t } from "@/lib/config";

// Simple key
const title = t("home.hero.title", "en-US");

// Nested key with fallback
const description = t("dashboard.welcome.message", userLocale);
```

### Accessing Configuration

```typescript
import { CONFIG } from "@/lib/config";

console.log(CONFIG.brand.name); // "MyApp"
console.log(CONFIG.regional.defaultCurrency); // "USD"
console.log(CONFIG.currencies); // Array of currency objects
```

### Custom Configuration

You can add custom configuration sections:

```typescript
const { CONFIG } = createBrandConfig({
  customConfig: {
    contractTypes: [
      { id: 'msa', label: 'Master Service Agreement' },
      { id: 'nda', label: 'Non-Disclosure Agreement' },
    ],
    proposalCategories: [
      { id: "web-dev", label: "Web Development", color: "#4f46e5" },
    ],
  },
});

// Access custom config
console.log(CONFIG.contractTypes);
console.log(CONFIG.proposalCategories);
```

## Environment Variables

Override defaults using environment variables:

- `NEXT_PUBLIC_APP_NAME` - Application name
- `NEXT_PUBLIC_APP_TAGLINE` - Application tagline
- `NEXT_PUBLIC_APP_LOGO_URL` - Logo URL
- `NEXT_PUBLIC_PRIMARY_COLOR` - Primary brand color
- `NEXT_PUBLIC_SECONDARY_COLOR` - Secondary brand color
- `NEXT_PUBLIC_TERTIARY_COLOR` - Tertiary brand color
- `NEXT_PUBLIC_DEFAULT_CURRENCY` - Default currency code
- `NEXT_PUBLIC_DEFAULT_LOCALE` - Default locale

## API Reference

### `createBrandConfig(options)`

Creates a brand configuration module.

**Options:**
- `brand` - Brand configuration object
- `regional` - Regional settings (currency, locale)
- `currencies` - Array of currency objects
- `languages` - Array of language objects for dashboard
- `marketingLanguages` - Array of language objects for marketing pages
- `pricingMap` - Pricing information per locale
- `translations` - Translation dictionaries per locale
- `customConfig` - Any additional custom configuration

**Returns:**
- `CONFIG` - Complete configuration object
- `t(key, locale?)` - Translation function
- `setLocaleCookie(locale)` - Set locale cookie
- `getLocaleCookie()` - Get locale from cookie

## License

MIT
