export interface BrandingAssetRef {
  type: 'logo' | 'logo-dark' | 'favicon' | 'og-image';
  url?: string;
  dimensions?: { width: number; height: number };
}

export interface BrandingDefaults {
  appNameKey: string;
  assets?: BrandingAssetRef[];
  colorTokens?: {
    primary?: string;
    secondary?: string;
  };
}

export interface TenantBrandingAsset {
  type: 'logo' | 'logo-dark' | 'favicon' | 'og-image';
  url: string;
  metadata?: {
    mimeType?: string;
    sizeBytes?: number;
    dimensions?: { width: number; height: number };
  };
}

export interface TenantBrandingConfig {
  appName?: Record<string, string>;
  assets?: TenantBrandingAsset[];
  colors?: {
    primary?: string;
    secondary?: string;
  };
  customDomain?: string;
  subdomain?: string;
}

export interface ResolvedBranding {
  appName: string;
  assets: {
    logo?: string;
    logoDark?: string;
    favicon?: string;
    ogImage?: string;
  };
  colors: {
    primary: string;
    secondary: string;
  };
  domain: string;
}

