// -- Image Format -----------------------------------------------------------

export type ImageFormat = 'png' | 'jpg' | 'webp' | 'svg';

export interface ImageDimensions {
  width: number;
  height: number;
}

export const IMAGE_PRESETS = {
  ogImage: { width: 1200, height: 630 },
  twitterCard: { width: 1200, height: 675 },
  instagramSquare: { width: 1080, height: 1080 },
  instagramStory: { width: 1080, height: 1920 },
  blogHero: { width: 1920, height: 1080 },
  thumbnail: { width: 640, height: 360 },
  favicon: { width: 512, height: 512 },
  emailHeader: { width: 600, height: 200 },
  illustration: { width: 1024, height: 1024 },
} as const satisfies Record<string, ImageDimensions>;

// -- Generation Input -------------------------------------------------------

export interface ImageGenerationInput {
  prompt: string;
  negativePrompt?: string;
  dimensions: ImageDimensions;
  format?: ImageFormat;
  style?:
    | 'photorealistic'
    | 'illustration'
    | '3d-render'
    | 'flat-design'
    | 'abstract';
  numVariants?: number;
  guidanceScale?: number;
  seed?: number;
  /** Reference image for img2img / style transfer */
  referenceImage?: Uint8Array;
  referenceStrength?: number;
  metadata?: Record<string, string>;
}

// -- Generation Result ------------------------------------------------------

export interface ImageGenerationResult {
  images: GeneratedImageData[];
  seed: number;
  model: string;
  generationTimeMs?: number;
}

export interface GeneratedImageData {
  data: Uint8Array;
  format: ImageFormat;
  dimensions: ImageDimensions;
  url?: string;
  /** Provider may revise the prompt */
  revisedPrompt?: string;
}

// -- Provider Interface -----------------------------------------------------

export interface ImageProvider {
  generate(input: ImageGenerationInput): Promise<ImageGenerationResult>;
  listModels?(): Promise<ImageModelInfo[]>;
  upscale?(image: Uint8Array, scale: number): Promise<GeneratedImageData>;
  edit?(
    image: Uint8Array,
    mask: Uint8Array,
    prompt: string
  ): Promise<GeneratedImageData>;
}

export interface ImageModelInfo {
  id: string;
  name: string;
  maxDimensions: ImageDimensions;
  supportedFormats: ImageFormat[];
  supportsNegativePrompt: boolean;
  supportsImg2Img: boolean;
}
