/**
 * Upgrade service types.
 *
 * Types for upgrading ContractSpec SDK and configuration.
 */

import type {
	AgentPromptBundle,
	AgentTarget,
	UpgradePlan,
	UpgradePlanStep,
} from '@contractspec/lib.contracts-spec';

// ─────────────────────────────────────────────────────────────────────────────
// Options & Results
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Options for running an upgrade.
 */
export interface UpgradeOptions {
	/** Root directory of the workspace. */
	workspaceRoot: string;
	/** Upgrade SDK packages. */
	upgradePackages?: boolean;
	/** Upgrade configuration. */
	upgradeConfig?: boolean;
	/** Preview changes without applying. */
	dryRun?: boolean;
	/** Use @latest tag instead of caret range. */
	useLatest?: boolean;
	/** Generated upgrade manifest candidate paths. */
	manifestPaths?: string[];
	/** Preferred agent prompt target. */
	agentTarget?: AgentTarget;
}

/**
 * Result of a package upgrade check.
 */
export interface PackageUpgradeInfo {
	/** Package name. */
	name: string;
	/** Current version. */
	currentVersion: string;
	/** Latest available version (if known). */
	latestVersion?: string;
	/** Whether this is a dev dependency. */
	isDevDependency: boolean;
}

/**
 * Result of a config upgrade check.
 */
export interface ConfigUpgradeInfo {
	/** Config key that needs upgrading. */
	key: string;
	/** Current value (if any). */
	currentValue?: unknown;
	/** Suggested new value. */
	suggestedValue: unknown;
	/** Whether this is a new key. */
	isNew: boolean;
}

/**
 * Result of the upgrade analysis.
 */
export interface UpgradeAnalysisResult {
	/** Detected package manager. */
	packageManager: string;
	/** Packages that can be upgraded. */
	packages: PackageUpgradeInfo[];
	/** Config sections that need upgrading. */
	configUpgrades: ConfigUpgradeInfo[];
	/** Whether any upgrades are available. */
	hasUpgrades: boolean;
}

/**
 * Result of applying an upgrade.
 */
export interface UpgradeApplyResult {
	/** Whether the upgrade was successful. */
	success: boolean;
	/** Number of packages upgraded. */
	packagesUpgraded: number;
	/** Number of config sections upgraded. */
	configSectionsUpgraded: number;
	/** Error message if failed. */
	error?: string;
	/** Summary message. */
	summary: string;
	/** Applied deterministic autofixes. */
	appliedAutofixes?: string[];
	/** Remaining non-automatic steps. */
	remainingSteps?: UpgradePlanStep[];
	/** Human-readable follow-up checklist. */
	humanChecklist?: string[];
	/** Generated agent prompt for unresolved work. */
	promptBundle?: AgentPromptBundle;
	/** Upgrade plan that drove the apply step. */
	plan?: UpgradePlan;
}

export interface GuidedUpgradeAnalysisResult {
	packageManager: string;
	manifestPath?: string;
	plan: UpgradePlan;
	humanChecklist: string[];
}

export interface GuidedUpgradeApplyResult extends UpgradeApplyResult {
	manifestPath?: string;
}
