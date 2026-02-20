export { resolveLocalPack, isLocalPackRef } from './local.js';

export {
  type GitSourceRef,
  parseGitSourceRef,
  isGitPackRef,
  gitSourceKey,
} from './git-ref.js';

export {
  resolveGitRef,
  fetchGitDirectory,
  fetchGitFile,
  installGitSource,
} from './git.js';

export {
  type NpmSourceRef,
  parseNpmSourceRef,
  isNpmPackRef,
  npmSourceKey,
} from './npm-ref.js';

export { resolveNpmVersion, installNpmSource } from './npm.js';

export {
  type RegistrySourceRef,
  parseRegistrySourceRef,
  isRegistryPackRef,
  registrySourceKey,
} from './registry-ref.js';

export { installRegistrySource } from './registry.js';
