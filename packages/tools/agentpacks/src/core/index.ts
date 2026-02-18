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
