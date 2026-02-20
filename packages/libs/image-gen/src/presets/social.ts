import type { ImageBrief } from '../types';
import { IMAGE_PRESETS } from '../types';
import type { ContentBrief } from '@contractspec/lib.content-gen/types';

/** Create an OG image brief from content. */
export function ogImageBrief(content: ContentBrief): ImageBrief {
  return {
    content,
    purpose: 'social-og',
    dimensions: IMAGE_PRESETS.ogImage,
    format: 'png',
    style: 'photorealistic',
  };
}

/** Create a Twitter card image brief from content. */
export function twitterCardBrief(content: ContentBrief): ImageBrief {
  return {
    content,
    purpose: 'social-twitter',
    dimensions: IMAGE_PRESETS.twitterCard,
    format: 'png',
    style: 'photorealistic',
  };
}

/** Create an Instagram square image brief from content. */
export function instagramSquareBrief(content: ContentBrief): ImageBrief {
  return {
    content,
    purpose: 'social-instagram',
    dimensions: IMAGE_PRESETS.instagramSquare,
    format: 'jpg',
    style: 'photorealistic',
  };
}

/** Create an Instagram story image brief from content. */
export function instagramStoryBrief(content: ContentBrief): ImageBrief {
  return {
    content,
    purpose: 'social-instagram',
    dimensions: IMAGE_PRESETS.instagramStory,
    format: 'jpg',
    style: 'photorealistic',
  };
}
