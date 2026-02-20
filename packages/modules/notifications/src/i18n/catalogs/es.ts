/**
 * Spanish (es) translation catalog for @contractspec/module.notifications.
 *
 * @module i18n/catalogs/es
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const esMessages = defineTranslation({
  meta: {
    key: 'notifications.messages',
    version: '1.0.0',
    domain: 'notifications',
    description: 'Template and channel strings (Spanish)',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'es',
  fallback: 'en',
  messages: {
    // ── Template names & descriptions ─────────────────────────────────

    'template.welcome.name': {
      value: 'Bienvenida',
      description: 'Welcome template display name',
    },
    'template.welcome.description': {
      value: 'Enviado cuando un usuario se registra.',
      description: 'Welcome template description',
    },
    'template.orgInvite.name': {
      value: 'Invitaci\u00f3n a la organizaci\u00f3n',
      description: 'Org invite template display name',
    },
    'template.orgInvite.description': {
      value: 'Enviado cuando un usuario es invitado a una organizaci\u00f3n.',
      description: 'Org invite template description',
    },
    'template.mention.name': {
      value: 'Menci\u00f3n',
      description: 'Mention template display name',
    },
    'template.mention.description': {
      value: 'Enviado cuando un usuario es mencionado.',
      description: 'Mention template description',
    },

    // ── Channel messages ──────────────────────────────────────────────

    'channel.webhook.noUrl': {
      value: 'No se ha configurado una URL de webhook',
      description: 'Error when webhook channel has no URL',
    },
  },
});
