/**
 * Voice Activity Detection (VAD) and silence detection for turn-taking.
 *
 * Determines when the user has finished speaking based on audio energy
 * and silence duration thresholds.
 */
export class TurnDetector {
  private readonly silenceThresholdMs: number;
  private readonly energyThreshold: number;
  private silenceStartMs: number | null = null;

  /**
   * @param silenceThresholdMs - Silence duration to trigger end of turn (default 800ms)
   * @param energyThreshold - Minimum audio energy to consider as speech (default 0.01)
   */
  constructor(silenceThresholdMs = 800, energyThreshold = 0.01) {
    this.silenceThresholdMs = silenceThresholdMs;
    this.energyThreshold = energyThreshold;
  }

  /**
   * Process an audio chunk and determine if it contains speech.
   *
   * @param chunk - Raw audio data
   * @param timestampMs - Current timestamp in ms
   * @returns Whether end-of-turn was detected
   */
  processChunk(chunk: Uint8Array, timestampMs: number): boolean {
    const energy = this.calculateEnergy(chunk);
    const isSpeech = energy > this.energyThreshold;

    if (isSpeech) {
      this.silenceStartMs = null;
      return false;
    }

    // Silence detected
    if (this.silenceStartMs === null) {
      this.silenceStartMs = timestampMs;
    }

    const silenceDurationMs = timestampMs - this.silenceStartMs;
    return silenceDurationMs >= this.silenceThresholdMs;
  }

  /** Reset the detector state */
  reset(): void {
    this.silenceStartMs = null;
  }

  /**
   * Calculate RMS energy of an audio chunk.
   * Assumes 16-bit PCM audio.
   */
  private calculateEnergy(chunk: Uint8Array): number {
    if (chunk.length < 2) return 0;

    let sum = 0;
    const sampleCount = Math.floor(chunk.length / 2);

    for (let i = 0; i < chunk.length - 1; i += 2) {
      // Convert two bytes to 16-bit signed integer (little-endian)
      const low = chunk[i] ?? 0;
      const high = chunk[i + 1] ?? 0;
      const sample = ((low | (high << 8)) << 16) >> 16;
      const normalized = sample / 32768;
      sum += normalized * normalized;
    }

    return Math.sqrt(sum / sampleCount);
  }
}
