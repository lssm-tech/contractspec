/**
 * French (fr) translation catalog for @contractspec/module.notifications.
 *
 * @module i18n/catalogs/fr
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const frMessages = defineTranslation({
  meta: {
    key: 'notifications.messages',
    version: '1.0.0',
    domain: 'notifications',
    description: 'Template and channel strings (French)',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'fr',
  fallback: 'en',
  messages: {
    // ── Template names & descriptions ─────────────────────────────────

    'template.welcome.name': {
      value: 'Bienvenue',
      description: 'Welcome template display name',
    },
    'template.welcome.description': {
      value: "Envoy\u00e9 lorsqu'un utilisateur s'inscrit.",
      description: 'Welcome template description',
    },
    'template.orgInvite.name': {
      value: "Invitation \u00e0 l'organisation",
      description: 'Org invite template display name',
    },
    'template.orgInvite.description': {
      value:
        "Envoy\u00e9 lorsqu'un utilisateur est invit\u00e9 \u00e0 une organisation.",
      description: 'Org invite template description',
    },
    'template.mention.name': {
      value: 'Mention',
      description: 'Mention template display name',
    },
    'template.mention.description': {
      value: "Envoy\u00e9 lorsqu'un utilisateur est mentionn\u00e9.",
      description: 'Mention template description',
    },

    // ── Channel messages ──────────────────────────────────────────────

    'channel.webhook.noUrl': {
      value: 'Aucune URL de webhook configur\u00e9e',
      description: 'Error when webhook channel has no URL',
    },
  },
});
