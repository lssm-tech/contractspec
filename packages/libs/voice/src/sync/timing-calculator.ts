import type { VoiceTimingMap, WordTiming } from '../types';
import type { SynthesizedSegment } from '../tts/types';

/**
 * Calculate timing maps from synthesized segments.
 *
 * Converts SynthesizedSegment[] into a VoiceTimingMap with frame calculations.
 */
export class TimingCalculator {
  /**
   * Build a timing map from synthesized segments.
   *
   * @param segments - Synthesized audio segments with duration info
   * @param fps - Frames per second for frame calculations
   * @param breathingRoomFactor - Factor to add breathing room (default 1.15)
   */
  calculate(
    segments: SynthesizedSegment[],
    fps: number,
    breathingRoomFactor = 1.15
  ): VoiceTimingMap {
    const timingSegments = segments.map((seg) => {
      const durationInFrames = Math.ceil((seg.durationMs / 1000) * fps);
      const recommendedSceneDurationInFrames = Math.ceil(
        durationInFrames * breathingRoomFactor
      );

      const wordTimings: WordTiming[] | undefined = seg.wordTimings?.map(
        (wt) => ({
          word: wt.word,
          startMs: wt.startMs,
          endMs: wt.endMs,
        })
      );

      return {
        sceneId: seg.sceneId,
        durationMs: seg.durationMs,
        durationInFrames,
        recommendedSceneDurationInFrames,
        wordTimings,
      };
    });

    const totalDurationMs = segments.reduce((sum, s) => sum + s.durationMs, 0);

    return {
      totalDurationMs,
      segments: timingSegments,
      fps,
    };
  }

  /**
   * Recalculate timing map for a different FPS.
   */
  recalculateForFps(timingMap: VoiceTimingMap, newFps: number): VoiceTimingMap {
    const segments = timingMap.segments.map((seg) => {
      const durationInFrames = Math.ceil((seg.durationMs / 1000) * newFps);
      const ratio =
        seg.recommendedSceneDurationInFrames /
        Math.max(seg.durationInFrames, 1);

      return {
        ...seg,
        durationInFrames,
        recommendedSceneDurationInFrames: Math.ceil(durationInFrames * ratio),
      };
    });

    return {
      ...timingMap,
      segments,
      fps: newFps,
    };
  }
}
