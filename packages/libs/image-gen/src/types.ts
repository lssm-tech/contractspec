import type { LLMProvider } from '@contractspec/lib.contracts-integrations/integrations/providers/llm';
import type {
  ImageProvider,
  ImageDimensions,
  ImageFormat,
  ImageGenerationResult,
} from '@contractspec/lib.contracts-integrations/integrations/providers/image';
import { IMAGE_PRESETS } from '@contractspec/lib.contracts-integrations/integrations/providers/image';
import type { ContentBrief } from '@contractspec/lib.content-gen/types';

// Re-export contract types
export type {
  ImageProvider,
  ImageDimensions,
  ImageFormat,
  ImageGenerationResult,
};
export { IMAGE_PRESETS };

// -- Image Brief ------------------------------------------------------------

export interface ImageBrief {
  content: ContentBrief;
  purpose: ImagePurpose;
  dimensions?: ImageDimensions;
  format?: ImageFormat;
  style?: ImageStyle;
  brandColors?: BrandColorOverrides;
  variants?: number;
  locale?: string;
  seed?: number;
}

export type ImagePurpose =
  | 'blog-hero'
  | 'social-og'
  | 'social-twitter'
  | 'social-instagram'
  | 'landing-hero'
  | 'video-thumbnail'
  | 'email-header'
  | 'illustration'
  | 'icon';

export type ImageStyle =
  | 'photorealistic'
  | 'illustration'
  | '3d-render'
  | 'flat-design'
  | 'abstract'
  | 'minimalist'
  | 'branded';

export interface BrandColorOverrides {
  primary?: string;
  accent?: string;
  background?: string;
}

// -- Generator Options ------------------------------------------------------

export interface ImageGeneratorOptions {
  llm?: LLMProvider;
  image?: ImageProvider;
  model?: string;
  temperature?: number;
  locale?: string;
  defaultStyle?: ImageStyle;
  /** Injectable clock for deterministic testing. Defaults to `Date`. */
  clock?: { now(): number; toISOString(): string };
}

// -- Image Project ----------------------------------------------------------

export interface ImageProject {
  id: string;
  prompt: ImagePrompt;
  results?: ImageGenerationResult;
  metadata: ImageProjectMetadata;
}

export interface ImagePrompt {
  text: string;
  negativeText?: string;
  style: ImageStyle;
  dimensions: ImageDimensions;
  format: ImageFormat;
}

export interface ImageProjectMetadata {
  purpose: ImagePurpose;
  title: string;
  createdAt: string;
  locale: string;
}
