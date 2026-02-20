import type { AudioData, VoicePacingDirective } from '../types';
import type { SynthesizedSegment } from './types';
import { AudioConcatenator } from '../audio/audio-concatenator';
import { SilenceGenerator } from '../audio/silence-generator';

/**
 * Assemble synthesized segments into a single audio track.
 *
 * Inserts silence between segments based on pacing directives.
 */
export class AudioAssembler {
  private readonly concatenator = new AudioConcatenator();
  private readonly silenceGenerator = new SilenceGenerator();

  /**
   * Assemble segments with silence padding.
   *
   * @param segments - Synthesized audio segments
   * @param directives - Pacing directives for silence timing
   * @param defaultPauseMs - Default pause between segments (default 500ms)
   */
  assemble(
    segments: SynthesizedSegment[],
    directives: VoicePacingDirective[],
    defaultPauseMs = 500
  ): AudioData {
    if (segments.length === 0) {
      return {
        data: new Uint8Array(0),
        format: 'wav',
        sampleRateHz: 44100,
        durationMs: 0,
        channels: 1,
      };
    }

    const [firstSegment] = segments;
    if (!firstSegment) {
      return {
        data: new Uint8Array(0),
        format: 'wav',
        sampleRateHz: 44100,
        durationMs: 0,
        channels: 1,
      };
    }

    const directiveMap = new Map(directives.map((d) => [d.sceneId, d]));
    const reference = firstSegment.audio;
    const parts: AudioData[] = [];

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (!segment) {
        continue;
      }
      const directive = directiveMap.get(segment.sceneId);

      // Leading silence
      const leadingSilenceMs = directive?.leadingSilenceMs ?? 0;
      if (leadingSilenceMs > 0) {
        parts.push(
          this.silenceGenerator.generate(
            leadingSilenceMs,
            reference.format,
            reference.sampleRateHz,
            reference.channels ?? 1
          )
        );
      }

      // Audio segment
      parts.push(segment.audio);

      // Trailing silence
      const trailingSilenceMs =
        directive?.trailingSilenceMs ??
        (i < segments.length - 1 ? defaultPauseMs : 0);
      if (trailingSilenceMs > 0) {
        parts.push(
          this.silenceGenerator.generate(
            trailingSilenceMs,
            reference.format,
            reference.sampleRateHz,
            reference.channels ?? 1
          )
        );
      }
    }

    return this.concatenator.concatenate(parts);
  }
}
