export {
	FEATURE_IDS,
	type FeatureId,
	loadPackManifest,
	loadWorkspaceConfig,
	type PackManifest,
	PackManifestSchema,
	REPO_MODES,
	type RepoMode,
	resolveFeatures,
	resolveTargets,
	TARGET_IDS,
	type TargetId,
	type WorkspaceConfig,
	WorkspaceConfigSchema,
} from './config.js';
export {
	buildDependencyGraph,
	type DependencyNode,
	type DependencyResolution,
	resolveDependencies,
} from './dependency-resolver.js';
export { FeatureMerger } from './feature-merger.js';

export {
	computeIntegrity,
	getLockedSource,
	isLockfileFrozenValid,
	type Lockfile,
	type LockfileSkillEntry,
	type LockfileSourceEntry,
	loadLockfile,
	saveLockfile,
	setLockedSource,
} from './lockfile.js';
export { PackLoader } from './pack-loader.js';
