import type {
	AgentTarget,
	GeneratedReleaseManifest,
	ReleaseCapsulePackage,
	UpgradePlan,
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
