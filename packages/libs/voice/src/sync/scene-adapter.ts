import type { TTSScript, TTSScriptSegment } from '../tts/types';
import { DurationEstimator } from '../audio/duration-estimator';

interface ScenePlanScene {
  id: string;
  compositionId: string;
  durationInFrames: number;
  narrationText?: string;
}

interface ScenePlan {
  scenes: ScenePlanScene[];
  estimatedDurationSeconds: number;
}

/**
 * Adapt a video-gen ScenePlan into a TTSScript.
 *
 * Bridges the video-gen domain to the voice TTS domain,
 * preserving scene IDs for timing map correlation.
 */
export class SceneAdapter {
  private readonly durationEstimator = new DurationEstimator();

  /**
   * Convert a ScenePlan into a TTSScript.
   *
   * Filters out scenes without narration text.
   * Assigns contentType based on scene position (first = intro, last = cta, middle = solution).
   */
  adapt(scenePlan: ScenePlan): TTSScript {
    const scenesWithNarration = scenePlan.scenes.filter(
      (s) => s.narrationText && s.narrationText.trim().length > 0
    );

    const segments: TTSScriptSegment[] = scenesWithNarration.map(
      (scene, index) => {
        const text = scene.narrationText ?? '';
        return {
          sceneId: scene.id,
          text,
          estimatedDurationSeconds:
            this.durationEstimator.estimateSeconds(text),
          contentType: this.inferContentType(index, scenesWithNarration.length),
        };
      }
    );

    const fullText = segments.map((s) => s.text).join(' ');
    const estimatedDurationSeconds = segments.reduce(
      (sum, s) => sum + s.estimatedDurationSeconds,
      0
    );

    return { fullText, segments, estimatedDurationSeconds };
  }

  private inferContentType(
    index: number,
    total: number
  ): TTSScriptSegment['contentType'] {
    if (index === 0) return 'intro';
    if (index === total - 1) return 'cta';
    if (index === 1 && total > 3) return 'problem';
    if (index === total - 2 && total > 3) return 'metric';
    return 'solution';
  }
}
