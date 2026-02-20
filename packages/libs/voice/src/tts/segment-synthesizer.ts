import type { TTSProvider, VoicePacingDirective } from '../types';
import type {
  SynthesizedSegment,
  TTSScriptSegment,
  TTSVoiceConfig,
} from './types';

/**
 * Synthesize individual script segments via TTSProvider.
 *
 * Applies pacing directives (rate, emphasis) to each synthesis call.
 * Runs segments in parallel via Promise.all().
 */
export class SegmentSynthesizer {
  private readonly tts: TTSProvider;

  constructor(tts: TTSProvider) {
    this.tts = tts;
  }

  /**
   * Synthesize all segments in parallel.
   *
   * @param segments - Script segments to synthesize
   * @param voice - Voice configuration
   * @param directives - Pacing directives per segment (matched by sceneId)
   */
  async synthesizeAll(
    segments: TTSScriptSegment[],
    voice: TTSVoiceConfig,
    directives: VoicePacingDirective[]
  ): Promise<SynthesizedSegment[]> {
    const directiveMap = new Map(directives.map((d) => [d.sceneId, d]));

    const results = await Promise.all(
      segments.map((segment) =>
        this.synthesizeOne(segment, voice, directiveMap.get(segment.sceneId))
      )
    );

    return results;
  }

  private async synthesizeOne(
    segment: TTSScriptSegment,
    voice: TTSVoiceConfig,
    directive?: VoicePacingDirective
  ): Promise<SynthesizedSegment> {
    const result = await this.tts.synthesize({
      text: segment.text,
      voiceId: voice.voiceId,
      language: voice.language,
      style: voice.style,
      stability: voice.stability,
      rate: directive?.rate,
      emphasis: directive?.emphasis,
    });

    return {
      sceneId: segment.sceneId,
      audio: result.audio,
      durationMs: result.audio.durationMs ?? 0,
      wordTimings: result.wordTimings?.map((wt) => ({
        word: wt.word,
        startMs: wt.startMs,
        endMs: wt.endMs,
      })),
    };
  }
}
