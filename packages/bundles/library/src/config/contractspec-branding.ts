import type {
  BrandingDefaults,
  ResolvedBranding,
} from '@contractspec/lib.contracts/app-config';

/**
 * Default branding configuration for ContractSpec.
 * Used as blueprint defaults before tenant overrides.
 */
export const contractspecBrandingDefaults: BrandingDefaults = {
  appNameKey: 'ContractSpec',
  assets: [
    { type: 'logo', url: '/logo.svg', dimensions: { width: 180, height: 40 } },
    {
      type: 'logo-dark',
      url: '/logo-dark.svg',
      dimensions: { width: 180, height: 40 },
    },
    {
      type: 'favicon',
      url: '/favicon.ico',
      dimensions: { width: 32, height: 32 },
    },
    {
      type: 'og-image',
      url: '/og-image.png',
      dimensions: { width: 1200, height: 630 },
    },
  ],
  colorTokens: {
    primary: '#0ea5e9',
    secondary: '#6366f1',
  },
};

/**
 * Pre-resolved branding for ContractSpec.
 * Ready-to-use branding values with all defaults applied.
 */
export const contractspecResolvedBranding: ResolvedBranding = {
  appName: 'ContractSpec',
  assets: {
    logo: '/logo.svg',
    logoDark: '/logo-dark.svg',
    favicon: '/favicon.ico',
    ogImage: '/og-image.png',
  },
  colors: {
    primary: '#0ea5e9',
    secondary: '#6366f1',
  },
  domain: 'contractspec.io',
};
