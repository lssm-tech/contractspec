export interface Voice {
  id: string;
  name: string;
  description?: string;
  language?: string;
  gender?: 'male' | 'female' | 'neutral';
  previewUrl?: string;
  metadata?: Record<string, string>;
}

export interface VoiceSynthesisInput {
  text: string;
  voiceId?: string;
  language?: string;
  style?: number;
  stability?: number;
  similarityBoost?: number;
  format?: 'mp3' | 'wav' | 'ogg' | 'pcm';
  sampleRateHz?: number;
  metadata?: Record<string, string>;
}

export interface VoiceSynthesisResult {
  audio: Uint8Array;
  format: string;
  sampleRateHz: number;
  durationSeconds?: number;
  url?: string;
}

export interface VoiceProvider {
  listVoices(): Promise<Voice[]>;
  synthesize(input: VoiceSynthesisInput): Promise<VoiceSynthesisResult>;
}


