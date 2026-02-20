// ---------------------------------------------------------------------------
// ScenePlanner -- Break a VideoBrief into concrete scenes
// ---------------------------------------------------------------------------
// Follows the content-gen generator pattern: optional LLM, deterministic fallback.
// ---------------------------------------------------------------------------

import type {
  LLMMessage,
  LLMProvider,
} from '@contractspec/lib.contracts-integrations/integrations/providers/llm';
import type { PlannedScene, ScenePlan, VideoBrief } from '../types';
import { DEFAULT_FPS } from '../design/layouts';
import { createVideoGenI18n } from '../i18n';
import type { VideoGenI18n } from '../i18n';

export interface ScenePlannerOptions {
  llm?: LLMProvider;
  model?: string;
  temperature?: number;
  fps?: number;
  locale?: string;
}

export class ScenePlanner {
  private readonly llm?: LLMProvider;
  private readonly model?: string;
  private readonly temperature: number;
  private readonly fps: number;
  private readonly i18n: VideoGenI18n;

  constructor(options?: ScenePlannerOptions) {
    this.llm = options?.llm;
    this.model = options?.model;
    this.temperature = options?.temperature ?? 0.3;
    this.fps = options?.fps ?? DEFAULT_FPS;
    this.i18n = createVideoGenI18n(options?.locale);
  }

  /**
   * Plan scenes for a video brief.
   * With LLM: produces richer, context-aware scene breakdowns.
   * Without LLM: deterministic template-based planning.
   */
  async plan(brief: VideoBrief): Promise<ScenePlan> {
    if (this.llm) {
      return this.planWithLlm(brief);
    }
    return this.planDeterministic(brief);
  }

  // -- Deterministic planning -----------------------------------------------

  private planDeterministic(brief: VideoBrief): ScenePlan {
    const { content } = brief;
    const { t } = this.i18n;
    const scenes: PlannedScene[] = [];
    const fps = this.fps;

    // Scene 1: Hook / title (3 seconds)
    scenes.push({
      compositionId: 'SocialClip',
      props: {
        hook: content.title,
        message: content.summary,
        points: content.solutions.slice(0, 3),
        cta: content.callToAction ?? t('scene.cta.default'),
      },
      durationInFrames: 3 * fps,
      narrationText: `${content.title}. ${content.summary}`,
    });

    // Scene 2: Problem statement (4 seconds)
    if (content.problems.length > 0) {
      scenes.push({
        compositionId: 'SocialClip',
        props: {
          hook: t('scene.hook.problem'),
          message: content.problems[0] ?? '',
          points: content.problems.slice(1, 4),
        },
        durationInFrames: 4 * fps,
        narrationText: t('scene.narration.problem', {
          content: content.problems.join('. '),
        }),
      });
    }

    // Scene 3: Solution (5 seconds)
    if (content.solutions.length > 0) {
      scenes.push({
        compositionId: 'SocialClip',
        props: {
          hook: t('scene.hook.solution'),
          message: content.solutions[0] ?? '',
          points: content.solutions.slice(1, 4),
        },
        durationInFrames: 5 * fps,
        narrationText: t('scene.narration.solution', {
          content: content.solutions.join('. '),
        }),
      });
    }

    // Scene 4: Proof / metrics (3 seconds, if available)
    if (content.metrics && content.metrics.length > 0) {
      scenes.push({
        compositionId: 'SocialClip',
        props: {
          hook: t('scene.hook.results'),
          message: content.metrics[0] ?? '',
          points: content.metrics.slice(1, 3),
        },
        durationInFrames: 3 * fps,
        narrationText: content.metrics.join('. '),
      });
    }

    // Scene 5: CTA (2 seconds)
    if (content.callToAction) {
      scenes.push({
        compositionId: 'SocialClip',
        props: {
          hook: content.callToAction,
          message: '',
          cta: content.callToAction,
        },
        durationInFrames: 2 * fps,
        narrationText: content.callToAction,
      });
    }

    // Adjust to target duration if specified
    if (brief.targetDurationSeconds) {
      const targetFrames = brief.targetDurationSeconds * fps;
      const currentFrames = scenes.reduce(
        (sum, s) => sum + s.durationInFrames,
        0
      );
      const ratio = targetFrames / currentFrames;

      for (const scene of scenes) {
        scene.durationInFrames = Math.round(scene.durationInFrames * ratio);
      }
    }

    const totalDuration = scenes.reduce(
      (sum, s) => sum + s.durationInFrames,
      0
    );
    const narrationScript = scenes
      .filter((s) => s.narrationText)
      .map((s) => s.narrationText)
      .join(' ');

    return {
      scenes,
      estimatedDurationSeconds: totalDuration / fps,
      narrationScript,
    };
  }

  // -- LLM-enhanced planning ------------------------------------------------

  private async planWithLlm(brief: VideoBrief): Promise<ScenePlan> {
    const { t } = this.i18n;

    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: t('prompt.scenePlanner.system', {
              fps: this.fps,
              targetSeconds: brief.targetDurationSeconds ?? 30,
            }),
          },
        ],
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: JSON.stringify(brief.content),
          },
        ],
      },
    ];

    if (!this.llm) {
      return this.planDeterministic(brief);
    }

    try {
      const response = await this.llm.chat(messages, {
        model: this.model,
        temperature: this.temperature,
        responseFormat: 'json',
      });

      const text = response.message.content.find((p) => p.type === 'text');
      if (!text || text.type !== 'text') {
        return this.planDeterministic(brief);
      }

      const parsed = JSON.parse(text.text) as {
        scenes: PlannedScene[];
        narrationScript: string;
      };

      const totalDuration = parsed.scenes.reduce(
        (sum, s) => sum + s.durationInFrames,
        0
      );

      return {
        scenes: parsed.scenes,
        estimatedDurationSeconds: totalDuration / this.fps,
        narrationScript: parsed.narrationScript,
      };
    } catch {
      // Fallback to deterministic on any LLM failure
      return this.planDeterministic(brief);
    }
  }
}
