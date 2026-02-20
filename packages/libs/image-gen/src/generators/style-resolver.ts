import type {
  ImageDimensions,
  ImagePurpose,
  ImageStyle,
  BrandColorOverrides,
} from '../types';
import { IMAGE_PRESETS } from '../types';

export interface ResolvedStyle {
  styleTokens: string[];
  negativeTokens: string[];
  dimensions: ImageDimensions;
}

const PURPOSE_DIMENSIONS: Record<ImagePurpose, ImageDimensions> = {
  'blog-hero': IMAGE_PRESETS.blogHero,
  'social-og': IMAGE_PRESETS.ogImage,
  'social-twitter': IMAGE_PRESETS.twitterCard,
  'social-instagram': IMAGE_PRESETS.instagramSquare,
  'landing-hero': IMAGE_PRESETS.blogHero,
  'video-thumbnail': IMAGE_PRESETS.thumbnail,
  'email-header': IMAGE_PRESETS.emailHeader,
  illustration: IMAGE_PRESETS.illustration,
  icon: IMAGE_PRESETS.favicon,
};

const STYLE_TOKENS: Record<ImageStyle, string[]> = {
  photorealistic: [
    'professional photography',
    'high resolution',
    'natural lighting',
    'detailed textures',
  ],
  illustration: [
    'digital illustration',
    'clean lines',
    'vibrant colors',
    'artistic composition',
  ],
  '3d-render': [
    '3D render',
    'volumetric lighting',
    'glossy materials',
    'depth of field',
  ],
  'flat-design': [
    'clean flat vector',
    'geometric shapes',
    'solid colors',
    'minimal shadows',
  ],
  abstract: [
    'abstract composition',
    'bold shapes',
    'dynamic colors',
    'artistic interpretation',
  ],
  minimalist: [
    'minimalist design',
    'clean whitespace',
    'simple elements',
    'restrained palette',
  ],
  branded: [
    'brand-consistent design',
    'professional layout',
    'corporate aesthetic',
    'clean composition',
  ],
};

const BASE_NEGATIVE_TOKENS: string[] = [
  'blurry',
  'low quality',
  'text overlay',
  'watermark',
  'distorted',
  'pixelated',
];

export class StyleResolver {
  resolve(
    purpose: ImagePurpose,
    style?: ImageStyle,
    brand?: BrandColorOverrides
  ): ResolvedStyle {
    const resolvedStyle = style ?? 'photorealistic';
    const dimensions = PURPOSE_DIMENSIONS[purpose];
    const styleTokens = [...STYLE_TOKENS[resolvedStyle]];
    const negativeTokens = [...BASE_NEGATIVE_TOKENS];

    if (brand) {
      if (brand.primary) {
        styleTokens.push(`primary color ${brand.primary} palette`);
      }
      if (brand.accent) {
        styleTokens.push(`accent color ${brand.accent}`);
      }
      if (brand.background) {
        styleTokens.push(`background color ${brand.background}`);
      }
    }

    return { styleTokens, negativeTokens, dimensions };
  }
}
