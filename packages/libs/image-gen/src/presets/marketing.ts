import type { ImageBrief } from '../types';
import { IMAGE_PRESETS } from '../types';
import type { ContentBrief } from '@contractspec/lib.content-gen/types';

/** Create a blog hero image brief from content. */
export function blogHeroBrief(content: ContentBrief): ImageBrief {
  return {
    content,
    purpose: 'blog-hero',
    dimensions: IMAGE_PRESETS.blogHero,
    format: 'webp',
    style: 'photorealistic',
  };
}

/** Create a landing page hero image brief from content. */
export function landingHeroBrief(content: ContentBrief): ImageBrief {
  return {
    content,
    purpose: 'landing-hero',
    dimensions: IMAGE_PRESETS.blogHero,
    format: 'webp',
    style: 'photorealistic',
  };
}

/** Create an email header image brief from content. */
export function emailHeaderBrief(content: ContentBrief): ImageBrief {
  return {
    content,
    purpose: 'email-header',
    dimensions: IMAGE_PRESETS.emailHeader,
    format: 'png',
    style: 'flat-design',
  };
}
