import { StabilityEnum } from '../../ownership';
import type { IntegrationSpec, IntegrationSpecRegistry } from '../spec';

export const gcsStorageIntegrationSpec: IntegrationSpec = {
  meta: {
    key: 'storage.gcs',
    version: 1,
    category: 'storage',
    displayName: 'Google Cloud Storage',
    title: 'Google Cloud Storage Buckets',
    description:
      'Google Cloud Storage integration for object storage and retrieval.',
    domain: 'infrastructure',
    owners: ['platform.infrastructure'],
    tags: ['storage', 'gcs', 'google-cloud'],
    stability: StabilityEnum.Beta,
  },
  supportedModes: ['managed', 'byok'],
  capabilities: {
    provides: [{ key: 'storage.objects', version: 1 }],
  },
  configSchema: {
    schema: {
      type: 'object',
      required: ['bucket'],
      properties: {
        bucket: {
          type: 'string',
          description: 'Primary bucket name used for storing objects.',
        },
        prefix: {
          type: 'string',
          description: 'Optional prefix applied to object keys.',
        },
      },
    },
    example: {
      bucket: 'pfo-tenant-assets',
      prefix: 'documents/',
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          description:
            'Service account type field from Google credentials JSON (if provided).',
        },
        client_email: { type: 'string' },
        private_key: { type: 'string' },
        project_id: { type: 'string' },
      },
    },
    example: {
      type: 'service_account',
      client_email: 'svc-account@example.iam.gserviceaccount.com',
      private_key: '-----BEGIN PRIVATE KEY-----...',
      project_id: 'example-project',
    },
  },
  healthCheck: {
    method: 'ping',
    timeoutMs: 4000,
  },
  docsUrl: 'https://cloud.google.com/storage/docs/apis',
  constraints: {
    quotas: {
      storageGb: 5120,
    },
  },
  byokSetup: {
    setupInstructions:
      'Create a Google Cloud service account with Storage Object Admin role and upload the JSON credentials to the secret store.',
  },
};

export function registerGcsStorageIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(gcsStorageIntegrationSpec);
}


