/**
 * Rule synchronization type definitions.
 */

import type { RuleSyncTarget } from '@contractspec/lib.contracts';

/**
 * Configuration for AI agent rules synchronization.
 */
export interface RuleSyncConfig {
  /** Enable automated rule synchronization */
  enabled: boolean;
  /** Root directory for source rule files */
  rulesDir: string;
  /** Source rule files (glob patterns) */
  rules: string[];
  /** Synchronization targets (tools to generate rules for) */
  targets: RuleSyncTarget[];
  /** Automatically synchronize rules on workspace changes or builds */
  autoSync: boolean;
  /** Whether to eject/copy source rules instead of generating from Unified Rules */
  ejectMode: boolean;
}
