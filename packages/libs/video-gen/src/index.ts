// ---------------------------------------------------------------------------
// @lssm/lib.video-gen -- Programmatic video generation with Remotion
// ---------------------------------------------------------------------------

// Types
export * from './types';

// Design tokens
export * from './design';

// Compositions
export * from './compositions';

// Generators
export * from './generators';

// Renderers
export {
  resolveRenderConfig,
  defaultRenderConfig,
  qualityPresets,
  codecFormatMap,
} from './renderers/config';
export type { QualityPreset } from './renderers/config';
// Note: LocalRenderer must be imported directly from './renderers/local'
// as it requires Node.js (@remotion/renderer)
