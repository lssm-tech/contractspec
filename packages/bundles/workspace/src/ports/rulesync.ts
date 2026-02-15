/**
 * Port for rule synchronization functionality.
 */

import type {
  RuleSyncConfig,
  RuleSyncTarget,
} from '@contractspec/lib.contracts-spec';

export interface RuleSyncOptions {
  /** Root directory of the workspace */
  cwd: string;
  /** Configuration for rule synchronization */
  config: RuleSyncConfig;
  /** Specific targets to sync (overrides config.targets if provided) */
  targets?: RuleSyncTarget[];
  /** Dry run mode (don't write files) */
  dryRun?: boolean;
}

export interface RuleSyncResult {
  /** Whether the synchronization was successful */
  success: boolean;
  /** List of files created or updated */
  files: string[];
  /** Errors encountered during synchronization */
  errors?: string[];
  /** Optional logs from the synchronization process */
  logs?: string[];
}

export interface RuleSyncPort {
  /**
   * Synchronize rules based on the provided options.
   */
  sync(options: RuleSyncOptions): Promise<RuleSyncResult>;

  /**
   * Generate the rulesync configuration without executing the sync.
   * Useful for "ejecting" to raw rulesync usage.
   */
  generateConfig(options: RuleSyncOptions): Promise<string>;
}
