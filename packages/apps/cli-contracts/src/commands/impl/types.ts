/**
 * Types for the impl command group.
 */

export interface ImplStatusOptions {
  /** Path to specific spec file */
  spec?: string;
  /** Check all specs in workspace */
  all?: boolean;
  /** Glob pattern for spec files */
  pattern?: string;
  /** Output format */
  format?: 'text' | 'json' | 'table';
}

export interface ImplListOptions {
  /** Path to specific spec file */
  spec?: string;
  /** Include auto-discovered implementations */
  includeDiscovered?: boolean;
  /** Include convention-based implementations */
  includeConvention?: boolean;
  /** Output format */
  format?: 'text' | 'json' | 'table';
}

export interface ImplVerifyOptions {
  /** Path to specific spec file */
  spec?: string;
  /** Verification tier(s) to run */
  tier?: 'structure' | 'behavior' | 'ai' | 'all';
  /** Bypass cache */
  noCache?: boolean;
  /** Fail on first error */
  failFast?: boolean;
  /** Output format */
  format?: 'text' | 'json' | 'sarif';
}

export interface ImplLinkOptions {
  /** Type of implementation */
  type?: 'handler' | 'component' | 'form' | 'test' | 'service' | 'other';
  /** Description */
  description?: string;
}
