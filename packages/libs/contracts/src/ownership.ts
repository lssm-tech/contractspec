// Canonical ownership/stability/tags enums and shared meta

export const StabilityEnum = {
  Idea: 'idea',
  InCreation: 'in_creation',
  Experimental: 'experimental',
  Beta: 'beta',
  Stable: 'stable',
  Deprecated: 'deprecated',
} as const;
export type Stability = (typeof StabilityEnum)[keyof typeof StabilityEnum];

// Provide curated owner identifiers (business/product oriented), allow extension by string
export const OwnersEnum = {
  ProductColiving: 'product.coliving',
  ProductStrit: 'product.strit',
  ProductArtisanos: 'product.artisanos',
  PlatformSigil: 'platform.sigil',
  PlatformMarketplace: 'platform.marketplace',
  PlatformContent: 'platform.content',
  PlatformFeatureFlags: 'platform.featureflags',
  PlatformFinance: 'platform.finance',
} as const;
export type Owner =
  | (typeof OwnersEnum)[keyof typeof OwnersEnum]
  | (string & {});
// Back-compat alias
export const Owners = OwnersEnum;

// Provide common tags, allow extension by string
export const TagsEnum = {
  Spots: 'spots',
  Collectivity: 'collectivity',
  Marketplace: 'marketplace',
  Sellers: 'sellers',
  Auth: 'auth',
  Login: 'login',
  Signup: 'signup',
  Guide: 'guide',
  Docs: 'docs',
  I18n: 'i18n',
  Incident: 'incident',
  Automation: 'automation',
  Hygiene: 'hygiene',
} as const;
export type Tag = (typeof TagsEnum)[keyof typeof TagsEnum] | (string & {});
// Back-compat alias
export const Tags = TagsEnum;

export interface OwnerShipMeta {
  version?: number;
  title: string;
  description: string;
  domain: string;
  owners: Owner[];
  tags: Tag[];
  stability: Stability;
}
