/**
 * Typed message keys for the notifications i18n system.
 *
 * Organized by domain: template (names/descriptions), channel (errors).
 *
 * @module i18n/keys
 */

// ─────────────────────────────────────────────────────────────────────────────
// Template Names & Descriptions
// ─────────────────────────────────────────────────────────────────────────────

export const TEMPLATE_KEYS = {
  'template.welcome.name': 'template.welcome.name',
  'template.welcome.description': 'template.welcome.description',
  'template.orgInvite.name': 'template.orgInvite.name',
  'template.orgInvite.description': 'template.orgInvite.description',
  'template.mention.name': 'template.mention.name',
  'template.mention.description': 'template.mention.description',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Channel Messages
// ─────────────────────────────────────────────────────────────────────────────

export const CHANNEL_KEYS = {
  'channel.webhook.noUrl': 'channel.webhook.noUrl',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Combined Keys
// ─────────────────────────────────────────────────────────────────────────────

export const I18N_KEYS = {
  ...TEMPLATE_KEYS,
  ...CHANNEL_KEYS,
} as const;

/** Union type of all valid notifications i18n keys */
export type NotificationsMessageKey = keyof typeof I18N_KEYS;
