import type { VoicePacingDirective } from '../types';
import type { TTSScriptSegment } from './types';

type ContentType = TTSScriptSegment['contentType'];
type Tone = VoicePacingDirective['tone'];
type Emphasis = VoicePacingDirective['emphasis'];

interface PacingDefaults {
  rate: number;
  emphasis: Emphasis;
  tone: Tone;
  leadingSilenceMs: number;
  trailingSilenceMs: number;
}

const CONTENT_TYPE_PACING: Record<ContentType, PacingDefaults> = {
  intro: {
    rate: 0.95,
    emphasis: 'normal',
    tone: 'authoritative',
    leadingSilenceMs: 0,
    trailingSilenceMs: 500,
  },
  problem: {
    rate: 0.9,
    emphasis: 'strong',
    tone: 'urgent',
    leadingSilenceMs: 300,
    trailingSilenceMs: 500,
  },
  solution: {
    rate: 1.0,
    emphasis: 'normal',
    tone: 'calm',
    leadingSilenceMs: 300,
    trailingSilenceMs: 500,
  },
  metric: {
    rate: 0.85,
    emphasis: 'strong',
    tone: 'excited',
    leadingSilenceMs: 300,
    trailingSilenceMs: 600,
  },
  cta: {
    rate: 0.9,
    emphasis: 'strong',
    tone: 'authoritative',
    leadingSilenceMs: 400,
    trailingSilenceMs: 0,
  },
  transition: {
    rate: 1.1,
    emphasis: 'reduced',
    tone: 'neutral',
    leadingSilenceMs: 200,
    trailingSilenceMs: 300,
  },
};

/**
 * Analyze content segments and produce pacing directives.
 *
 * Uses a deterministic content-type -> pacing mapping as fallback.
 * When an LLM is provided, can enhance with fine-grained analysis.
 */
export class PaceAnalyzer {
  /**
   * Generate pacing directives for a list of script segments.
   *
   * @param segments - The TTS script segments to analyze
   * @param baseRate - Base rate multiplier applied to all directives
   */
  analyze(
    segments: TTSScriptSegment[],
    baseRate = 1.0
  ): VoicePacingDirective[] {
    return segments.map((segment) => {
      const defaults = CONTENT_TYPE_PACING[segment.contentType];

      return {
        sceneId: segment.sceneId,
        rate: defaults.rate * baseRate,
        emphasis: defaults.emphasis,
        tone: defaults.tone,
        leadingSilenceMs: defaults.leadingSilenceMs,
        trailingSilenceMs: defaults.trailingSilenceMs,
      };
    });
  }

  /** Get the default pacing for a content type */
  getDefaults(contentType: ContentType): PacingDefaults {
    return { ...CONTENT_TYPE_PACING[contentType] };
  }
}
