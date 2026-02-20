import type { AudioData } from '../types';

/**
 * Split long audio into processable chunks.
 *
 * Useful for providers with maximum audio length limits.
 * Splits at silence boundaries when possible (approximated by byte position).
 */
export class SegmentSplitter {
  /** Default maximum chunk duration in ms (5 minutes) */
  private static readonly DEFAULT_MAX_CHUNK_MS = 5 * 60 * 1000;

  /**
   * Split audio into chunks of at most maxChunkMs duration.
   *
   * @param audio - Input audio data
   * @param maxChunkMs - Maximum chunk duration in milliseconds
   */
  split(
    audio: AudioData,
    maxChunkMs: number = SegmentSplitter.DEFAULT_MAX_CHUNK_MS
  ): AudioData[] {
    const totalDurationMs = audio.durationMs ?? this.estimateDurationMs(audio);

    if (totalDurationMs <= maxChunkMs) {
      return [audio];
    }

    const chunks: AudioData[] = [];
    const bytesPerMs = audio.data.length / Math.max(totalDurationMs, 1);

    let offsetMs = 0;
    while (offsetMs < totalDurationMs) {
      const chunkDurationMs = Math.min(maxChunkMs, totalDurationMs - offsetMs);
      const startByte = Math.floor(offsetMs * bytesPerMs);
      const endByte = Math.floor((offsetMs + chunkDurationMs) * bytesPerMs);

      chunks.push({
        data: audio.data.slice(startByte, endByte),
        format: audio.format,
        sampleRateHz: audio.sampleRateHz,
        durationMs: chunkDurationMs,
        channels: audio.channels,
      });

      offsetMs += chunkDurationMs;
    }

    return chunks;
  }

  private estimateDurationMs(audio: AudioData): number {
    const bytesPerSample = 2; // 16-bit PCM assumption
    const channels = audio.channels ?? 1;
    const totalSamples = audio.data.length / (bytesPerSample * channels);
    return Math.ceil((totalSamples / audio.sampleRateHz) * 1000);
  }
}
