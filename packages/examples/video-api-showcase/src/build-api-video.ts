// ---------------------------------------------------------------------------
// Build API Video -- Construct a VideoProject from contract spec metadata
// ---------------------------------------------------------------------------

import type { VideoProject } from '@contractspec/lib.contracts-integrations/integrations/providers/video';
import { VIDEO_FORMATS } from '@contractspec/lib.video-gen/design/layouts';
import { resolveRenderConfig } from '@contractspec/lib.video-gen/renderers/config';
import type { QualityPreset } from '@contractspec/lib.video-gen/renderers/config';
import type { RenderConfig } from '@contractspec/lib.contracts-integrations/integrations/providers/video';
import type { ApiSpecDefinition } from './sample-specs';

const DEFAULT_FPS = 30;
const DEFAULT_DURATION_FRAMES = 450; // 15 seconds

/** Options for building an API showcase video. */
export interface BuildApiVideoOptions {
  /** Duration in frames. Default: 450 (15s at 30fps). */
  durationInFrames?: number;
  /** Tagline shown at the end. */
  tagline?: string;
  /** FPS. Default: 30. */
  fps?: number;
}

/**
 * Build a VideoProject from a contract spec definition.
 *
 * This demonstrates manual project construction using the ApiOverview
 * composition -- useful when you know the exact video structure.
 *
 * @example
 * ```ts
 * import { buildApiVideo } from "@contractspec/example.video-api-showcase/build-api-video";
 * import { createUserSpec } from "@contractspec/example.video-api-showcase/sample-specs";
 *
 * const project = buildApiVideo(createUserSpec);
 * // project.scenes[0].compositionId === "ApiOverview"
 * ```
 */
export function buildApiVideo(
  spec: ApiSpecDefinition,
  options?: BuildApiVideoOptions
): VideoProject {
  const fps = options?.fps ?? DEFAULT_FPS;
  const durationInFrames = options?.durationInFrames ?? DEFAULT_DURATION_FRAMES;

  return {
    id: `api-video-${spec.specName.toLowerCase()}-${Date.now().toString(36)}`,
    scenes: [
      {
        id: 'scene-api-overview',
        compositionId: 'ApiOverview',
        props: {
          specName: spec.specName,
          method: spec.method,
          endpoint: spec.endpoint,
          specCode: spec.specCode,
          generatedOutputs: spec.generatedOutputs,
          tagline: options?.tagline ?? 'One spec. Every surface.',
        },
        durationInFrames,
      },
    ],
    totalDurationInFrames: durationInFrames,
    fps,
    format: VIDEO_FORMATS.landscape,
  };
}

/**
 * Build a render configuration for the API video.
 *
 * Demonstrates using quality presets to configure rendering.
 *
 * @example
 * ```ts
 * const config = buildRenderConfig("out/api-overview.mp4", "high");
 * // config.crf === 12, config.codec === "h264"
 * ```
 */
export function buildRenderConfig(
  outputPath: string,
  preset: QualityPreset = 'standard'
): RenderConfig {
  return resolveRenderConfig({ outputPath }, preset);
}

/**
 * Build video projects for multiple specs at once.
 *
 * @example
 * ```ts
 * import { createUserSpec, listTransactionsSpec } from "./sample-specs";
 *
 * const projects = buildApiVideoSuite([createUserSpec, listTransactionsSpec]);
 * // projects.length === 2
 * ```
 */
export function buildApiVideoSuite(
  specs: ApiSpecDefinition[],
  options?: BuildApiVideoOptions
): VideoProject[] {
  return specs.map((spec) => buildApiVideo(spec, options));
}
