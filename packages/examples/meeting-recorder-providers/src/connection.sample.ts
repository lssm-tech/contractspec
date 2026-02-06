import type { IntegrationConnection } from '@contractspec/lib.contracts/integrations/connection';

export const granolaMeetingRecorderConnection: IntegrationConnection = {
  meta: {
    id: 'conn-granola-demo',
    tenantId: 'acme-inc',
    integrationKey: 'meeting-recorder.granola',
    integrationVersion: '1',
    label: 'Granola Meeting Recorder',
    environment: 'production',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  ownershipMode: 'byok',
  config: {
    baseUrl: 'https://public-api.granola.ai',
    pageSize: 10,
  },
  secretProvider: 'vault',
  secretRef: 'vault://integrations/acme-inc/conn-granola-demo',
  status: 'connected',
};

export const tldvMeetingRecorderConnection: IntegrationConnection = {
  meta: {
    id: 'conn-tldv-demo',
    tenantId: 'acme-inc',
    integrationKey: 'meeting-recorder.tldv',
    integrationVersion: '1',
    label: 'tl;dv Meeting Recorder',
    environment: 'production',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  ownershipMode: 'byok',
  config: {
    baseUrl: 'https://pasta.tldv.io/v1alpha1',
    pageSize: 25,
  },
  secretProvider: 'vault',
  secretRef: 'vault://integrations/acme-inc/conn-tldv-demo',
  status: 'connected',
};

export const firefliesMeetingRecorderConnection: IntegrationConnection = {
  meta: {
    id: 'conn-fireflies-demo',
    tenantId: 'acme-inc',
    integrationKey: 'meeting-recorder.fireflies',
    integrationVersion: '1',
    label: 'Fireflies Meeting Recorder',
    environment: 'production',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  ownershipMode: 'byok',
  config: {
    baseUrl: 'https://api.fireflies.ai/graphql',
    transcriptsPageSize: 25,
  },
  secretProvider: 'vault',
  secretRef: 'vault://integrations/acme-inc/conn-fireflies-demo',
  status: 'connected',
};

export const fathomMeetingRecorderConnection: IntegrationConnection = {
  meta: {
    id: 'conn-fathom-demo',
    tenantId: 'acme-inc',
    integrationKey: 'meeting-recorder.fathom',
    integrationVersion: '1',
    label: 'Fathom Meeting Recorder',
    environment: 'production',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  ownershipMode: 'byok',
  config: {
    baseUrl: 'https://api.fathom.ai/external/v1',
    includeTranscript: true,
    includeSummary: true,
    includeActionItems: false,
    includeCrmMatches: false,
    triggeredFor: ['my_recordings'],
    maxPages: 5,
  },
  secretProvider: 'vault',
  secretRef: 'vault://integrations/acme-inc/conn-fathom-demo',
  status: 'connected',
};

export const meetingRecorderSampleConnections: IntegrationConnection[] = [
  granolaMeetingRecorderConnection,
  tldvMeetingRecorderConnection,
  firefliesMeetingRecorderConnection,
  fathomMeetingRecorderConnection,
];
