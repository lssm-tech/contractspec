/**
 * English (en) translation catalog for @contractspec/lib.image-gen.
 *
 * This is the primary / reference locale. All message keys must be present here.
 *
 * @module i18n/catalogs/en
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const enMessages = defineTranslation({
  meta: {
    key: 'image-gen.messages',
    version: '1.0.0',
    domain: 'image-gen',
    description:
      'All user-facing, LLM-facing, and developer-facing strings for the image-gen package',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'en',
  fallback: 'en',
  messages: {
    // ═════════════════════════════════════════════════════════════════════════
    // LLM System Prompts
    // ═════════════════════════════════════════════════════════════════════════

    'prompt.system.imagePromptEngineer': {
      value:
        'You are an expert image prompt engineer. Given a JSON brief containing title, summary, problems, solutions, purpose, style, and style tokens, produce a single detailed image generation prompt. The prompt should be vivid, specific, and optimized for AI image generation models. Focus on composition, lighting, color palette, and subject matter. Output only the prompt text, no JSON.',
      description: 'System prompt for LLM-based image prompt engineering',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Image Generation Strings
    // ═════════════════════════════════════════════════════════════════════════

    'image.generate.description': {
      value: 'Generate a {style} image for {purpose}',
      description: 'Description template for image generation tasks',
      placeholders: [
        { name: 'style', type: 'string' },
        { name: 'purpose', type: 'string' },
      ],
    },
    'image.prompt.featuring': {
      value: 'featuring {solutions}',
      description: 'Prompt fragment for featured solutions',
      placeholders: [{ name: 'solutions', type: 'string' }],
    },
    'image.prompt.industryContext': {
      value: '{industry} context',
      description: 'Prompt fragment for industry context',
      placeholders: [{ name: 'industry', type: 'string' }],
    },
    'image.error.noProvider': {
      value: 'No image provider configured',
      description: 'Error message when no ImageProvider is available',
    },
    'image.error.generationFailed': {
      value: 'Image generation failed',
      description: 'Error message when image generation fails',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Purpose Labels
    // ═════════════════════════════════════════════════════════════════════════

    'purpose.blogHero': {
      value: 'Blog hero image',
      description: 'Label for blog hero image purpose',
    },
    'purpose.socialOg': {
      value: 'Social media OG image',
      description: 'Label for Open Graph image purpose',
    },
    'purpose.socialTwitter': {
      value: 'Twitter card image',
      description: 'Label for Twitter card image purpose',
    },
    'purpose.socialInstagram': {
      value: 'Instagram image',
      description: 'Label for Instagram image purpose',
    },
    'purpose.landingHero': {
      value: 'Landing page hero',
      description: 'Label for landing page hero image purpose',
    },
    'purpose.videoThumbnail': {
      value: 'Video thumbnail',
      description: 'Label for video thumbnail purpose',
    },
    'purpose.emailHeader': {
      value: 'Email header',
      description: 'Label for email header image purpose',
    },
    'purpose.illustration': {
      value: 'Illustration',
      description: 'Label for illustration purpose',
    },
    'purpose.icon': {
      value: 'Icon',
      description: 'Label for icon purpose',
    },
  },
});
