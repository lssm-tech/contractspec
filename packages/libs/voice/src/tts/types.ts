import type { ContentBrief } from '@contractspec/lib.content-gen/types';
import type {
  TTSProvider,
  AudioData,
  VoiceTimingMap,
  VoicePacingDirective,
  VoiceOptions,
} from '../types';

export interface TTSBrief {
  content: ContentBrief;
  voice: TTSVoiceConfig;
  pacing?: PacingConfig;
  targetDurationSeconds?: number;
  locale?: string;
}

export interface TTSVoiceConfig {
  voiceId: string;
  language?: string;
  style?: number;
  stability?: number;
}

export interface PacingConfig {
  /** Base speaking rate multiplier. Default 1.0 */
  baseRate?: number;
  strategy: 'uniform' | 'dynamic' | 'scene-matched';
  /** Pause between segments in ms. Default 500 */
  segmentPauseMs?: number;
  /** Breathing room factor for scene duration. Default 1.15 */
  breathingRoomFactor?: number;
}

export interface TTSProject {
  id: string;
  script: TTSScript;
  pacingDirectives: VoicePacingDirective[];
  segments?: SynthesizedSegment[];
  assembledAudio?: AudioData;
  timingMap?: VoiceTimingMap;
}

export interface TTSScript {
  fullText: string;
  segments: TTSScriptSegment[];
  estimatedDurationSeconds: number;
}

export interface TTSScriptSegment {
  sceneId: string;
  text: string;
  estimatedDurationSeconds: number;
  contentType:
    | 'intro'
    | 'problem'
    | 'solution'
    | 'metric'
    | 'cta'
    | 'transition';
}

export interface SynthesizedSegment {
  sceneId: string;
  audio: AudioData;
  durationMs: number;
  wordTimings?: { word: string; startMs: number; endMs: number }[];
}

export interface TTSOptions extends VoiceOptions {
  tts: TTSProvider;
  defaultVoiceId?: string;
  fps?: number;
  defaultPacing?: PacingConfig;
}

/** Video-aware brief: takes a ScenePlan instead of standalone content */
export interface VideoTTSBrief {
  content: ContentBrief;
  scenePlan: {
    scenes: {
      id: string;
      compositionId: string;
      durationInFrames: number;
      narrationText?: string;
    }[];
    estimatedDurationSeconds: number;
  };
  voice: TTSVoiceConfig;
  pacing?: PacingConfig;
  fps: number;
  locale?: string;
}
