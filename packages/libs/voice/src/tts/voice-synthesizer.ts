import type { VoiceTimingMap } from '../types';
import type {
  TTSBrief,
  TTSOptions,
  TTSProject,
  TTSScript,
  TTSScriptSegment,
  VideoTTSBrief,
} from './types';
import { PaceAnalyzer } from './pace-analyzer';
import { EmphasisPlanner } from './emphasis-planner';
import { SegmentSynthesizer } from './segment-synthesizer';
import { AudioAssembler } from './audio-assembler';
import { DurationEstimator } from '../audio/duration-estimator';

/**
 * Main TTS orchestrator.
 *
 * Pipeline:
 * 1. Build script from content brief (or scene plan)
 * 2. Analyze pacing per segment
 * 3. Plan emphasis/tone
 * 4. Synthesize each segment via TTSProvider
 * 5. Assemble into final audio + timing map
 */
export class VoiceSynthesizer {
  private readonly segmentSynthesizer: SegmentSynthesizer;
  private readonly emphasisPlanner: EmphasisPlanner;
  private readonly audioAssembler = new AudioAssembler();
  private readonly durationEstimator = new DurationEstimator();
  private readonly paceAnalyzer = new PaceAnalyzer();
  private readonly options: TTSOptions;

  constructor(options: TTSOptions) {
    this.options = options;
    this.segmentSynthesizer = new SegmentSynthesizer(options.tts);
    this.emphasisPlanner = new EmphasisPlanner({
      llm: options.llm,
      model: options.model,
    });
  }

  /** Standalone TTS from content brief */
  async synthesize(brief: TTSBrief): Promise<TTSProject> {
    const script = this.buildScript(brief);
    return this.executePipeline(script, brief.voice, brief.pacing);
  }

  /** Scene-aware TTS for video-gen */
  async synthesizeForVideo(brief: VideoTTSBrief): Promise<TTSProject> {
    const script = this.buildScriptFromScenePlan(brief);
    return this.executePipeline(script, brief.voice, brief.pacing, brief.fps);
  }

  private async executePipeline(
    script: TTSScript,
    voice: TTSBrief['voice'],
    pacing?: TTSBrief['pacing'],
    fps?: number
  ): Promise<TTSProject> {
    const projectId = generateProjectId();
    const baseRate = pacing?.baseRate ?? 1.0;

    // 1. Analyze pacing
    const pacingDirectives = await this.emphasisPlanner.plan(
      script.segments,
      baseRate
    );

    // 2. Synthesize segments
    const synthesized = await this.segmentSynthesizer.synthesizeAll(
      script.segments,
      voice,
      pacingDirectives
    );

    // 3. Assemble audio
    const pauseMs = pacing?.segmentPauseMs ?? 500;
    const assembledAudio = this.audioAssembler.assemble(
      synthesized,
      pacingDirectives,
      pauseMs
    );

    // 4. Build timing map
    const effectiveFps = fps ?? this.options.fps ?? 30;
    const breathingRoomFactor = pacing?.breathingRoomFactor ?? 1.15;
    const timingMap = this.buildTimingMap(
      synthesized,
      effectiveFps,
      breathingRoomFactor
    );

    return {
      id: projectId,
      script,
      pacingDirectives,
      segments: synthesized,
      assembledAudio,
      timingMap,
    };
  }

  private buildScript(brief: TTSBrief): TTSScript {
    const segments: TTSScriptSegment[] = [];

    // Intro from title + summary
    const introText = `${brief.content.title}. ${brief.content.summary}`;
    segments.push({
      sceneId: 'intro',
      text: introText,
      estimatedDurationSeconds:
        this.durationEstimator.estimateSeconds(introText),
      contentType: 'intro',
    });

    // Problems
    if (brief.content.problems.length > 0) {
      const text = brief.content.problems.join('. ');
      segments.push({
        sceneId: 'problems',
        text,
        estimatedDurationSeconds: this.durationEstimator.estimateSeconds(text),
        contentType: 'problem',
      });
    }

    // Solutions
    if (brief.content.solutions.length > 0) {
      const text = brief.content.solutions.join('. ');
      segments.push({
        sceneId: 'solutions',
        text,
        estimatedDurationSeconds: this.durationEstimator.estimateSeconds(text),
        contentType: 'solution',
      });
    }

    // Metrics
    if (brief.content.metrics && brief.content.metrics.length > 0) {
      const text = brief.content.metrics.join('. ');
      segments.push({
        sceneId: 'metrics',
        text,
        estimatedDurationSeconds: this.durationEstimator.estimateSeconds(text),
        contentType: 'metric',
      });
    }

    // CTA
    if (brief.content.callToAction) {
      segments.push({
        sceneId: 'cta',
        text: brief.content.callToAction,
        estimatedDurationSeconds: this.durationEstimator.estimateSeconds(
          brief.content.callToAction
        ),
        contentType: 'cta',
      });
    }

    const fullText = segments.map((s) => s.text).join(' ');
    const estimatedDurationSeconds = segments.reduce(
      (sum, s) => sum + s.estimatedDurationSeconds,
      0
    );

    return { fullText, segments, estimatedDurationSeconds };
  }

  private buildScriptFromScenePlan(brief: VideoTTSBrief): TTSScript {
    const segments: TTSScriptSegment[] = brief.scenePlan.scenes
      .filter((scene) => scene.narrationText)
      .map((scene) => {
        const text = scene.narrationText ?? '';
        return {
          sceneId: scene.id,
          text,
          estimatedDurationSeconds:
            this.durationEstimator.estimateSeconds(text),
          contentType: 'intro' as const,
        };
      });

    const fullText = segments.map((s) => s.text).join(' ');
    const estimatedDurationSeconds = segments.reduce(
      (sum, s) => sum + s.estimatedDurationSeconds,
      0
    );

    return { fullText, segments, estimatedDurationSeconds };
  }

  private buildTimingMap(
    segments: {
      sceneId: string;
      durationMs: number;
      wordTimings?: { word: string; startMs: number; endMs: number }[];
    }[],
    fps: number,
    breathingRoomFactor: number
  ): VoiceTimingMap {
    const timingSegments = segments.map((seg) => {
      const durationInFrames = Math.ceil((seg.durationMs / 1000) * fps);
      return {
        sceneId: seg.sceneId,
        durationMs: seg.durationMs,
        durationInFrames,
        recommendedSceneDurationInFrames: Math.ceil(
          durationInFrames * breathingRoomFactor
        ),
        wordTimings: seg.wordTimings?.map((wt) => ({
          word: wt.word,
          startMs: wt.startMs,
          endMs: wt.endMs,
        })),
      };
    });

    const totalDurationMs = segments.reduce((sum, s) => sum + s.durationMs, 0);

    return { totalDurationMs, segments: timingSegments, fps };
  }
}

function generateProjectId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `tts_${timestamp}_${random}`;
}
