/**
 * Release and upgrade metadata types built on top of the versioning module.
 */

import type { VersionBumpType } from './types';

export type AgentTarget = 'codex' | 'opencode' | 'claude-code';

export type ReleaseEnforceOn = 'release-branch' | 'always' | 'never';

export type ReleaseAudienceKind =
	| 'maintainer'
	| 'customer'
	| 'integrator'
	| 'agent';

export type UpgradeStepLevel = 'auto' | 'assisted' | 'manual';

export type UpgradeAutofixKind =
	| 'package-json'
	| 'contractsrc'
	| 'import-rewrite'
	| 'codemod';

export interface ReleaseImpactAudience {
	kind: ReleaseAudienceKind;
	summary: string;
	affectedPackages?: string[];
	affectedRuntimes?: string[];
	affectedFrameworks?: string[];
}

export interface ReleaseCapsulePackage {
	name: string;
	releaseType: VersionBumpType;
	version?: string;
	previousVersion?: string;
}

export interface MigrationInstruction {
	id: string;
	title: string;
	summary: string;
	required: boolean;
	when?: string;
	steps: string[];
}

export interface UpgradeAutofix {
	id: string;
	kind: UpgradeAutofixKind;
	title: string;
	summary: string;
	path?: string;
	packageName?: string;
	dependencyType?: 'dependencies' | 'devDependencies' | 'peerDependencies';
	from?: string;
	to?: string;
	configPath?: string;
	value?: unknown;
	codemodId?: string;
}

export interface UpgradePlanStep {
	id: string;
	title: string;
	summary: string;
	level: UpgradeStepLevel;
	instructions: string[];
	packages?: string[];
	autofixes?: UpgradeAutofix[];
}

export interface AgentPromptBundle {
	agent: AgentTarget;
	title: string;
	prompt: string;
}

export interface ReleaseCapsuleValidation {
	commands: string[];
	evidence: string[];
}

export interface ReleaseCapsule {
	schemaVersion: '1';
	slug: string;
	summary: string;
	isBreaking: boolean;
	packages: ReleaseCapsulePackage[];
	affectedRuntimes: string[];
	affectedFrameworks: string[];
	audiences: ReleaseImpactAudience[];
	deprecations: string[];
	migrationInstructions: MigrationInstruction[];
	upgradeSteps: UpgradePlanStep[];
	validation: ReleaseCapsuleValidation;
	prompts?: Partial<Record<AgentTarget, string>>;
}

export interface UpgradePackageTarget {
	name: string;
	currentVersion?: string;
	targetVersion?: string;
}

export interface GeneratedReleaseManifestEntry {
	slug: string;
	version: string;
	summary: string;
	date: string;
	isBreaking: boolean;
	packages: ReleaseCapsulePackage[];
	affectedRuntimes: string[];
	affectedFrameworks: string[];
	audiences: ReleaseImpactAudience[];
	deprecations: string[];
	migrationInstructions: MigrationInstruction[];
	upgradeSteps: UpgradePlanStep[];
	validation: ReleaseCapsuleValidation;
}

export interface GeneratedReleaseManifest {
	generatedAt: string;
	releases: GeneratedReleaseManifestEntry[];
}

export interface UpgradePlan {
	generatedAt: string;
	targetPackages: UpgradePackageTarget[];
	releases: GeneratedReleaseManifestEntry[];
	steps: UpgradePlanStep[];
	autofixCount: number;
	manualCount: number;
	assistedCount: number;
	agentPrompts: AgentPromptBundle[];
}
