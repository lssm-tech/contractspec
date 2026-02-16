// ---------------------------------------------------------------------------
// Generate Marketing Clip -- End-to-end video generation from a content brief
// ---------------------------------------------------------------------------

import type { ContentBrief } from '@contractspec/lib.content-gen/types';
import { VideoGenerator } from '@contractspec/lib.video-gen/generators';
import { VIDEO_FORMATS } from '@contractspec/lib.video-gen/design/layouts';
import type {
  VideoBrief,
  VideoFormat,
} from '@contractspec/lib.video-gen/types';
import type { VideoProject } from '@contractspec/lib.video-gen/types';

/** Supported social format keys. */
export type SocialFormat = 'landscape' | 'square' | 'portrait';

const FORMAT_MAP: Record<SocialFormat, VideoFormat> = {
  landscape: VIDEO_FORMATS.landscape,
  square: VIDEO_FORMATS.square,
  portrait: VIDEO_FORMATS.portrait,
};

/**
 * Generate a marketing video project from a content brief.
 *
 * This is the main handler demonstrating the deterministic video-gen pipeline:
 * 1. Wrap the ContentBrief in a VideoBrief with format + duration config
 * 2. Use VideoGenerator (no LLM) to plan scenes and assemble the project
 * 3. Return the VideoProject (scene graph ready for rendering)
 *
 * @example
 * ```ts
 * import { generateMarketingClip } from "@contractspec/example.video-marketing-clip/generate-clip";
 * import { productLaunchBrief } from "@contractspec/example.video-marketing-clip/briefs";
 *
 * const project = await generateMarketingClip(productLaunchBrief, "landscape");
 * console.log(project.scenes.length); // 5
 * ```
 */
export async function generateMarketingClip(
  brief: ContentBrief,
  format: SocialFormat = 'landscape',
  targetDurationSeconds?: number
): Promise<VideoProject> {
  const generator = new VideoGenerator({ fps: 30 });

  const videoBrief: VideoBrief = {
    content: brief,
    format: FORMAT_MAP[format],
    targetDurationSeconds,
  };

  return generator.generate(videoBrief);
}

/**
 * Generate video projects for all three social formats from a single brief.
 *
 * Returns landscape, square, and portrait variants -- useful for
 * cross-platform social media campaigns.
 *
 * @example
 * ```ts
 * const variants = await generateAllFormats(productLaunchBrief, 30);
 * // variants.landscape, variants.square, variants.portrait
 * ```
 */
export async function generateAllFormats(
  brief: ContentBrief,
  targetDurationSeconds?: number
): Promise<Record<SocialFormat, VideoProject>> {
  const [landscape, square, portrait] = await Promise.all([
    generateMarketingClip(brief, 'landscape', targetDurationSeconds),
    generateMarketingClip(brief, 'square', targetDurationSeconds),
    generateMarketingClip(brief, 'portrait', targetDurationSeconds),
  ]);

  return { landscape, square, portrait };
}
