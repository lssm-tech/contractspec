import type { STTProvider, AudioData, VoiceOptions } from '../types';

export interface STTBrief {
  audio: AudioData;
  language?: string;
  diarize?: boolean;
  speakerCount?: number;
  vocabularyHints?: string[];
  /** Output subtitle format */
  subtitleFormat?: 'srt' | 'vtt' | 'none';
}

export interface TranscriptionProject {
  id: string;
  transcript: TranscriptionResult;
  subtitles?: string;
  speakers?: SpeakerMap[];
}

export interface TranscriptionResult {
  text: string;
  segments: TranscriptionSegment[];
  language: string;
  durationMs: number;
  wordTimings?: { word: string; startMs: number; endMs: number }[];
}

export interface TranscriptionSegment {
  text: string;
  startMs: number;
  endMs: number;
  speakerId?: string;
  speakerLabel?: string;
  confidence?: number;
}

export interface SpeakerMap {
  id: string;
  label: string;
  segmentCount: number;
  totalSpeakingMs: number;
}

export interface STTOptions extends VoiceOptions {
  stt: STTProvider;
}
