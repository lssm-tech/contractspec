import type { AudioData, AudioFormat } from '../types';

/**
 * Generate silence buffers in various audio formats.
 * Used by AudioAssembler to insert pauses between TTS segments.
 */
export class SilenceGenerator {
  /**
   * Generate a silence buffer of the given duration.
   *
   * @param durationMs - Silence duration in milliseconds
   * @param format - Target audio format
   * @param sampleRateHz - Sample rate (default 44100)
   * @param channels - Number of channels (default 1)
   */
  generate(
    durationMs: number,
    format: AudioFormat = 'wav',
    sampleRateHz = 44100,
    channels: 1 | 2 = 1
  ): AudioData {
    const totalSamples = Math.ceil((sampleRateHz * durationMs) / 1000);
    const bytesPerSample = 2; // 16-bit PCM
    const dataSize = totalSamples * bytesPerSample * channels;

    // Generate raw PCM silence (all zeros)
    const data = new Uint8Array(dataSize);

    return {
      data,
      format,
      sampleRateHz,
      durationMs,
      channels,
    };
  }
}
