import type { IntegrationConnection } from '@contractspec/lib.contracts/integrations/connection';

const now = new Date();

const baseMeta = {
  tenantId: 'tenant.family-office',
  createdAt: now,
  updatedAt: now,
} as const;

export const pocketFamilyOfficeConnections: IntegrationConnection[] = [
  {
    meta: {
      ...baseMeta,
      id: 'conn-mistral-primary',
      integrationKey: 'ai-llm.mistral',
      integrationVersion: '1.0.0',
      label: 'Mistral Primary',
    },
    ownershipMode: 'managed',
    config: {
      model: 'mistral-large-latest',
      embeddingModel: 'mistral-embed',
    },
    secretProvider: 'gcp-secret-manager',
    secretRef:
      'gcp://projects/pfo-hackathon/secrets/mistral-api-key/versions/latest',
    status: 'connected',
    health: {
      status: 'connected',
      checkedAt: now,
      latencyMs: 180,
    },
  },
  {
    meta: {
      ...baseMeta,
      id: 'conn-qdrant-finance',
      integrationKey: 'vectordb.qdrant',
      integrationVersion: '1.0.0',
      label: 'Qdrant Finance Cluster',
    },
    ownershipMode: 'managed',
    config: {
      apiUrl: 'https://qdrant.pfo.internal',
      collectionPrefix: 'tenant-family-office',
    },
    secretProvider: 'gcp-secret-manager',
    secretRef:
      'gcp://projects/pfo-hackathon/secrets/qdrant-api-key/versions/latest',
    status: 'connected',
    health: { status: 'connected', checkedAt: now, latencyMs: 95 },
  },
  {
    meta: {
      ...baseMeta,
      id: 'conn-gcs-documents',
      integrationKey: 'storage.gcs',
      integrationVersion: '1.0.0',
      label: 'GCS Documents Bucket',
    },
    ownershipMode: 'managed',
    config: {
      bucket: 'pfo-uploads',
      prefix: 'financial-docs/',
    },
    secretProvider: 'gcp-secret-manager',
    secretRef:
      'gcp://projects/pfo-hackathon/secrets/gcs-service-account/versions/latest',
    status: 'connected',
    health: { status: 'connected', checkedAt: now, latencyMs: 60 },
  },
  {
    meta: {
      ...baseMeta,
      id: 'conn-gmail-threads',
      integrationKey: 'email.gmail',
      integrationVersion: '1.0.0',
      label: 'Gmail Household Threads',
    },
    ownershipMode: 'byok',
    config: {
      labelIds: ['FINANCE', 'INBOX'],
      includeSpamTrash: false,
    },
    secretProvider: 'gcp-secret-manager',
    secretRef:
      'gcp://projects/pfo-hackathon/secrets/gmail-refresh-token/versions/latest',
    status: 'connected',
    health: { status: 'connected', checkedAt: now, latencyMs: 320 },
  },
  {
    meta: {
      ...baseMeta,
      id: 'conn-postmark-outbound',
      integrationKey: 'email.postmark',
      integrationVersion: '1.0.0',
      label: 'Postmark Transactional',
    },
    ownershipMode: 'managed',
    config: {
      messageStream: 'outbound',
      fromEmail: 'family.office@pfo.dev',
    },
    secretProvider: 'gcp-secret-manager',
    secretRef:
      'gcp://projects/pfo-hackathon/secrets/postmark-server-token/versions/latest',
    status: 'connected',
    health: { status: 'connected', checkedAt: now, latencyMs: 210 },
  },
  {
    meta: {
      ...baseMeta,
      id: 'conn-google-calendar',
      integrationKey: 'calendar.google',
      integrationVersion: '1.0.0',
      label: 'Household Calendar',
    },
    ownershipMode: 'managed',
    config: {
      calendarId: 'primary',
    },
    secretProvider: 'gcp-secret-manager',
    secretRef:
      'gcp://projects/pfo-hackathon/secrets/google-calendar-service-account/versions/latest',
    status: 'connected',
    health: { status: 'connected', checkedAt: now, latencyMs: 140 },
  },
  {
    meta: {
      ...baseMeta,
      id: 'conn-elevenlabs-voice',
      integrationKey: 'ai-voice.elevenlabs',
      integrationVersion: '1.0.0',
      label: 'ElevenLabs Voice',
    },
    ownershipMode: 'byok',
    config: {
      defaultVoiceId: 'pNInz6obpgDQGcFmaJgB',
    },
    secretProvider: 'gcp-secret-manager',
    secretRef:
      'gcp://projects/pfo-hackathon/secrets/elevenlabs-api-key/versions/latest',
    status: 'connected',
    health: { status: 'connected', checkedAt: now, latencyMs: 250 },
  },
  {
    meta: {
      ...baseMeta,
      id: 'conn-twilio-sms',
      integrationKey: 'sms.twilio',
      integrationVersion: '1.0.0',
      label: 'Twilio SMS',
    },
    ownershipMode: 'managed',
    config: {
      fromNumber: '+15552340000',
    },
    secretProvider: 'gcp-secret-manager',
    secretRef:
      'gcp://projects/pfo-hackathon/secrets/twilio-auth-token/versions/latest',
    status: 'connected',
    health: { status: 'connected', checkedAt: now, latencyMs: 180 },
  },
  {
    meta: {
      ...baseMeta,
      id: 'conn-stripe-recurring',
      integrationKey: 'payments.stripe',
      integrationVersion: '1.0.0',
      label: 'Stripe Recurring Billing',
    },
    ownershipMode: 'managed',
    config: {
      accountId: 'acct_1PFOHACKATHON',
      region: 'eu-west-1',
    },
    secretProvider: 'gcp-secret-manager',
    secretRef:
      'gcp://projects/pfo-hackathon/secrets/stripe-secret-key/versions/latest',
    status: 'connected',
    health: { status: 'connected', checkedAt: now, latencyMs: 220 },
  },
  {
    meta: {
      ...baseMeta,
      id: 'conn-powens-primary',
      integrationKey: 'openbanking.powens',
      integrationVersion: '1.0.0',
      label: 'Powens Open Banking',
    },
    ownershipMode: 'byok',
    config: {
      environment: 'sandbox',
      baseUrl: 'https://api-sandbox.powens.com/v2',
    },
    secretProvider: 'gcp-secret-manager',
    secretRef:
      'gcp://projects/pfo-hackathon/secrets/powens-credentials/versions/latest',
    status: 'connected',
    health: { status: 'connected', checkedAt: now, latencyMs: 410 },
  },
];

export function getPocketFamilyOfficeConnection(
  connectionId: string
): IntegrationConnection | undefined {
  return pocketFamilyOfficeConnections.find(
    (connection) => connection.meta.id === connectionId
  );
}
