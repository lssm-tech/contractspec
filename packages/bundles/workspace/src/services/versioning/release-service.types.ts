import type {
	AgentTarget,
	GeneratedReleaseManifest,
	MigrationInstruction,
	ReleaseCapsulePackage,
	ReleaseCapsuleValidation,
	ReleaseImpactAudience,
	UpgradePlan,
	UpgradePlanStep,
	VersionBumpType,
} from '@contractspec/lib.contracts-spec';

export interface ReleaseInitOptions {
	workspaceRoot?: string;
	baseline?: string;
	slug?: string;
	summary?: string;
	releaseType?: VersionBumpType;
	packages?: string[];
	dryRun?: boolean;
	force?: boolean;
}

export interface ReleaseInitResult {
	slug: string;
	changesetPath: string;
	capsulePath: string;
	changesetContent: string;
	capsuleContent: string;
	packages: ReleaseCapsulePackage[];
	releaseType: VersionBumpType;
	isBreaking: boolean;
}

export interface ReleaseBuildOptions {
	workspaceRoot?: string;
	outputDir?: string;
	dryRun?: boolean;
	agentTargets?: AgentTarget[];
}

export interface ReleaseBuildResult {
	outputDir: string;
	manifestPath: string;
	upgradeManifestPath: string;
	patchNotesPath: string;
	customerGuidePath: string;
	promptPaths: Record<string, string>;
	manifest: GeneratedReleaseManifest;
	upgradePlan: UpgradePlan;
	releasesBuilt: number;
}

export interface ReleaseCapsuleReadIssue {
	slug: string;
	filePath: string;
	message: string;
	line?: number;
	column?: number;
	suggestion?: string;
}

export interface ReleaseAuthoringDraft {
	slug: string;
	summary: string;
	releaseType: VersionBumpType;
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

export interface ReleaseAuthoringOptions {
	workspaceRoot?: string;
	baseline?: string;
	slug?: string;
	summary?: string;
	releaseType?: VersionBumpType;
	packages?: string[];
}

export interface ReleaseAuthoringResult {
	workspaceRoot: string;
	source: 'created' | 'existing';
	changesetPath: string;
	capsulePath: string;
	draft: ReleaseAuthoringDraft;
	warnings: string[];
	parseIssues: ReleaseCapsuleReadIssue[];
	aiAssisted: boolean;
}

export interface SaveReleaseDraftOptions {
	workspaceRoot?: string;
	draft: ReleaseAuthoringDraft;
	force?: boolean;
}

export interface SaveReleaseDraftResult {
	source: 'created' | 'updated';
	changesetPath: string;
	capsulePath: string;
	changesetContent: string;
	capsuleContent: string;
}

export interface ReleaseCheckOptions {
	workspaceRoot?: string;
	baseline?: string;
	outputDir?: string;
	strict?: boolean;
}

export interface ReleaseCheckStatus {
	name: string;
	ok: boolean;
	message: string;
}

export interface ReleaseCheckResult {
	success: boolean;
	errors: string[];
	warnings: string[];
	checks: ReleaseCheckStatus[];
}
