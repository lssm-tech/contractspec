export {
	fetchGitDirectory,
	fetchGitFile,
	installGitSource,
	resolveGitRef,
} from './git.js';

export {
	type GitSourceRef,
	gitSourceKey,
	isGitPackRef,
	parseGitSourceRef,
} from './git-ref.js';
export { isLocalPackRef, resolveLocalPack } from './local.js';
export { installNpmSource, resolveNpmVersion } from './npm.js';
export {
	isNpmPackRef,
	type NpmSourceRef,
	npmSourceKey,
	parseNpmSourceRef,
} from './npm-ref.js';
export { installRegistrySource } from './registry.js';
export {
	isRegistryPackRef,
	parseRegistrySourceRef,
	type RegistrySourceRef,
	registrySourceKey,
} from './registry-ref.js';
