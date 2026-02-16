// ---------------------------------------------------------------------------
// Build Tutorial Video -- Construct a multi-scene VideoProject from CLI tutorials
// ---------------------------------------------------------------------------

import type { VideoProject } from '@contractspec/lib.contracts-integrations/integrations/providers/video';
import { VIDEO_FORMATS } from '@contractspec/lib.video-gen/design/layouts';
import type { CliTutorial } from './sample-tutorials';

const DEFAULT_FPS = 30;
const DEFAULT_SCENE_DURATION_SECONDS = 12;

/** Options for building a tutorial video. */
export interface BuildTutorialOptions {
  /** Duration per scene in seconds. Default: 12. */
  sceneDurationSeconds?: number;
  /** FPS. Default: 30. */
  fps?: number;
  /** Terminal prompt string. Default: "$ ". */
  prompt?: string;
}

/**
 * Build a VideoProject from a single CLI tutorial.
 *
 * Creates a single-scene project using the TerminalDemo composition.
 *
 * @example
 * ```ts
 * import { buildTutorialVideo } from "@contractspec/example.video-docs-terminal/build-tutorial";
 * import { initTutorial } from "@contractspec/example.video-docs-terminal/sample-tutorials";
 *
 * const project = buildTutorialVideo(initTutorial);
 * // project.scenes[0].compositionId === "TerminalDemo"
 * ```
 */
export function buildTutorialVideo(
  tutorial: CliTutorial,
  options?: BuildTutorialOptions
): VideoProject {
  const fps = options?.fps ?? DEFAULT_FPS;
  const sceneDuration =
    options?.sceneDurationSeconds ?? DEFAULT_SCENE_DURATION_SECONDS;
  const durationInFrames = sceneDuration * fps;

  return {
    id: `tutorial-${tutorial.id}-${Date.now().toString(36)}`,
    scenes: [
      {
        id: `scene-${tutorial.id}`,
        compositionId: 'TerminalDemo',
        props: {
          title: tutorial.title,
          subtitle: tutorial.subtitle,
          lines: tutorial.lines,
          terminalTitle: tutorial.terminalTitle,
          prompt: options?.prompt ?? '$ ',
          summary: tutorial.summary,
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
 * Build a multi-scene VideoProject from an array of CLI tutorials.
 *
 * Each tutorial becomes one scene in the project, played in order.
 * Useful for creating a comprehensive CLI walkthrough video covering
 * init → build → validate → deploy.
 *
 * @example
 * ```ts
 * import { buildTutorialSuite } from "@contractspec/example.video-docs-terminal/build-tutorial";
 * import { allTutorials } from "@contractspec/example.video-docs-terminal/sample-tutorials";
 *
 * const project = buildTutorialSuite(allTutorials);
 * // project.scenes.length === 4
 * // Total: ~48 seconds (4 × 12s)
 * ```
 */
export function buildTutorialSuite(
  tutorials: CliTutorial[],
  options?: BuildTutorialOptions
): VideoProject {
  const fps = options?.fps ?? DEFAULT_FPS;
  const sceneDuration =
    options?.sceneDurationSeconds ?? DEFAULT_SCENE_DURATION_SECONDS;
  const durationInFrames = sceneDuration * fps;

  const scenes = tutorials.map((tutorial) => ({
    id: `scene-${tutorial.id}`,
    compositionId: 'TerminalDemo',
    props: {
      title: tutorial.title,
      subtitle: tutorial.subtitle,
      lines: tutorial.lines,
      terminalTitle: tutorial.terminalTitle,
      prompt: options?.prompt ?? '$ ',
      summary: tutorial.summary,
    },
    durationInFrames,
  }));

  const totalDurationInFrames = scenes.reduce(
    (sum, s) => sum + s.durationInFrames,
    0
  );

  return {
    id: `tutorial-suite-${Date.now().toString(36)}`,
    scenes,
    totalDurationInFrames,
    fps,
    format: VIDEO_FORMATS.landscape,
  };
}
