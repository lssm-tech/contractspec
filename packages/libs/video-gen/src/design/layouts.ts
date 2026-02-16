// ---------------------------------------------------------------------------
// Video Layout Presets
// ---------------------------------------------------------------------------
// Standard frame dimensions and layout utilities for compositions.
// ---------------------------------------------------------------------------

import type { VideoFormat } from '@contractspec/lib.contracts-integrations/integrations/providers/video';
import { VIDEO_FORMATS } from '@contractspec/lib.contracts-integrations/integrations/providers/video';

export { VIDEO_FORMATS };

/** Standard FPS for all video output. */
export const DEFAULT_FPS = 30;

/**
 * Padding and safe zones for text content within video frames.
 * Values are in pixels for 1920x1080; scale proportionally for other formats.
 */
export const videoSafeZone = {
  /** Horizontal padding from edges */
  horizontal: 120,
  /** Vertical padding from edges */
  vertical: 80,
  /** Content area width (1920 - 2 * 120) */
  contentWidth: 1680,
  /** Content area height (1080 - 2 * 80) */
  contentHeight: 920,
} as const;

/**
 * Scale safe zone values for a target format.
 */
export function scaleSafeZone(format: VideoFormat) {
  const scaleX = format.width / 1920;
  const scaleY = format.height / 1080;
  return {
    horizontal: Math.round(videoSafeZone.horizontal * scaleX),
    vertical: Math.round(videoSafeZone.vertical * scaleY),
    contentWidth: Math.round(videoSafeZone.contentWidth * scaleX),
    contentHeight: Math.round(videoSafeZone.contentHeight * scaleY),
  };
}

/**
 * Common layout positions within a 1920x1080 frame.
 * Use with absolute positioning in compositions.
 */
export const videoPositions = {
  /** Centered content */
  center: { x: 960, y: 540 },
  /** Top-left content area start */
  topLeft: { x: 120, y: 80 },
  /** Top-right content area end */
  topRight: { x: 1800, y: 80 },
  /** Bottom-left */
  bottomLeft: { x: 120, y: 1000 },
  /** Bottom-right (for logos, watermarks) */
  bottomRight: { x: 1800, y: 1000 },
  /** Bottom center (for captions) */
  bottomCenter: { x: 960, y: 960 },
} as const;

/**
 * Get all format variants for a given primary format.
 * Returns landscape, square, and portrait variants.
 */
export function getAllFormatVariants(): VideoFormat[] {
  return [
    VIDEO_FORMATS.landscape,
    VIDEO_FORMATS.square,
    VIDEO_FORMATS.portrait,
  ];
}
