// ---------------------------------------------------------------------------
// @lssm/lib.video-gen -- Programmatic video generation with Remotion
// ---------------------------------------------------------------------------

// Compositions
export * from './compositions';

// Design tokens
export * from './design';
// Generators
export * from './generators';
export type { QualityPreset } from './renderers/config';

// Renderers
export {
	codecFormatMap,
	defaultRenderConfig,
	qualityPresets,
	resolveRenderConfig,
} from './renderers/config';
// Types
export * from './types';
// Note: LocalRenderer must be imported directly from './renderers/local'
// as it requires Node.js (@remotion/renderer)
export * from './video-gen.feature';
