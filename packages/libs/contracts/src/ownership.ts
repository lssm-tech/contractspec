/**
 * Ownership, stability, and tagging types for ContractSpec.
 *
 * Provides canonical enums and metadata interfaces for spec ownership,
 * lifecycle stages, and categorization.
 *
 * @module ownership
 */

import type { DocId } from './docs';

// ─────────────────────────────────────────────────────────────────────────────
// Stability
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lifecycle stability stages for specs.
 *
 * Specs progress through these stages as they mature:
 * - `idea`: Initial concept, not implemented
 * - `in_creation`: Currently being built
 * - `experimental`: Working but may change significantly
 * - `beta`: Feature-complete, seeking feedback
 * - `stable`: Production-ready, breaking changes require major version bump
 * - `deprecated`: Scheduled for removal, use alternatives
 */
export const StabilityEnum = {
  /** Initial concept, not yet implemented. */
  Idea: 'idea',
  /** Currently being built, not ready for use. */
  InCreation: 'in_creation',
  /** Working but unstable, may change significantly. */
  Experimental: 'experimental',
  /** Feature-complete, seeking feedback before stabilization. */
  Beta: 'beta',
  /** Production-ready, follows semantic versioning. */
  Stable: 'stable',
  /** Scheduled for removal, use alternatives. */
  Deprecated: 'deprecated',
} as const;

/** Stability level for a spec's lifecycle stage. */
export type Stability = (typeof StabilityEnum)[keyof typeof StabilityEnum];

// ─────────────────────────────────────────────────────────────────────────────
// Owners
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Curated owner identifiers for business/product ownership.
 *
 * Used for CODEOWNERS, on-call routing, and approval workflows.
 * Custom owner strings are also allowed for flexibility.
 */
export const OwnersEnum = {
  /** Core platform team. */
  PlatformCore: 'platform.core',
  /** Sigil/auth team. */
  PlatformSigil: 'platform.sigil',
  /** Marketplace team. */
  PlatformMarketplace: 'platform.marketplace',
  /** Messaging/notifications team. */
  PlatformMessaging: 'platform.messaging',
  /** Content/CMS team. */
  PlatformContent: 'platform.content',
  /** Feature flags team. */
  PlatformFeatureFlags: 'platform.featureflags',
  /** Finance/billing team. */
  PlatformFinance: 'platform.finance',
} as const;

/**
 * Owner identifier for a spec.
 * Can be a predefined OwnersEnum value or any custom string.
 */
export type Owner =
  | (typeof OwnersEnum)[keyof typeof OwnersEnum]
  | (string & {});

/** @deprecated Use OwnersEnum instead. */
export const Owners = OwnersEnum;

// ─────────────────────────────────────────────────────────────────────────────
// Tags
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Common tags for categorizing specs.
 *
 * Used for search, grouping, and documentation navigation.
 * Custom tag strings are also allowed for flexibility.
 */
export const TagsEnum = {
  /** Spots/locations domain. */
  Spots: 'spots',
  /** Collectivity/community domain. */
  Collectivity: 'collectivity',
  /** Marketplace domain. */
  Marketplace: 'marketplace',
  /** Seller-related features. */
  Sellers: 'sellers',
  /** Authentication features. */
  Auth: 'auth',
  /** Login flows. */
  Login: 'login',
  /** Signup flows. */
  Signup: 'signup',
  /** Onboarding/guides. */
  Guide: 'guide',
  /** Documentation. */
  Docs: 'docs',
  /** Internationalization. */
  I18n: 'i18n',
  /** Incident management. */
  Incident: 'incident',
  /** Automation/workflows. */
  Automation: 'automation',
  /** Code hygiene/maintenance. */
  Hygiene: 'hygiene',
} as const;

/**
 * Tag for categorizing a spec.
 * Can be a predefined TagsEnum value or any custom string.
 */
export type Tag = (typeof TagsEnum)[keyof typeof TagsEnum] | (string & {});

/** @deprecated Use TagsEnum instead. */
export const Tags = TagsEnum;

// ─────────────────────────────────────────────────────────────────────────────
// Ownership Metadata
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Common metadata interface for all ContractSpec specifications.
 *
 * Every spec type (operations, events, presentations, etc.) extends this
 * interface to provide consistent ownership, versioning, and discoverability.
 *
 * @example
 * ```typescript
 * const meta: OwnerShipMeta = {
 *   key: 'auth.login',
 *   version: '1.0.0',
 *   description: 'Authenticates a user with email and password',
 *   stability: StabilityEnum.Stable,
 *   owners: [OwnersEnum.PlatformSigil],
 *   tags: [TagsEnum.Auth, TagsEnum.Login],
 * };
 * ```
 */
export interface OwnerShipMeta {
  /**
   * Semantic version string (e.g., "1.0.0").
   * Bump for breaking changes according to semver rules.
   */
  version: string;

  /**
   * Fully-qualified spec key (e.g., "sigil.beginSignup", "user.created").
   * Must be unique within the spec type.
   */
  key: string;

  /**
   * Human-friendly title (e.g., "Begin Signup").
   * Used in documentation and UI.
   */
  title?: string;

  /**
   * Short human-friendly summary of what this spec does.
   * Should be concise (1-2 sentences).
   */
  description: string;

  /**
   * Business domain this spec belongs to (e.g., "auth", "marketplace").
   * Used for grouping and discovery.
   */
  domain?: string;

  /**
   * Lifecycle stability marker.
   * Indicates maturity level and change expectations.
   */
  stability: Stability;

  /**
   * Team/individual owners responsible for this spec.
   * Used for CODEOWNERS, on-call routing, and approvals.
   */
  owners: Owner[];

  /**
   * Tags for search, grouping, and documentation navigation.
   */
  tags: Tag[];

  /**
   * Associated DocBlock identifiers for documentation linkage.
   */
  docId?: DocId[];
}
