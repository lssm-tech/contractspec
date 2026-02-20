import { describe, it, expect } from 'bun:test';
import {
  ogImageBrief,
  twitterCardBrief,
  instagramSquareBrief,
  instagramStoryBrief,
  blogHeroBrief,
  landingHeroBrief,
  emailHeaderBrief,
  videoThumbnailBrief,
  videoThumbnailWideBrief,
} from './index';
import { IMAGE_PRESETS } from '../types';
import type { ContentBrief } from '@contractspec/lib.content-gen/types';

// =============================================================================
// Helpers
// =============================================================================

const mockContent: ContentBrief = {
  title: 'Test Title',
  summary: 'Test summary for image preset testing',
  problems: ['problem1'],
  solutions: ['solution1'],
  audience: { role: 'Developer', industry: 'tech' },
};

// =============================================================================
// Social Presets
// =============================================================================

describe('Social Presets', () => {
  it('ogImageBrief should produce correct brief', () => {
    const brief = ogImageBrief(mockContent);
    expect(brief.purpose).toBe('social-og');
    expect(brief.dimensions).toEqual(IMAGE_PRESETS.ogImage);
    expect(brief.format).toBe('png');
    expect(brief.style).toBe('photorealistic');
    expect(brief.content).toBe(mockContent);
  });

  it('twitterCardBrief should produce correct brief', () => {
    const brief = twitterCardBrief(mockContent);
    expect(brief.purpose).toBe('social-twitter');
    expect(brief.dimensions).toEqual(IMAGE_PRESETS.twitterCard);
    expect(brief.format).toBe('png');
    expect(brief.style).toBe('photorealistic');
    expect(brief.content).toBe(mockContent);
  });

  it('instagramSquareBrief should produce correct brief', () => {
    const brief = instagramSquareBrief(mockContent);
    expect(brief.purpose).toBe('social-instagram');
    expect(brief.dimensions).toEqual(IMAGE_PRESETS.instagramSquare);
    expect(brief.format).toBe('jpg');
    expect(brief.style).toBe('photorealistic');
    expect(brief.content).toBe(mockContent);
  });

  it('instagramStoryBrief should produce correct brief', () => {
    const brief = instagramStoryBrief(mockContent);
    expect(brief.purpose).toBe('social-instagram');
    expect(brief.dimensions).toEqual(IMAGE_PRESETS.instagramStory);
    expect(brief.format).toBe('jpg');
    expect(brief.style).toBe('photorealistic');
    expect(brief.content).toBe(mockContent);
  });
});

// =============================================================================
// Marketing Presets
// =============================================================================

describe('Marketing Presets', () => {
  it('blogHeroBrief should produce correct brief', () => {
    const brief = blogHeroBrief(mockContent);
    expect(brief.purpose).toBe('blog-hero');
    expect(brief.dimensions).toEqual(IMAGE_PRESETS.blogHero);
    expect(brief.format).toBe('webp');
    expect(brief.style).toBe('photorealistic');
    expect(brief.content).toBe(mockContent);
  });

  it('landingHeroBrief should produce correct brief', () => {
    const brief = landingHeroBrief(mockContent);
    expect(brief.purpose).toBe('landing-hero');
    expect(brief.dimensions).toEqual(IMAGE_PRESETS.blogHero);
    expect(brief.format).toBe('webp');
    expect(brief.style).toBe('photorealistic');
    expect(brief.content).toBe(mockContent);
  });

  it('emailHeaderBrief should produce correct brief', () => {
    const brief = emailHeaderBrief(mockContent);
    expect(brief.purpose).toBe('email-header');
    expect(brief.dimensions).toEqual(IMAGE_PRESETS.emailHeader);
    expect(brief.format).toBe('png');
    expect(brief.style).toBe('flat-design');
    expect(brief.content).toBe(mockContent);
  });
});

// =============================================================================
// Video Presets
// =============================================================================

describe('Video Presets', () => {
  it('videoThumbnailBrief should produce correct brief', () => {
    const brief = videoThumbnailBrief(mockContent);
    expect(brief.purpose).toBe('video-thumbnail');
    expect(brief.dimensions).toEqual(IMAGE_PRESETS.thumbnail);
    expect(brief.format).toBe('png');
    expect(brief.style).toBe('photorealistic');
    expect(brief.content).toBe(mockContent);
  });

  it('videoThumbnailWideBrief should produce correct brief', () => {
    const brief = videoThumbnailWideBrief(mockContent);
    expect(brief.purpose).toBe('video-thumbnail');
    expect(brief.dimensions).toEqual({ width: 1280, height: 720 });
    expect(brief.format).toBe('png');
    expect(brief.style).toBe('photorealistic');
    expect(brief.content).toBe(mockContent);
  });
});

// =============================================================================
// General properties
// =============================================================================

describe('Preset general properties', () => {
  const allPresets = [
    { name: 'ogImageBrief', fn: ogImageBrief },
    { name: 'twitterCardBrief', fn: twitterCardBrief },
    { name: 'instagramSquareBrief', fn: instagramSquareBrief },
    { name: 'instagramStoryBrief', fn: instagramStoryBrief },
    { name: 'blogHeroBrief', fn: blogHeroBrief },
    { name: 'landingHeroBrief', fn: landingHeroBrief },
    { name: 'emailHeaderBrief', fn: emailHeaderBrief },
    { name: 'videoThumbnailBrief', fn: videoThumbnailBrief },
    { name: 'videoThumbnailWideBrief', fn: videoThumbnailWideBrief },
  ];

  for (const { name, fn } of allPresets) {
    it(`${name} should have positive width and height`, () => {
      const brief = fn(mockContent);
      const dims = brief.dimensions;
      if (!dims) throw new Error('Expected dimensions');
      expect(dims.width).toBeGreaterThan(0);
      expect(dims.height).toBeGreaterThan(0);
    });

    it(`${name} should have a valid format`, () => {
      const brief = fn(mockContent);
      const fmt = brief.format;
      if (!fmt) throw new Error('Expected format');
      expect(['png', 'jpg', 'webp', 'svg']).toContain(fmt);
    });

    it(`${name} should pass content through`, () => {
      const brief = fn(mockContent);
      expect(brief.content.title).toBe(mockContent.title);
      expect(brief.content.summary).toBe(mockContent.summary);
    });
  }
});
