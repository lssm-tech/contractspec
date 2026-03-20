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
} from './core/config.js';
export {
	type DependencyResolution,
	resolveDependencies,
} from './core/dependency-resolver.js';
export { FeatureMerger, type MergedFeatures } from './core/feature-merger.js';
export {
	computeIntegrity,
	type Lockfile,
	loadLockfile,
	saveLockfile,
} from './core/lockfile.js';
export { type LoadedPack, PackLoader } from './core/pack-loader.js';
export {
	type ResolvedModels,
	resolveAgentModel,
	resolveModels,
} from './core/profile-resolver.js';
// Exporters
export {
	type CursorPluginExportResult,
	exportCursorPlugin,
} from './exporters/cursor-plugin.js';
export { importFromClaudeCode } from './importers/claude-code.js';
export { importFromCursor } from './importers/cursor.js';
export { importFromOpenCode } from './importers/opencode.js';
// Importers
export { importFromRulesync } from './importers/rulesync.js';
export { installGitSource } from './sources/git.js';
export {
	type GitSourceRef,
	isGitPackRef,
	parseGitSourceRef,
} from './sources/git-ref.js';
// Sources
export { isLocalPackRef, resolveLocalPack } from './sources/local.js';
export { installNpmSource } from './sources/npm.js';
export {
	isNpmPackRef,
	type NpmSourceRef,
	parseNpmSourceRef,
} from './sources/npm-ref.js';
export {
	isRegistryPackRef,
	parseRegistrySourceRef,
	type RegistrySourceRef,
	registrySourceKey,
} from './sources/registry-ref.js';
// Targets
export { type BaseTarget } from './targets/base-target.js';
export {
	getAllTargets,
	getTarget,
	getTargets,
	listTargetIds,
} from './targets/registry.js';
