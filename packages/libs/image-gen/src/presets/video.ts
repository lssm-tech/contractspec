import type { ImageBrief } from '../types';
import { IMAGE_PRESETS } from '../types';
import type { ContentBrief } from '@contractspec/lib.content-gen/types';

/** Create a video thumbnail image brief from content. */
export function videoThumbnailBrief(content: ContentBrief): ImageBrief {
  return {
    content,
    purpose: 'video-thumbnail',
    dimensions: IMAGE_PRESETS.thumbnail,
    format: 'png',
    style: 'photorealistic',
  };
}

/** Create a 16:9 video thumbnail brief from content. */
export function videoThumbnailWideBrief(content: ContentBrief): ImageBrief {
  return {
    content,
    purpose: 'video-thumbnail',
    dimensions: { width: 1280, height: 720 },
    format: 'png',
    style: 'photorealistic',
  };
}
