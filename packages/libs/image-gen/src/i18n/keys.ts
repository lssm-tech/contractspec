/**
 * Typed message keys for the image-gen i18n system.
 *
 * All translatable strings in the package are referenced by these keys.
 * Organized by domain: prompt, image, purpose.
 *
 * @module i18n/keys
 */

// ─────────────────────────────────────────────────────────────────────────────
// LLM System Prompts
// ─────────────────────────────────────────────────────────────────────────────

export const PROMPT_KEYS = {
  /** Image prompt engineer system prompt */
  'prompt.system.imagePromptEngineer': 'prompt.system.imagePromptEngineer',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Image Generation Strings
// ─────────────────────────────────────────────────────────────────────────────

export const IMAGE_KEYS = {
  /** "Generate a {style} image for {purpose}" */
  'image.generate.description': 'image.generate.description',
  /** "Featuring {solutions}" */
  'image.prompt.featuring': 'image.prompt.featuring',
  /** "{industry} context" */
  'image.prompt.industryContext': 'image.prompt.industryContext',
  /** "No image provider configured" */
  'image.error.noProvider': 'image.error.noProvider',
  /** "Image generation failed" */
  'image.error.generationFailed': 'image.error.generationFailed',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Purpose Labels
// ─────────────────────────────────────────────────────────────────────────────

export const PURPOSE_KEYS = {
  /** "Blog hero image" */
  'purpose.blogHero': 'purpose.blogHero',
  /** "Social media OG image" */
  'purpose.socialOg': 'purpose.socialOg',
  /** "Twitter card image" */
  'purpose.socialTwitter': 'purpose.socialTwitter',
  /** "Instagram image" */
  'purpose.socialInstagram': 'purpose.socialInstagram',
  /** "Landing page hero" */
  'purpose.landingHero': 'purpose.landingHero',
  /** "Video thumbnail" */
  'purpose.videoThumbnail': 'purpose.videoThumbnail',
  /** "Email header" */
  'purpose.emailHeader': 'purpose.emailHeader',
  /** "Illustration" */
  'purpose.illustration': 'purpose.illustration',
  /** "Icon" */
  'purpose.icon': 'purpose.icon',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Combined Keys
// ─────────────────────────────────────────────────────────────────────────────

export const I18N_KEYS = {
  ...PROMPT_KEYS,
  ...IMAGE_KEYS,
  ...PURPOSE_KEYS,
} as const;

/** Union type of all valid image-gen i18n keys */
export type ImageGenMessageKey = keyof typeof I18N_KEYS;
