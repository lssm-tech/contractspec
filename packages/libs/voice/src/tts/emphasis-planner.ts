import type { LLMProvider, VoicePacingDirective } from '../types';
import type {
  ModelSelector,
  ModelSelectionContext,
} from '@contractspec/lib.ai-providers/selector-types';
import type { TTSScriptSegment } from './types';
import { PaceAnalyzer } from './pace-analyzer';

export interface EmphasisPlannerOptions {
  llm?: LLMProvider;
  model?: string;
  modelSelector?: ModelSelector;
  selectionContext?: ModelSelectionContext;
}

/**
 * Plan emphasis and tone per segment.
 *
 * With LLM: requests fine-grained tone/emphasis analysis.
 * Without LLM: falls back to PaceAnalyzer's content-type mapping.
 */
export class EmphasisPlanner {
  private readonly llm?: LLMProvider;
  private readonly model?: string;
  private readonly modelSelector?: ModelSelector;
  private readonly selectionContext?: ModelSelectionContext;
  private readonly paceAnalyzer: PaceAnalyzer;

  constructor(options?: EmphasisPlannerOptions) {
    this.llm = options?.llm;
    this.model = options?.model;
    this.modelSelector = options?.modelSelector;
    this.selectionContext = options?.selectionContext;
    this.paceAnalyzer = new PaceAnalyzer();
  }

  /**
   * Plan emphasis and tone directives for segments.
   *
   * Falls back to deterministic mapping if LLM is unavailable.
   */
  async plan(
    segments: TTSScriptSegment[],
    baseRate = 1.0
  ): Promise<VoicePacingDirective[]> {
    if (!this.llm) {
      return this.paceAnalyzer.analyze(segments, baseRate);
    }

    try {
      return await this.planWithLlm(segments, baseRate);
    } catch {
      // LLM failed, fall back to deterministic
      return this.paceAnalyzer.analyze(segments, baseRate);
    }
  }

  private async resolveModel(): Promise<string | undefined> {
    if (this.model) return this.model;
    if (this.modelSelector) {
      const ctx = this.selectionContext ?? {
        taskDimension: 'reasoning' as const,
      };
      const result = await this.modelSelector.select(ctx);
      return result.modelId;
    }
    return undefined;
  }

  private async planWithLlm(
    segments: TTSScriptSegment[],
    baseRate: number
  ): Promise<VoicePacingDirective[]> {
    if (!this.llm) {
      return this.paceAnalyzer.analyze(segments, baseRate);
    }

    const model = await this.resolveModel();
    const response = await this.llm.chat(
      [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: [
                'You are a voice director planning emphasis and pacing for TTS narration.',
                'For each segment, return a JSON array of directives.',
                'Each directive has: sceneId, rate (0.7-1.3), emphasis (reduced|normal|strong),',
                'tone (neutral|urgent|excited|calm|authoritative), leadingSilenceMs, trailingSilenceMs.',
                'Return ONLY a JSON array, no other text.',
              ].join('\n'),
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                segments.map((s) => ({
                  sceneId: s.sceneId,
                  text: s.text,
                  contentType: s.contentType,
                }))
              ),
            },
          ],
        },
      ],
      { model, temperature: 0.3, responseFormat: 'json' }
    );

    const text = response.message.content.find((p) => p.type === 'text');
    if (!text || text.type !== 'text') {
      return this.paceAnalyzer.analyze(segments, baseRate);
    }

    const parsed = JSON.parse(text.text) as VoicePacingDirective[];
    return parsed.map((d) => ({
      ...d,
      rate: d.rate * baseRate,
    }));
  }
}
