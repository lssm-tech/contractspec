import type { AudioData } from '../types';

/**
 * Concatenate multiple AudioData segments into a single buffer.
 *
 * All segments must share the same format and sample rate.
 * Use FormatConverter first if segments have mixed formats.
 */
export class AudioConcatenator {
  /**
   * Concatenate audio segments in order.
   *
   * @throws If segments have mismatched formats or sample rates
   */
  concatenate(segments: AudioData[]): AudioData {
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

    if (segments.length === 1) {
      return { ...firstSegment };
    }

    const referenceFormat = firstSegment.format;
    const referenceSampleRate = firstSegment.sampleRateHz;
    const referenceChannels = firstSegment.channels ?? 1;

    for (const seg of segments) {
      if (seg.format !== referenceFormat) {
        throw new Error(
          `Format mismatch: expected ${referenceFormat}, got ${seg.format}`
        );
      }
      if (seg.sampleRateHz !== referenceSampleRate) {
        throw new Error(
          `Sample rate mismatch: expected ${referenceSampleRate}, got ${seg.sampleRateHz}`
        );
      }
    }

    const totalBytes = segments.reduce((sum, s) => sum + s.data.length, 0);
    const combined = new Uint8Array(totalBytes);

    let offset = 0;
    for (const seg of segments) {
      combined.set(seg.data, offset);
      offset += seg.data.length;
    }

    const totalDurationMs = segments.reduce(
      (sum, s) => sum + (s.durationMs ?? 0),
      0
    );

    return {
      data: combined,
      format: referenceFormat,
      sampleRateHz: referenceSampleRate,
      durationMs: totalDurationMs,
      channels: referenceChannels,
    };
  }
}
