// ---------------------------------------------------------------------------
// Video Generation Library Types
// ---------------------------------------------------------------------------
// Extends the provider contracts with library-specific types for briefs,
// generator options, and content-pipeline integration.
// ---------------------------------------------------------------------------

import type { LLMProvider } from '@contractspec/lib.contracts-integrations/integrations/providers/llm';
import type { VoiceSynthesizer } from '@contractspec/lib.voice/tts';
import type { Transcriber } from '@contractspec/lib.voice/stt';
import type { ContentBrief } from '@contractspec/lib.content-gen/types';
import type { ImageGenerator } from '@contractspec/lib.image-gen/generators/image-generator';
import type {
  NarrationConfig,
  VideoFormat,
  VideoProject,
  VideoStyleOverrides,
} from '@contractspec/lib.contracts-integrations/integrations/providers/video';

// Re-export contract types for convenience
export type {
  AudioTrack,
  CompositionMeta,
  CompositionRegistry,
  NarrationConfig,
  RenderConfig,
  RenderResult,
  SceneTransition,
  SceneTransitionType,
  VideoCodec,
  VideoFormat,
  VideoFormatCustom,
  VideoFormatLandscape,
  VideoFormatPortrait,
  VideoFormatSquare,
  VideoOutputFormat,
  VideoProject,
  VideoProjectMetadata,
  VideoProvider,
  VideoScene,
  VideoStyleOverrides,
} from '@contractspec/lib.contracts-integrations/integrations/providers/video';

export type { TTSProject } from '@contractspec/lib.voice/tts';

export { VIDEO_FORMATS } from '@contractspec/lib.contracts-integrations/integrations/providers/video';

// -- Video Brief ------------------------------------------------------------

/**
 * Input for the video generation pipeline.
 * Builds on top of ContentBrief to keep a unified content pipeline.
 */
export interface VideoBrief {
  /** The content brief driving the video narrative */
  content: ContentBrief;
  /** Target video format / dimensions */
  format: VideoFormat;
  /** Target duration in seconds. Auto-calculated from scenes if omitted. */
  targetDurationSeconds?: number;
  /** Narration configuration */
  narration?: NarrationConfig;
  /** Visual style overrides */
  style?: VideoStyleOverrides;
  /** Composition template to use (if known). Otherwise scene planner picks. */
  compositionId?: string;
  /** Locale for generated content and LLM prompts (defaults to "en") */
  locale?: string;
}

// -- Generator Options ------------------------------------------------------

export interface VideoGeneratorOptions {
  /** Optional LLM for enhanced scene planning & script generation */
  llm?: LLMProvider;
  /** Optional voice synthesizer for narration synthesis */
  voice?: VoiceSynthesizer;
  /** Optional transcriber for subtitle generation */
  transcriber?: Transcriber;
  /** Optional image generator for thumbnail generation */
  image?: ImageGenerator;
  /** LLM model override */
  model?: string;
  /** LLM temperature (0-1). Default 0.4 for determinism. */
  temperature?: number;
  /** Default voice ID for narration */
  defaultVoiceId?: string;
  /** Default FPS. Default 30. */
  fps?: number;
  /** Locale for generated content and LLM prompts (defaults to "en") */
  locale?: string;
}

// -- Generated Video --------------------------------------------------------

export interface GeneratedVideo {
  project: VideoProject;
  /** Set after rendering */
  outputPath?: string;
  format: 'mp4' | 'webm' | 'gif';
  /** Auto-generated social format variants */
  variants?: GeneratedVideoVariant[];
}

export interface GeneratedVideoVariant {
  format: VideoFormat;
  outputPath: string;
  durationSeconds: number;
}

// -- Scene Planning ---------------------------------------------------------

export interface ScenePlan {
  scenes: PlannedScene[];
  estimatedDurationSeconds: number;
  narrationScript?: string;
}

export interface PlannedScene {
  compositionId: string;
  props: Record<string, unknown>;
  durationInFrames: number;
  narrationText?: string;
  notes?: string;
}
