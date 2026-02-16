// ---------------------------------------------------------------------------
// VideoGenerator -- Main entry point for generating video projects
// ---------------------------------------------------------------------------
// Orchestrates scene planning, script generation, and voice synthesis.
// Follows the content-gen generator pattern.
// ---------------------------------------------------------------------------

import type {
  VoiceProvider,
  VoiceSynthesisResult,
} from '@lssm/lib.contracts/integrations/providers/voice';
import type {
  VideoProject,
  AudioTrack,
} from '@lssm/lib.contracts/integrations/providers/video';
import { VIDEO_FORMATS } from '@lssm/lib.contracts/integrations/providers/video';
import type { VideoBrief, VideoGeneratorOptions } from '../types';
import { ScenePlanner } from './scene-planner';
import { ScriptGenerator } from './script-generator';
import { DEFAULT_FPS } from '../design/layouts';

export class VideoGenerator {
  private readonly scenePlanner: ScenePlanner;
  private readonly scriptGenerator: ScriptGenerator;
  private readonly voice?: VoiceProvider;
  private readonly defaultVoiceId?: string;
  private readonly fps: number;

  constructor(options?: VideoGeneratorOptions) {
    this.fps = options?.fps ?? DEFAULT_FPS;
    this.voice = options?.voice;
    this.defaultVoiceId = options?.defaultVoiceId;

    this.scenePlanner = new ScenePlanner({
      llm: options?.llm,
      model: options?.model,
      temperature: options?.temperature,
      fps: this.fps,
    });

    this.scriptGenerator = new ScriptGenerator({
      llm: options?.llm,
      model: options?.model,
      temperature: options?.temperature,
    });
  }

  /**
   * Generate a complete video project from a brief.
   *
   * Pipeline:
   * 1. Plan scenes from the content brief
   * 2. Generate narration script
   * 3. (Optional) Synthesize voice audio via VoiceProvider
   * 4. Assemble into a VideoProject
   */
  async generate(brief: VideoBrief): Promise<VideoProject> {
    // 1. Plan scenes
    const scenePlan = await this.scenePlanner.plan(brief);

    // 2. Generate narration script (if narration is enabled)
    let narrationAudio: AudioTrack | undefined;

    if (brief.narration?.enabled && this.voice) {
      const script = await this.scriptGenerator.generate(
        brief.content,
        brief.narration
      );

      // 3. Synthesize voice
      const voiceId = brief.narration.voiceId ?? this.defaultVoiceId;
      if (voiceId && script.fullText) {
        try {
          const result = await this.voice.synthesize({
            text: script.fullText,
            voiceId,
            format: 'mp3',
          });

          narrationAudio = {
            data: result.audio,
            format: 'mp3',
            durationSeconds:
              result.durationSeconds ?? script.estimatedDurationSeconds,
            volume: 1,
          };
        } catch {
          // Voice synthesis failed -- continue without narration
        }
      }
    }

    // 4. Build VideoProject
    const format = brief.format ?? VIDEO_FORMATS.landscape;

    const scenes = scenePlan.scenes.map((planned, i) => ({
      id: `scene-${i}`,
      compositionId: planned.compositionId,
      props: planned.props,
      durationInFrames: planned.durationInFrames,
      narrationText: planned.narrationText,
    }));

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
