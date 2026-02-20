import type { VoiceTimingMap } from '../types';

interface NegotiationResult {
  /** Updated timing map with negotiated durations */
  timingMap: VoiceTimingMap;
  /** Per-scene negotiation details */
  adjustments: SceneAdjustment[];
}

interface SceneAdjustment {
  sceneId: string;
  originalSceneDurationInFrames: number;
  voiceDurationInFrames: number;
  action: 'no_change' | 'extend_scene' | 'pad_silence' | 'suggest_rate_change';
  suggestedRate?: number;
  finalSceneDurationInFrames: number;
}

/**
 * Negotiate duration between voice audio and scene durations.
 *
 * One-pass duration balancing:
 * - Voice fits scene -> no change
 * - Voice > 110% of scene -> suggest rate increase (cap 1.3x), extend scene
 * - Voice < 70% of scene -> suggest rate decrease (floor 0.8x), pad silence
 */
export class DurationNegotiator {
  private static readonly UPPER_THRESHOLD = 1.1;
  private static readonly LOWER_THRESHOLD = 0.7;
  private static readonly MAX_RATE = 1.3;
  private static readonly MIN_RATE = 0.8;

  /**
   * Negotiate voice-vs-scene durations.
   *
   * @param timingMap - Voice timing map with per-segment durations
   * @param sceneDurations - Map of sceneId -> original scene duration in frames
   */
  negotiate(
    timingMap: VoiceTimingMap,
    sceneDurations: Map<string, number>
  ): NegotiationResult {
    const adjustments: SceneAdjustment[] = [];
    const updatedSegments = timingMap.segments.map((seg) => {
      const originalSceneDuration = sceneDurations.get(seg.sceneId);
      if (originalSceneDuration === undefined) {
        adjustments.push({
          sceneId: seg.sceneId,
          originalSceneDurationInFrames: seg.recommendedSceneDurationInFrames,
          voiceDurationInFrames: seg.durationInFrames,
          action: 'no_change',
          finalSceneDurationInFrames: seg.recommendedSceneDurationInFrames,
        });
        return seg;
      }

      const ratio = seg.durationInFrames / originalSceneDuration;

      if (ratio > DurationNegotiator.UPPER_THRESHOLD) {
        // Voice too long: extend scene, suggest faster rate
        const suggestedRate = Math.min(ratio, DurationNegotiator.MAX_RATE);
        adjustments.push({
          sceneId: seg.sceneId,
          originalSceneDurationInFrames: originalSceneDuration,
          voiceDurationInFrames: seg.durationInFrames,
          action:
            ratio > DurationNegotiator.MAX_RATE
              ? 'extend_scene'
              : 'suggest_rate_change',
          suggestedRate,
          finalSceneDurationInFrames: seg.recommendedSceneDurationInFrames,
        });
        return seg;
      }

      if (ratio < DurationNegotiator.LOWER_THRESHOLD) {
        // Voice too short: pad silence, suggest slower rate
        const suggestedRate = Math.max(ratio, DurationNegotiator.MIN_RATE);
        adjustments.push({
          sceneId: seg.sceneId,
          originalSceneDurationInFrames: originalSceneDuration,
          voiceDurationInFrames: seg.durationInFrames,
          action: 'pad_silence',
          suggestedRate,
          finalSceneDurationInFrames: originalSceneDuration,
        });
        return {
          ...seg,
          recommendedSceneDurationInFrames: originalSceneDuration,
        };
      }

      // Voice fits scene
      adjustments.push({
        sceneId: seg.sceneId,
        originalSceneDurationInFrames: originalSceneDuration,
        voiceDurationInFrames: seg.durationInFrames,
        action: 'no_change',
        finalSceneDurationInFrames: seg.recommendedSceneDurationInFrames,
      });
      return seg;
    });

    return {
      timingMap: {
        ...timingMap,
        segments: updatedSegments,
      },
      adjustments,
    };
  }
}
