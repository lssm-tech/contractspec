// ---------------------------------------------------------------------------
// VideoGenerator -- Main entry point for generating video projects
// ---------------------------------------------------------------------------
// Orchestrates scene planning and voice synthesis.
// Voice script generation has moved to @contractspec/lib.voice.
// ---------------------------------------------------------------------------

import type {
  AudioTrack,
  VideoProject,
} from '@contractspec/lib.contracts-integrations/integrations/providers/video';
import { VIDEO_FORMATS } from '@contractspec/lib.contracts-integrations/integrations/providers/video';
import type { VoiceSynthesizer } from '@contractspec/lib.voice/tts';
import type { TTSProject } from '@contractspec/lib.voice/tts';
import type { Transcriber } from '@contractspec/lib.voice/stt';
import type { ImageGenerator } from '@contractspec/lib.image-gen/generators/image-generator';
import type { VideoBrief, VideoGeneratorOptions } from '../types';
import { ScenePlanner } from './scene-planner';
import { DEFAULT_FPS } from '../design/layouts';

export class VideoGenerator {
  private readonly scenePlanner: ScenePlanner;
  private readonly voice?: VoiceSynthesizer;
  private readonly transcriber?: Transcriber;
  private readonly image?: ImageGenerator;
  private readonly fps: number;

  constructor(options?: VideoGeneratorOptions) {
    this.fps = options?.fps ?? DEFAULT_FPS;
    this.voice = options?.voice;
    this.transcriber = options?.transcriber;
    this.image = options?.image;

    this.scenePlanner = new ScenePlanner({
      llm: options?.llm,
      model: options?.model,
      temperature: options?.temperature,
      fps: this.fps,
      locale: options?.locale,
    });
  }

  /**
   * Generate a complete video project from a brief.
   *
   * Pipeline:
   * 1. Plan scenes from the content brief
   * 2. (Optional) Synthesize voice with scene awareness via VoiceSynthesizer
   * 3. (Optional) Generate subtitles via Transcriber
   * 4. (Optional) Generate thumbnail via ImageGenerator
   * 5. Assemble into a VideoProject
   */
  async generate(brief: VideoBrief): Promise<VideoProject> {
    // 1. Plan scenes
    const scenePlan = await this.scenePlanner.plan(brief);

    const scenes = scenePlan.scenes.map((planned, i) => ({
      id: `scene-${i}`,
      compositionId: planned.compositionId,
      props: planned.props,
      durationInFrames: planned.durationInFrames,
      narrationText: planned.narrationText,
    }));

    // 2. Generate voice with scene awareness (delegated to voice lib)
    let ttsProject: TTSProject | undefined;
    let narrationAudio: AudioTrack | undefined;

    if (brief.narration?.enabled && this.voice) {
      try {
        ttsProject = await this.voice.synthesizeForVideo({
          content: brief.content,
          scenePlan: {
            scenes: scenes.map((s) => ({
              id: s.id,
              compositionId: s.compositionId,
              durationInFrames: s.durationInFrames,
              narrationText: s.narrationText,
            })),
            estimatedDurationSeconds: scenePlan.estimatedDurationSeconds,
          },
          voice: { voiceId: brief.narration.voiceId ?? '' },
          pacing: { strategy: 'scene-matched' },
          fps: this.fps,
        });

        // Adjust scene durations from voice timing map
        if (ttsProject.timingMap) {
          for (const seg of ttsProject.timingMap.segments) {
            const scene = scenes.find((s) => s.id === seg.sceneId);
            if (scene) {
              scene.durationInFrames = seg.recommendedSceneDurationInFrames;
            }
          }
        }

        // Build narration audio track
        if (ttsProject.assembledAudio) {
          narrationAudio = {
            data: ttsProject.assembledAudio.data,
            format: ttsProject.assembledAudio.format === 'wav' ? 'wav' : 'mp3',
            durationSeconds: (ttsProject.assembledAudio.durationMs ?? 0) / 1000,
            volume: 1,
          };
        }
      } catch {
        // Voice synthesis failed -- continue without narration
      }
    }

    // 3. Auto-generate subtitles if transcriber available + ttsProject has audio
    let subtitles: string | undefined;
    if (this.transcriber && ttsProject?.assembledAudio) {
      try {
        const transcription = await this.transcriber.transcribe({
          audio: ttsProject.assembledAudio,
          subtitleFormat: 'vtt',
        });
        subtitles = transcription.subtitles;
      } catch {
        // Subtitle generation failed -- continue without
      }
    }

    // 4. Generate thumbnail via ImageGenerator
    let thumbnail: { prompt: string; imageUrl?: string } | undefined;

    if (this.image) {
      try {
        const thumbProject = await this.image.generate({
          content: brief.content,
          purpose: 'video-thumbnail',
          format: 'png',
          style: 'photorealistic',
        });
        const imageUrl = thumbProject.results?.images[0]?.url;
        thumbnail = {
          prompt: thumbProject.prompt.text,
          ...(imageUrl ? { imageUrl } : {}),
        };
      } catch {
        // Thumbnail generation failed -- continue without
      }
    }

    // 5. Build VideoProject
    const format = brief.format ?? VIDEO_FORMATS.landscape;

    const totalDurationInFrames = scenes.reduce(
      (sum, s) => sum + s.durationInFrames,
      0
    );

    const project: VideoProject = {
      id: generateProjectId(),
      scenes,
      totalDurationInFrames,
      fps: this.fps,
      format,
      audio: narrationAudio ? { narration: narrationAudio } : undefined,
      subtitles,
      voiceTimingMap: ttsProject?.timingMap,
      thumbnail,
    };

    return project;
  }
}

// -- Helpers ----------------------------------------------------------------

function generateProjectId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `vp_${timestamp}_${random}`;
}
