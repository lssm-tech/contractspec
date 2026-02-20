// ---------------------------------------------------------------------------
// Voice-Video Sync Types
// ---------------------------------------------------------------------------
// Timing map produced by voice/tts, consumed by video-gen.
// Video-gen uses this to adjust scene durations to match voice.
// ---------------------------------------------------------------------------

import type { WordTiming } from './voice';

/**
 * Timing map produced by voice/tts, consumed by video-gen.
 * Video-gen uses this to adjust scene durations to match voice.
 */
export interface VoiceTimingMap {
  totalDurationMs: number;
  segments: VoiceSegmentTiming[];
  fps: number;
}

export interface VoiceSegmentTiming {
  /** Matches a sceneId from video-gen's ScenePlan */
  sceneId: string;
  /** Voice audio duration for this segment in ms */
  durationMs: number;
  /** Equivalent duration in frames */
  durationInFrames: number;
  /** Recommended scene duration (voice + breathing room) */
  recommendedSceneDurationInFrames: number;
  wordTimings?: WordTiming[];
}

export interface VoicePacingDirective {
  sceneId: string;
  rate: number;
  emphasis: 'reduced' | 'normal' | 'strong';
  tone: 'neutral' | 'urgent' | 'excited' | 'calm' | 'authoritative';
  leadingSilenceMs: number;
  trailingSilenceMs: number;
}
