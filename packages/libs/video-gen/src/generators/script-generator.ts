// ---------------------------------------------------------------------------
// ScriptGenerator -- Generate narration scripts from content briefs
// ---------------------------------------------------------------------------
// Produces narration text that can be fed to ElevenLabs VoiceProvider.
// Follows the content-gen generator pattern.
// ---------------------------------------------------------------------------

import type {
  LLMProvider,
  LLMMessage,
} from '@lssm/lib.contracts/integrations/providers/llm';
import type { ContentBrief } from '@lssm/lib.content-gen/types';
import type { NarrationConfig } from '@lssm/lib.contracts/integrations/providers/video';

export interface NarrationScript {
  /** Full narration text */
  fullText: string;
  /** Per-scene narration segments */
  segments: NarrationSegment[];
  /** Estimated speaking duration in seconds (at ~150 words/min) */
  estimatedDurationSeconds: number;
  /** Style used */
  style: NarrationConfig['style'];
}

export interface NarrationSegment {
  /** Scene identifier this segment maps to */
  sceneId: string;
  /** Narration text for this segment */
  text: string;
  /** Estimated duration in seconds */
  estimatedDurationSeconds: number;
}

export interface ScriptGeneratorOptions {
  llm?: LLMProvider;
  model?: string;
  temperature?: number;
}

export class ScriptGenerator {
  private readonly llm?: LLMProvider;
  private readonly model?: string;
  private readonly temperature: number;

  constructor(options?: ScriptGeneratorOptions) {
    this.llm = options?.llm;
    this.model = options?.model;
    this.temperature = options?.temperature ?? 0.5;
  }

  /**
   * Generate a narration script from a content brief.
   */
  async generate(
    brief: ContentBrief,
    config?: NarrationConfig
  ): Promise<NarrationScript> {
    const style = config?.style ?? 'professional';

    if (this.llm) {
      return this.generateWithLlm(brief, style);
    }
    return this.generateDeterministic(brief, style);
  }

  // -- Deterministic generation ---------------------------------------------

  private generateDeterministic(
    brief: ContentBrief,
    style: NarrationConfig['style']
  ): NarrationScript {
    const segments: NarrationSegment[] = [];

    // Intro
    const intro = this.formatForStyle(
      `${brief.title}. ${brief.summary}`,
      style
    );
    segments.push({
      sceneId: 'intro',
      text: intro,
      estimatedDurationSeconds: this.estimateDuration(intro),
    });

    // Problems
    if (brief.problems.length > 0) {
      const problemText = this.formatForStyle(
        `The challenge: ${brief.problems.join('. ')}`,
        style
      );
      segments.push({
        sceneId: 'problems',
        text: problemText,
        estimatedDurationSeconds: this.estimateDuration(problemText),
      });
    }

    // Solutions
    if (brief.solutions.length > 0) {
      const solutionText = this.formatForStyle(
        `The solution: ${brief.solutions.join('. ')}`,
        style
      );
      segments.push({
        sceneId: 'solutions',
        text: solutionText,
        estimatedDurationSeconds: this.estimateDuration(solutionText),
      });
    }

    // Metrics
    if (brief.metrics && brief.metrics.length > 0) {
      const metricsText = this.formatForStyle(
        `The results: ${brief.metrics.join('. ')}`,
        style
      );
      segments.push({
        sceneId: 'metrics',
        text: metricsText,
        estimatedDurationSeconds: this.estimateDuration(metricsText),
      });
    }

    // CTA
    if (brief.callToAction) {
      const ctaText = this.formatForStyle(brief.callToAction, style);
      segments.push({
        sceneId: 'cta',
        text: ctaText,
        estimatedDurationSeconds: this.estimateDuration(ctaText),
      });
    }

    const fullText = segments.map((s) => s.text).join(' ');
    const totalDuration = segments.reduce(
      (sum, s) => sum + s.estimatedDurationSeconds,
      0
    );

    return {
      fullText,
      segments,
      estimatedDurationSeconds: totalDuration,
      style,
    };
  }

  // -- LLM-enhanced generation ----------------------------------------------

  private async generateWithLlm(
    brief: ContentBrief,
    style: NarrationConfig['style']
  ): Promise<NarrationScript> {
    const styleGuide = {
      professional:
        'Use a clear, authoritative, professional tone. Be concise and direct.',
      casual:
        'Use a friendly, conversational tone. Be approachable and relatable.',
      technical: 'Use precise technical language. Be detailed and accurate.',
    };

    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: `You are a video narration script writer.
Write a narration script for a short video (30-60 seconds).
${styleGuide[style ?? 'professional']}

Return JSON with shape:
{
  "segments": [{ "sceneId": string, "text": string }],
  "fullText": string
}

Scene IDs should be: "intro", "problems", "solutions", "metrics", "cta".
Only include segments that are relevant to the brief content.`,
          },
        ],
      },
      {
        role: 'user',
        content: [{ type: 'text', text: JSON.stringify(brief) }],
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
        return this.generateDeterministic(brief, style);
      }

      const parsed = JSON.parse(text.text) as {
        segments: { sceneId: string; text: string }[];
        fullText: string;
      };

      const segments: NarrationSegment[] = parsed.segments.map((s) => ({
        sceneId: s.sceneId,
        text: s.text,
        estimatedDurationSeconds: this.estimateDuration(s.text),
      }));

      return {
        fullText: parsed.fullText,
        segments,
        estimatedDurationSeconds: segments.reduce(
          (sum, s) => sum + s.estimatedDurationSeconds,
          0
        ),
        style,
      };
    } catch {
      return this.generateDeterministic(brief, style);
    }
  }

  // -- Helpers --------------------------------------------------------------

  /**
   * Adjust text tone based on style.
   * In the deterministic path, this is a simple pass-through.
   * The LLM path handles style natively.
   */
  private formatForStyle(
    text: string,
    _style: NarrationConfig['style']
  ): string {
    // In deterministic mode, the text is already composed from the brief.
    // Style adjustments would require an LLM. Return as-is.
    return text;
  }

  /**
   * Estimate speaking duration based on word count.
   * Average speaking rate: ~150 words per minute.
   */
  private estimateDuration(text: string): number {
    const wordCount = text.split(/\s+/).length;
    return Math.ceil((wordCount / 150) * 60);
  }
}
