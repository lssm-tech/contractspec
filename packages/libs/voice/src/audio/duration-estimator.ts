/**
 * Estimate speech duration from text.
 *
 * Uses word count and an assumed speaking rate.
 * This is a deterministic fallback -- actual duration comes from TTS provider.
 */
export class DurationEstimator {
  /** Words per minute at normal speaking rate */
  private static readonly DEFAULT_WPM = 150;

  /**
   * Estimate speaking duration in seconds from text.
   *
   * @param text - The text to estimate duration for
   * @param wordsPerMinute - Speaking rate (default 150 WPM)
   */
  estimateSeconds(text: string, wordsPerMinute?: number): number {
    const wpm = wordsPerMinute ?? DurationEstimator.DEFAULT_WPM;
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return Math.ceil((wordCount / wpm) * 60);
  }

  /**
   * Estimate speaking duration in milliseconds from text.
   *
   * @param text - The text to estimate duration for
   * @param wordsPerMinute - Speaking rate (default 150 WPM)
   */
  estimateMs(text: string, wordsPerMinute?: number): number {
    const wpm = wordsPerMinute ?? DurationEstimator.DEFAULT_WPM;
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return Math.ceil((wordCount / wpm) * 60 * 1000);
  }

  /**
   * Estimate word count from duration.
   *
   * @param durationSeconds - Duration in seconds
   * @param wordsPerMinute - Speaking rate (default 150 WPM)
   */
  estimateWordCount(durationSeconds: number, wordsPerMinute?: number): number {
    const wpm = wordsPerMinute ?? DurationEstimator.DEFAULT_WPM;
    return Math.round((durationSeconds / 60) * wpm);
  }
}
