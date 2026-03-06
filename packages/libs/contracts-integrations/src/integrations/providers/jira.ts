import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';
import type { IntegrationTransportConfig } from '../transport';
import type { IntegrationAuthConfig } from '../auth';

export const jiraIntegrationSpec = defineIntegration({
  meta: {
    key: 'project-management.jira',
    version: '1.0.0',
    category: 'project-management',
    title: 'Jira Cloud',
    description: 'Jira Cloud integration for creating and tracking work items.',
    domain: 'productivity',
    owners: ['@platform.integrations'],
    tags: ['project-management', 'jira'],
    stability: StabilityEnum.Beta,
  },
  supportedModes: ['managed', 'byok'],
  transports: [
    { type: 'rest' },
    {
      type: 'webhook',
      inbound: {
        signatureHeader: 'x-atlassian-webhook-signature',
        signingAlgorithm: 'hmac-sha256',
      },
    },
  ],
  preferredTransport: 'rest',
  supportedAuthMethods: [
    { type: 'basic' },
    {
      type: 'oauth2',
      grantType: 'authorization_code',
      authorizationUrl: 'https://auth.atlassian.com/authorize',
      tokenUrl: 'https://auth.atlassian.com/oauth/token',
      scopes: ['read:jira-work', 'write:jira-work'],
    },
  ],
  capabilities: {
    provides: [{ key: 'project-management.work-items', version: '1.0.0' }],
  },
  configSchema: {
    schema: {
      type: 'object',
      required: ['siteUrl'],
      properties: {
        siteUrl: {
          type: 'string',
          description:
            'Jira Cloud site URL (e.g., https://acme.atlassian.net).',
        },
        projectKey: {
          type: 'string',
          description: 'Default Jira project key for new issues.',
        },
        issueType: {
          type: 'string',
          description: 'Default Jira issue type (e.g., Task, Story).',
        },
        defaultLabels: {
          type: 'array',
          items: { type: 'string' },
          description: 'Labels applied to each issue by default.',
        },
        issueTypeMap: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description:
            'Optional mapping from work item types to Jira issue types.',
        },
      },
    },
    example: {
      siteUrl: 'https://acme.atlassian.net',
      projectKey: 'PM',
      issueType: 'Task',
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['email', 'apiToken'],
      properties: {
        email: {
          type: 'string',
          description: 'Jira account email used for API token auth.',
        },
        apiToken: {
          type: 'string',
          description: 'Jira Cloud API token for the account.',
        },
      },
    },
    example: {
      email: 'user@acme.com',
      apiToken: 'jira_api_token',
    },
  },
  healthCheck: {
    method: 'custom',
    timeoutMs: 4000,
  },
  docsUrl: 'https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/',
  constraints: {},
  byokSetup: {
    setupInstructions:
      'Create a Jira API token and store it with the associated account email.',
    keyRotationSupported: false,
    quotaTrackingSupported: false,
  },
});

export function registerJiraIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(jiraIntegrationSpec);
}
