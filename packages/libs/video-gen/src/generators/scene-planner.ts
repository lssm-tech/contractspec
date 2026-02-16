// ---------------------------------------------------------------------------
// ScenePlanner -- Break a VideoBrief into concrete scenes
// ---------------------------------------------------------------------------
// Follows the content-gen generator pattern: optional LLM, deterministic fallback.
// ---------------------------------------------------------------------------

import type {
  LLMProvider,
  LLMMessage,
} from '@lssm/lib.contracts/integrations/providers/llm';
import type { VideoScene } from '@lssm/lib.contracts/integrations/providers/video';
import type { VideoBrief, ScenePlan, PlannedScene } from '../types';
import { videoDurations } from '../design/motion';
import { DEFAULT_FPS } from '../design/layouts';

export interface ScenePlannerOptions {
  llm?: LLMProvider;
  model?: string;
  temperature?: number;
  fps?: number;
}

export class ScenePlanner {
  private readonly llm?: LLMProvider;
  private readonly model?: string;
  private readonly temperature: number;
  private readonly fps: number;

  constructor(options?: ScenePlannerOptions) {
    this.llm = options?.llm;
    this.model = options?.model;
    this.temperature = options?.temperature ?? 0.3;
    this.fps = options?.fps ?? DEFAULT_FPS;
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
    const scenes: PlannedScene[] = [];
    const fps = this.fps;

    // Scene 1: Hook / title (3 seconds)
    scenes.push({
      compositionId: 'SocialClip',
      props: {
        hook: content.title,
        message: content.summary,
        points: content.solutions.slice(0, 3),
        cta: content.callToAction ?? 'Learn more',
      },
      durationInFrames: 3 * fps,
      narrationText: `${content.title}. ${content.summary}`,
    });

    // Scene 2: Problem statement (4 seconds)
    if (content.problems.length > 0) {
      scenes.push({
        compositionId: 'SocialClip',
        props: {
          hook: 'The Problem',
          message: content.problems[0] ?? '',
          points: content.problems.slice(1, 4),
        },
        durationInFrames: 4 * fps,
        narrationText: `The problem: ${content.problems.join('. ')}`,
      });
    }

    // Scene 3: Solution (5 seconds)
    if (content.solutions.length > 0) {
      scenes.push({
        compositionId: 'SocialClip',
        props: {
          hook: 'The Solution',
          message: content.solutions[0] ?? '',
          points: content.solutions.slice(1, 4),
        },
        durationInFrames: 5 * fps,
        narrationText: `The solution: ${content.solutions.join('. ')}`,
      });
    }

    // Scene 4: Proof / metrics (3 seconds, if available)
    if (content.metrics && content.metrics.length > 0) {
      scenes.push({
        compositionId: 'SocialClip',
        props: {
          hook: 'Results',
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
    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: `You are a video scene planner for ContractSpec marketing/documentation videos.
Given a content brief, break it into video scenes.

Each scene must have:
- compositionId: one of "ApiOverview", "SocialClip", "TerminalDemo"
- props: the input props for that composition (see type definitions)
- durationInFrames: duration at ${this.fps}fps
- narrationText: what the narrator says during this scene

Return a JSON object with shape:
{
  "scenes": [{ "compositionId": string, "props": object, "durationInFrames": number, "narrationText": string }],
  "narrationScript": string
}

Keep the total duration around ${brief.targetDurationSeconds ?? 30} seconds.
Prioritize clarity and pacing. Each scene should communicate one idea.`,
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

    try {
      const response = await this.llm!.chat(messages, {
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
