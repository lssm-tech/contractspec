import type { DocId } from "./docs";

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
  PlatformCore: 'platform.core',
  PlatformSigil: 'platform.sigil',
  PlatformMarketplace: 'platform.marketplace',
  PlatformMessaging: 'platform.messaging',
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
  /** Breaking changes => bump version */
  version: number;
  /** Fully-qualified spec key (e.g., "sigil.beginSignup") */
  key: string;
  /** Human-friendly spec title (e.g., "Signup begin") */
  title?: string;
  /** Short human-friendly summary */
  description: string;
  domain?: string;
  /** Lifecycle marker for comms & tooling */
  stability: Stability;
  /** Owners for CODEOWNERS / on-call / approvals */
  owners: Owner[];
  /** Search tags, grouping, docs navigation */
  tags: Tag[];
  /** Doc block(s) for this operation. */
  // docId: [DocId, ...DocId[]];
  docId?: DocId[];
}
