/**
 * English (en) translation catalog for @contractspec/module.notifications.
 *
 * @module i18n/catalogs/en
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const enMessages = defineTranslation({
  meta: {
    key: 'notifications.messages',
    version: '1.0.0',
    domain: 'notifications',
    description: 'Template and channel strings for the notifications module',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'en',
  fallback: 'en',
  messages: {
    // ── Template names & descriptions ─────────────────────────────────

    'template.welcome.name': {
      value: 'Welcome',
      description: 'Welcome template display name',
    },
    'template.welcome.description': {
      value: 'Sent when a user signs up.',
      description: 'Welcome template description',
    },
    'template.orgInvite.name': {
      value: 'Organization Invitation',
      description: 'Org invite template display name',
    },
    'template.orgInvite.description': {
      value: 'Sent when a user is invited to an organization.',
      description: 'Org invite template description',
    },
    'template.mention.name': {
      value: 'Mention',
      description: 'Mention template display name',
    },
    'template.mention.description': {
      value: 'Sent when a user is mentioned.',
      description: 'Mention template description',
    },

    // ── Channel messages ──────────────────────────────────────────────

    'channel.webhook.noUrl': {
      value: 'No webhook URL configured',
      description: 'Error when webhook channel has no URL',
    },
  },
});
