/**
 * Quickstart service types.
 *
 * Type definitions for the ContractSpec quickstart installation feature.
 */

/**
 * Installation mode for quickstart.
 */
export type QuickstartMode = 'minimal' | 'full';

/**
 * A dependency to install during quickstart.
 */
export interface QuickstartDependency {
  /** Package name (e.g., '@contractspec/lib.contracts-spec') */
  name: string;
  /** Specific version or latest if not specified */
  version?: string;
  /** Whether this is a dev dependency */
  dev?: boolean;
  /** Whether this dependency is optional */
  optional?: boolean;
  /** Human-readable description */
  description: string;
}

/**
 * Options for running quickstart.
 */
export interface QuickstartOptions {
  /** Workspace root directory */
  workspaceRoot: string;
  /** Installation mode */
  mode: QuickstartMode;
  /** Dry run - show what would be installed without installing */
  dryRun?: boolean;
  /** Skip interactive prompts */
  skipPrompts?: boolean;
  /** Force reinstall even if packages exist */
  force?: boolean;
  /** Verbose output */
  verbose?: boolean;
}

/**
 * Result of a single package installation.
 */
export interface PackageInstallResult {
  name: string;
  action: 'installed' | 'skipped' | 'error';
  message: string;
  dev?: boolean;
}

/**
 * Result of the quickstart operation.
 */
export interface QuickstartResult {
  /** Whether the operation was successful overall */
  success: boolean;
  /** Packages that were installed */
  installed: PackageInstallResult[];
  /** Packages that were skipped (already installed) */
  skipped: PackageInstallResult[];
  /** Packages that failed to install */
  errors: PackageInstallResult[];
  /** Summary message */
  summary: string;
}

/**
 * Prompt callbacks for interactive quickstart.
 */
export interface QuickstartPromptCallbacks {
  /** Confirm a yes/no question */
  confirm: (message: string) => Promise<boolean>;
  /** Select from a list of options */
  select: <T extends string>(
    message: string,
    options: { value: T; label: string }[]
  ) => Promise<T>;
}
