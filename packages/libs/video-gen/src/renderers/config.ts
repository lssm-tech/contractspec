// ---------------------------------------------------------------------------
// Render Configuration Defaults
// ---------------------------------------------------------------------------

import type {
  RenderConfig,
  VideoCodec,
  VideoOutputFormat,
} from '@lssm/lib.contracts/integrations/providers/video';

/** Default render configuration for local rendering. */
export const defaultRenderConfig: Required<
  Pick<RenderConfig, 'codec' | 'outputFormat' | 'crf' | 'pixelFormat'>
> = {
  codec: 'h264',
  outputFormat: 'mp4',
  crf: 18,
  pixelFormat: 'yuv420p',
};

/** Codec-to-output-format mapping. */
export const codecFormatMap: Record<VideoCodec, VideoOutputFormat> = {
  h264: 'mp4',
  h265: 'mp4',
  vp8: 'webm',
  vp9: 'webm',
};

/** Quality presets. */
export const qualityPresets = {
  /** Fastest render, lower quality (previews) */
  draft: { crf: 28, concurrency: 1 },
  /** Balanced quality/speed */
  standard: { crf: 18, concurrency: undefined },
  /** Highest quality (final output) */
  high: { crf: 12, concurrency: undefined },
} as const;

export type QualityPreset = keyof typeof qualityPresets;

/**
 * Merge user config with defaults.
 */
export function resolveRenderConfig(
  userConfig: RenderConfig,
  preset?: QualityPreset
): RenderConfig {
  const presetValues = preset ? qualityPresets[preset] : {};
  return {
    ...defaultRenderConfig,
    ...presetValues,
    ...userConfig,
  };
}
