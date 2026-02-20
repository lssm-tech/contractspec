import { describe, it, expect } from 'bun:test';
import { StyleResolver } from './style-resolver';
import { IMAGE_PRESETS } from '../types';
import type { ImagePurpose, ImageStyle } from '../types';

const resolver = new StyleResolver();

// =============================================================================
// Purpose → Dimensions mapping
// =============================================================================

describe('StyleResolver - purpose dimensions', () => {
  const purposeDimensionMap: Record<
    ImagePurpose,
    { width: number; height: number }
  > = {
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

  for (const [purpose, expected] of Object.entries(purposeDimensionMap)) {
    it(`should map "${purpose}" to ${expected.width}x${expected.height}`, () => {
      const result = resolver.resolve(purpose as ImagePurpose);
      expect(result.dimensions).toEqual(expected);
    });
  }
});

// =============================================================================
// Style → Tokens mapping
// =============================================================================

describe('StyleResolver - style tokens', () => {
  const allStyles: ImageStyle[] = [
    'photorealistic',
    'illustration',
    '3d-render',
    'flat-design',
    'abstract',
    'minimalist',
    'branded',
  ];

  it('should default to photorealistic when no style provided', () => {
    const result = resolver.resolve('blog-hero');
    expect(result.styleTokens).toContain('professional photography');
    expect(result.styleTokens).toContain('high resolution');
  });

  for (const style of allStyles) {
    it(`should produce non-empty tokens for "${style}"`, () => {
      const result = resolver.resolve('blog-hero', style);
      expect(result.styleTokens.length).toBeGreaterThan(0);
    });
  }

  it('should produce correct tokens for illustration style', () => {
    const result = resolver.resolve('blog-hero', 'illustration');
    expect(result.styleTokens).toContain('digital illustration');
    expect(result.styleTokens).toContain('vibrant colors');
  });

  it('should produce correct tokens for 3d-render style', () => {
    const result = resolver.resolve('blog-hero', '3d-render');
    expect(result.styleTokens).toContain('3D render');
    expect(result.styleTokens).toContain('volumetric lighting');
  });

  it('should produce correct tokens for flat-design style', () => {
    const result = resolver.resolve('blog-hero', 'flat-design');
    expect(result.styleTokens).toContain('clean flat vector');
  });

  it('should produce correct tokens for abstract style', () => {
    const result = resolver.resolve('blog-hero', 'abstract');
    expect(result.styleTokens).toContain('abstract composition');
  });

  it('should produce correct tokens for minimalist style', () => {
    const result = resolver.resolve('blog-hero', 'minimalist');
    expect(result.styleTokens).toContain('minimalist design');
    expect(result.styleTokens).toContain('clean whitespace');
  });

  it('should produce correct tokens for branded style', () => {
    const result = resolver.resolve('blog-hero', 'branded');
    expect(result.styleTokens).toContain('brand-consistent design');
  });
});

// =============================================================================
// Negative tokens
// =============================================================================

describe('StyleResolver - negative tokens', () => {
  it('should always include base negative tokens', () => {
    const result = resolver.resolve('blog-hero');
    expect(result.negativeTokens).toContain('blurry');
    expect(result.negativeTokens).toContain('low quality');
    expect(result.negativeTokens).toContain('watermark');
    expect(result.negativeTokens).toContain('distorted');
    expect(result.negativeTokens).toContain('pixelated');
    expect(result.negativeTokens).toContain('text overlay');
  });
});

// =============================================================================
// Brand color overrides
// =============================================================================

describe('StyleResolver - brand colors', () => {
  it('should append primary color token', () => {
    const result = resolver.resolve('blog-hero', 'photorealistic', {
      primary: '#FF0000',
    });
    expect(result.styleTokens).toContain('primary color #FF0000 palette');
  });

  it('should append accent color token', () => {
    const result = resolver.resolve('blog-hero', 'photorealistic', {
      accent: '#00FF00',
    });
    expect(result.styleTokens).toContain('accent color #00FF00');
  });

  it('should append background color token', () => {
    const result = resolver.resolve('blog-hero', 'photorealistic', {
      background: '#0000FF',
    });
    expect(result.styleTokens).toContain('background color #0000FF');
  });

  it('should append all three when provided', () => {
    const result = resolver.resolve('blog-hero', 'photorealistic', {
      primary: '#FF0000',
      accent: '#00FF00',
      background: '#0000FF',
    });
    expect(result.styleTokens).toContain('primary color #FF0000 palette');
    expect(result.styleTokens).toContain('accent color #00FF00');
    expect(result.styleTokens).toContain('background color #0000FF');
  });

  it('should not add brand tokens when no brand provided', () => {
    const result = resolver.resolve('blog-hero', 'photorealistic');
    const brandTokens = result.styleTokens.filter(
      (t) =>
        t.includes('primary color') ||
        t.includes('accent color') ||
        t.includes('background color')
    );
    expect(brandTokens).toHaveLength(0);
  });
});

// =============================================================================
// Immutability
// =============================================================================

describe('StyleResolver - immutability', () => {
  it('should return fresh arrays (not shared references)', () => {
    const a = resolver.resolve('blog-hero', 'photorealistic');
    const b = resolver.resolve('blog-hero', 'photorealistic');
    expect(a.styleTokens).not.toBe(b.styleTokens);
    expect(a.negativeTokens).not.toBe(b.negativeTokens);
  });
});
