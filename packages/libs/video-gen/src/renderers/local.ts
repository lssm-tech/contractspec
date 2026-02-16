// ---------------------------------------------------------------------------
// Local Renderer -- Wraps @remotion/renderer for local video rendering
// ---------------------------------------------------------------------------
// This module is designed to be imported only in Node.js environments.
// The @remotion/renderer dependency is a devDependency / optional.
// ---------------------------------------------------------------------------

import type {
  RenderConfig,
  RenderResult,
  VideoProject,
  VideoProvider,
} from '@contractspec/lib.contracts-integrations/integrations/providers/video';
import { getAllFormatVariants } from '../design/layouts';
import { defaultRenderConfig, resolveRenderConfig } from './config';

/**
 * Local video renderer using @remotion/renderer.
 *
 * Usage:
 * ```ts
 * const renderer = new LocalRenderer({ entryPoint: './src/remotion/index.ts' });
 * const result = await renderer.render(project, { outputPath: 'out/video.mp4' });
 * ```
 */
export class LocalRenderer implements VideoProvider {
  private readonly entryPoint: string;

  constructor(options: { entryPoint: string }) {
    this.entryPoint = options.entryPoint;
  }

  async render(
    project: VideoProject,
    config: RenderConfig
  ): Promise<RenderResult> {
    const resolved = resolveRenderConfig(config);

    // Dynamically import Remotion packages (Node.js only)
    const { bundle } = await import('@remotion/bundler');
    const { renderMedia, selectComposition } =
      await import('@remotion/renderer');

    // Bundle the Remotion project
    const bundleLocation = await bundle({
      entryPoint: this.entryPoint,
    });

    // For single-composition projects, render the first scene's composition
    // For multi-scene projects, this would use a Sequence-based master composition
    const mainCompositionId =
      project.scenes.length === 1 ? project.scenes[0]!.compositionId : 'Master';

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: mainCompositionId,
      inputProps: {
        project,
      },
    });

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: resolved.codec as 'h264' | 'h265',
      outputLocation: resolved.outputPath,
      inputProps: { project },
      ...(resolved.crf && { crf: resolved.crf }),
      ...(resolved.concurrency && {
        concurrency: resolved.concurrency,
      }),
    });

    const result: RenderResult = {
      outputPath: resolved.outputPath,
      format: resolved.outputFormat ?? defaultRenderConfig.outputFormat,
      codec: resolved.codec ?? defaultRenderConfig.codec,
      durationSeconds: project.totalDurationInFrames / project.fps,
      fileSizeBytes: 0, // Would need fs.stat in a real impl
      dimensions: {
        width: project.format.width,
        height: project.format.height,
      },
    };

    // Auto-generate format variants if requested
    if (config.autoVariants) {
      const variants = getAllFormatVariants().filter(
        (f) => f.type !== project.format.type
      );

      const variantResults: RenderResult[] = [];

      for (const variantFormat of variants) {
        const variantPath = resolved.outputPath.replace(
          /(\.[^.]+)$/,
          `-${variantFormat.type}$1`
        );

        const variantProject: VideoProject = {
          ...project,
          format: variantFormat,
        };

        const variantComposition = await selectComposition({
          serveUrl: bundleLocation,
          id: mainCompositionId,
          inputProps: { project: variantProject },
        });

        await renderMedia({
          composition: variantComposition,
          serveUrl: bundleLocation,
          codec: resolved.codec as 'h264' | 'h265',
          outputLocation: variantPath,
          inputProps: { project: variantProject },
          ...(resolved.crf && { crf: resolved.crf }),
        });

        variantResults.push({
          outputPath: variantPath,
          format: resolved.outputFormat ?? defaultRenderConfig.outputFormat,
          codec: resolved.codec ?? defaultRenderConfig.codec,
          durationSeconds: project.totalDurationInFrames / project.fps,
          fileSizeBytes: 0,
          dimensions: {
            width: variantFormat.width,
            height: variantFormat.height,
          },
        });
      }

      result.variants = variantResults;
    }

    return result;
  }
}
