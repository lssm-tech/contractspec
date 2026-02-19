export {
  type TargetId,
  type FeatureId,
  type RepoMode,
  type PackManifest,
  type WorkspaceConfig,
  TARGET_IDS,
  FEATURE_IDS,
  REPO_MODES,
  PackManifestSchema,
  WorkspaceConfigSchema,
  loadWorkspaceConfig,
  loadPackManifest,
  resolveFeatures,
  resolveTargets,
} from './config.js';

export { PackLoader } from './pack-loader.js';
export { FeatureMerger } from './feature-merger.js';

export {
  type Lockfile,
  type LockfileSourceEntry,
  type LockfileSkillEntry,
  loadLockfile,
  saveLockfile,
  getLockedSource,
  setLockedSource,
  computeIntegrity,
  isLockfileFrozenValid,
} from './lockfile.js';

export {
  type DependencyNode,
  type DependencyResolution,
  buildDependencyGraph,
  resolveDependencies,
} from './dependency-resolver.js';
