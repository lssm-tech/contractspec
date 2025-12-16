import type { TenantAppConfig } from '@lssm/lib.contracts/app-config/spec';

export const pocketFamilyOfficeTenantSample: TenantAppConfig = {
  meta: {
    id: 'tenant-pfo-sample',
    tenantId: 'tenant.family-office',
    appId: 'pocket-family-office',
    blueprintName: 'pocket-family-office.app',
    blueprintVersion: 1,
    environment: 'production',
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  featureFlags: [
    {
      key: 'voice-summaries',
      enabled: true,
      description: 'Enable spoken ElevenLabs summaries for daily briefings.',
    },
  ],
  integrations: [
    { slotId: 'primaryLLM', connectionId: 'conn-mistral-primary' },
    { slotId: 'primaryVectorDb', connectionId: 'conn-qdrant-finance' },
    { slotId: 'primaryStorage', connectionId: 'conn-gcs-documents' },
    { slotId: 'primaryOpenBanking', connectionId: 'conn-powens-primary' },
    { slotId: 'emailInbound', connectionId: 'conn-gmail-threads' },
    { slotId: 'emailOutbound', connectionId: 'conn-postmark-outbound' },
    { slotId: 'calendarScheduling', connectionId: 'conn-google-calendar' },
    { slotId: 'voicePlayback', connectionId: 'conn-elevenlabs-voice' },
    { slotId: 'smsNotifications', connectionId: 'conn-twilio-sms' },
    { slotId: 'paymentsProcessing', connectionId: 'conn-stripe-recurring' },
  ],
  knowledge: [
    {
      spaceKey: 'knowledge.financial-docs',
      scope: {
        workflows: [
          'pfo.workflow.process-uploaded-document',
          'pfo.workflow.generate-financial-summary',
        ],
      },
    },
    {
      spaceKey: 'knowledge.email-threads',
      scope: {
        workflows: ['pfo.workflow.ingest-email-threads'],
      },
    },
    {
      spaceKey: 'knowledge.financial-overview',
      scope: {
        workflows: [
          'pfo.workflow.sync-openbanking-transactions',
          'pfo.workflow.refresh-openbanking-balances',
          'pfo.workflow.generate-financial-summary',
          'pfo.workflow.generate-openbanking-overview',
        ],
      },
      required: false,
    },
  ],
  locales: {
    defaultLocale: 'en',
    enabledLocales: ['en'],
  },
  notes:
    'Sample tenant configuration for hackathon demos. Replace connection IDs with tenant-specific bindings when provisioning.',
};
