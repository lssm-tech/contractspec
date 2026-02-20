/**
 * Programmatic API for agentpacks.
 * Import this module to use agentpacks from code instead of CLI.
 *
 * @example
 * ```ts
 * import { loadWorkspaceConfig, PackLoader, FeatureMerger, getTargets } from "agentpacks/api";
 *
 * const config = loadWorkspaceConfig(".");
 * const loader = new PackLoader(".", config);
 * const { packs } = loader.loadAll();
 * const merger = new FeatureMerger(packs);
 * const { features } = merger.merge();
 * ```
 */

// Core
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
} from './core/config.js';

export { PackLoader, type LoadedPack } from './core/pack-loader.js';
export { FeatureMerger, type MergedFeatures } from './core/feature-merger.js';
export {
  type Lockfile,
  loadLockfile,
  saveLockfile,
  computeIntegrity,
} from './core/lockfile.js';
export {
  type DependencyResolution,
  resolveDependencies,
} from './core/dependency-resolver.js';
export {
  type ResolvedModels,
  resolveModels,
  resolveAgentModel,
} from './core/profile-resolver.js';

// Sources
export { isLocalPackRef, resolveLocalPack } from './sources/local.js';
export {
  isGitPackRef,
  parseGitSourceRef,
  type GitSourceRef,
} from './sources/git-ref.js';
export {
  isNpmPackRef,
  parseNpmSourceRef,
  type NpmSourceRef,
} from './sources/npm-ref.js';
export {
  isRegistryPackRef,
  parseRegistrySourceRef,
  registrySourceKey,
  type RegistrySourceRef,
} from './sources/registry-ref.js';
export { installGitSource } from './sources/git.js';
export { installNpmSource } from './sources/npm.js';

// Targets
export { type BaseTarget } from './targets/base-target.js';
export {
  getTarget,
  getAllTargets,
  getTargets,
  listTargetIds,
} from './targets/registry.js';

// Exporters
export {
  exportCursorPlugin,
  type CursorPluginExportResult,
} from './exporters/cursor-plugin.js';

// Importers
export { importFromRulesync } from './importers/rulesync.js';
export { importFromCursor } from './importers/cursor.js';
export { importFromClaudeCode } from './importers/claude-code.js';
export { importFromOpenCode } from './importers/opencode.js';
