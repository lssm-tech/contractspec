// ---------------------------------------------------------------------------
// Video Generation Provider Contract
// ---------------------------------------------------------------------------
// Defines the provider-agnostic interface for programmatic video generation
// using Remotion compositions. This contract is consumed by @lssm/lib.video-gen
// and can be implemented by different rendering backends (local, Lambda, etc.).
// ---------------------------------------------------------------------------

// -- Video Format -----------------------------------------------------------

export interface VideoFormatLandscape {
  type: 'landscape';
  width: 1920;
  height: 1080;
}

export interface VideoFormatPortrait {
  type: 'portrait';
  width: 1080;
  height: 1920;
}

export interface VideoFormatSquare {
  type: 'square';
  width: 1080;
  height: 1080;
}

export interface VideoFormatCustom {
  type: 'custom';
  width: number;
  height: number;
}

export type VideoFormat =
  | VideoFormatLandscape
  | VideoFormatPortrait
  | VideoFormatSquare
  | VideoFormatCustom;

export const VIDEO_FORMATS = {
  landscape: { type: 'landscape', width: 1920, height: 1080 } as const,
  portrait: { type: 'portrait', width: 1080, height: 1920 } as const,
  square: { type: 'square', width: 1080, height: 1080 } as const,
} satisfies Record<string, VideoFormat>;

// -- Narration --------------------------------------------------------------

export interface NarrationConfig {
  enabled: boolean;
  voiceId?: string;
  language?: string;
  style?: 'professional' | 'casual' | 'technical';
}

// -- Video Style ------------------------------------------------------------

export interface VideoStyleOverrides {
  /** Override brand primary color */
  primaryColor?: string;
  /** Override brand accent color */
  accentColor?: string;
  /** Background color or gradient CSS value */
  background?: string;
  /** Font family override */
  fontFamily?: string;
  /** Show watermark / logo */
  showBranding?: boolean;
  /** Dark mode */
  darkMode?: boolean;
}

// -- Scene ------------------------------------------------------------------

export interface VideoScene {
  id: string;
  /** Maps to a registered Remotion composition ID */
  compositionId: string;
  /** Input props passed to the Remotion composition */
  props: Record<string, unknown>;
  /** Duration in frames */
  durationInFrames: number;
  /** Optional narration text for this scene */
  narrationText?: string;
  /** Transition to next scene */
  transition?: SceneTransition;
}

export type SceneTransitionType =
  | 'fade'
  | 'slide-left'
  | 'slide-right'
  | 'wipe'
  | 'none';

export interface SceneTransition {
  type: SceneTransitionType;
  durationInFrames: number;
}

// -- Audio ------------------------------------------------------------------

export interface AudioTrack {
  /** Audio data as Uint8Array (e.g., from VoiceProvider) */
  data?: Uint8Array;
  /** Or a URL/path to the audio file */
  src?: string;
  format: 'mp3' | 'wav' | 'ogg';
  durationSeconds: number;
  /** Volume 0-1 */
  volume?: number;
}

// -- Video Project ----------------------------------------------------------

export interface VideoProject {
  id: string;
  /** The scenes composing this video in order */
  scenes: VideoScene[];
  /** Total duration across all scenes */
  totalDurationInFrames: number;
  fps: number;
  /** Video dimensions */
  format: VideoFormat;
  /** Audio tracks */
  audio?: {
    narration?: AudioTrack;
    backgroundMusic?: AudioTrack;
  };
  /** Metadata for the rendered file */
  metadata?: VideoProjectMetadata;
}

export interface VideoProjectMetadata {
  title?: string;
  description?: string;
  tags?: string[];
  createdAt?: string;
}

// -- Render Config ----------------------------------------------------------

export type VideoCodec = 'h264' | 'h265' | 'vp8' | 'vp9';
export type VideoOutputFormat = 'mp4' | 'webm' | 'gif';

export interface RenderConfig {
  /** Output codec */
  codec?: VideoCodec;
  /** Output container format */
  outputFormat?: VideoOutputFormat;
  /** Constant Rate Factor (quality). Lower = better. Default 18. */
  crf?: number;
  /** Output file path */
  outputPath: string;
  /** Generate additional format variants (square, portrait) */
  autoVariants?: boolean;
  /** Pixel format. Default 'yuv420p'. */
  pixelFormat?: string;
  /** Number of rendering threads. Default: CPU count. */
  concurrency?: number;
}

// -- Render Result ----------------------------------------------------------

export interface RenderResult {
  outputPath: string;
  format: VideoOutputFormat;
  codec: VideoCodec;
  durationSeconds: number;
  fileSizeBytes: number;
  dimensions: { width: number; height: number };
  /** Additional format variants if autoVariants was true */
  variants?: RenderResult[];
}

// -- Video Provider (renderer abstraction) ----------------------------------

export interface VideoProvider {
  /**
   * Render a video project to a file.
   * Implementations may use local Remotion renderer, Lambda, Cloud Run, etc.
   */
  render(project: VideoProject, config: RenderConfig): Promise<RenderResult>;

  /**
   * Get a still frame from a composition (useful for thumbnails).
   */
  renderStill?(
    compositionId: string,
    props: Record<string, unknown>,
    frame: number,
    format: VideoFormat
  ): Promise<Uint8Array>;
}

// -- Composition Registry ---------------------------------------------------

export interface CompositionMeta {
  id: string;
  displayName: string;
  description: string;
  /** Default duration in frames */
  defaultDurationInFrames: number;
  fps: number;
  /** Default dimensions */
  defaultFormat: VideoFormat;
  /** Schema of expected input props (for validation / UI generation) */
  propsSchema?: Record<string, unknown>;
  /** Tags for categorization */
  tags?: string[];
}

export interface CompositionRegistry {
  register(meta: CompositionMeta): void;
  get(id: string): CompositionMeta | undefined;
  list(): CompositionMeta[];
  listByTag(tag: string): CompositionMeta[];
}
