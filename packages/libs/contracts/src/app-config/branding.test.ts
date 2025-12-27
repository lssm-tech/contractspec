import { describe, expect, it } from 'bun:test';
import type {
  BrandingAssetRef,
  BrandingDefaults,
  TenantBrandingAsset,
  TenantBrandingConfig,
  ResolvedBranding,
} from './branding';

describe('BrandingAssetRef interface', () => {
  it('should define logo type', () => {
    const asset: BrandingAssetRef = {
      type: 'logo',
      url: 'https://example.com/logo.png',
    };
    expect(asset.type).toBe('logo');
    expect(asset.url).toBe('https://example.com/logo.png');
  });

  it('should define all asset types', () => {
    const types: BrandingAssetRef['type'][] = ['logo', 'logo-dark', 'favicon', 'og-image'];
    
    for (const type of types) {
      const asset: BrandingAssetRef = { type };
      expect(asset.type).toBe(type);
    }
  });

  it('should support dimensions', () => {
    const asset: BrandingAssetRef = {
      type: 'og-image',
      url: 'https://example.com/og.png',
      dimensions: { width: 1200, height: 630 },
    };
    expect(asset.dimensions?.width).toBe(1200);
    expect(asset.dimensions?.height).toBe(630);
  });
});

describe('BrandingDefaults interface', () => {
  it('should define required appNameKey', () => {
    const defaults: BrandingDefaults = {
      appNameKey: 'app.name',
    };
    expect(defaults.appNameKey).toBe('app.name');
  });

  it('should support assets array', () => {
    const defaults: BrandingDefaults = {
      appNameKey: 'myapp',
      assets: [
        { type: 'logo', url: '/logo.png' },
        { type: 'favicon', url: '/favicon.ico' },
      ],
    };
    expect(defaults.assets).toHaveLength(2);
  });

  it('should support color tokens', () => {
    const defaults: BrandingDefaults = {
      appNameKey: 'myapp',
      colorTokens: {
        primary: '#3B82F6',
        secondary: '#10B981',
      },
    };
    expect(defaults.colorTokens?.primary).toBe('#3B82F6');
    expect(defaults.colorTokens?.secondary).toBe('#10B981');
  });
});

describe('TenantBrandingAsset interface', () => {
  it('should require url', () => {
    const asset: TenantBrandingAsset = {
      type: 'logo',
      url: 'https://tenant.example.com/logo.png',
    };
    expect(asset.url).toBe('https://tenant.example.com/logo.png');
  });

  it('should support metadata', () => {
    const asset: TenantBrandingAsset = {
      type: 'logo',
      url: 'https://example.com/logo.png',
      metadata: {
        mimeType: 'image/png',
        sizeBytes: 12345,
        dimensions: { width: 200, height: 50 },
      },
    };
    expect(asset.metadata?.mimeType).toBe('image/png');
    expect(asset.metadata?.sizeBytes).toBe(12345);
    expect(asset.metadata?.dimensions?.width).toBe(200);
  });
});

describe('TenantBrandingConfig interface', () => {
  it('should support localized app names', () => {
    const config: TenantBrandingConfig = {
      appName: {
        en: 'My App',
        fr: 'Mon Application',
        de: 'Meine App',
      },
    };
    expect(config.appName?.en).toBe('My App');
    expect(config.appName?.fr).toBe('Mon Application');
  });

  it('should support custom domain', () => {
    const config: TenantBrandingConfig = {
      customDomain: 'app.customer.com',
    };
    expect(config.customDomain).toBe('app.customer.com');
  });

  it('should support subdomain', () => {
    const config: TenantBrandingConfig = {
      subdomain: 'customer',
    };
    expect(config.subdomain).toBe('customer');
  });

  it('should support colors', () => {
    const config: TenantBrandingConfig = {
      colors: {
        primary: '#FF0000',
        secondary: '#00FF00',
      },
    };
    expect(config.colors?.primary).toBe('#FF0000');
  });
});

describe('ResolvedBranding interface', () => {
  it('should have all required fields', () => {
    const branding: ResolvedBranding = {
      appName: 'My Application',
      assets: {
        logo: 'https://example.com/logo.png',
        logoDark: 'https://example.com/logo-dark.png',
        favicon: 'https://example.com/favicon.ico',
        ogImage: 'https://example.com/og.png',
      },
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      },
      domain: 'app.example.com',
    };

    expect(branding.appName).toBe('My Application');
    expect(branding.assets.logo).toBe('https://example.com/logo.png');
    expect(branding.colors.primary).toBe('#3B82F6');
    expect(branding.domain).toBe('app.example.com');
  });

  it('should allow optional asset urls', () => {
    const branding: ResolvedBranding = {
      appName: 'Minimal App',
      assets: {},
      colors: { primary: '#000', secondary: '#FFF' },
      domain: 'minimal.example.com',
    };

    expect(branding.assets.logo).toBeUndefined();
    expect(branding.assets.favicon).toBeUndefined();
  });
});
