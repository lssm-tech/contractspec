import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';
import type { IntegrationTransportConfig } from '../transport';
import type { IntegrationAuthConfig } from '../auth';
import type { IntegrationVersionPolicy } from '../versioning';

export const messagingGithubIntegrationSpec = defineIntegration({
  meta: {
    key: 'messaging.github',
    version: '1.0.0',
    category: 'messaging',
    title: 'GitHub Messaging Bridge',
    description:
      'GitHub integration for issue and pull request comment workflows backed by webhook events.',
    domain: 'developer-experience',
    owners: ['platform.messaging'],
    tags: ['messaging', 'github', 'pull-requests'],
    stability: StabilityEnum.Beta,
  },
  supportedModes: ['managed', 'byok'],
  transports: [
    { type: 'rest', baseUrl: 'https://api.github.com', apiVersionHeader: 'X-GitHub-Api-Version' },
    { type: 'webhook', inbound: { signatureHeader: 'x-hub-signature-256', signingAlgorithm: 'hmac-sha256' } },
  ],
  preferredTransport: 'rest',
  supportedAuthMethods: [
    { type: 'bearer' },
    { type: 'oauth2', grantType: 'authorization_code', authorizationUrl: 'https://github.com/login/oauth/authorize', tokenUrl: 'https://github.com/login/oauth/access_token', scopes: ['repo', 'read:org'] },
    { type: 'webhook-signing', algorithm: 'hmac-sha256', signatureHeader: 'x-hub-signature-256' },
  ],
  versionPolicy: {
    currentVersion: '2022-11-28',
    supportedVersions: [{ version: '2022-11-28', status: 'stable' }],
    versionHeader: 'X-GitHub-Api-Version',
  },
  capabilities: {
    provides: [
      { key: 'messaging.inbound', version: '1.0.0' },
      { key: 'messaging.outbound', version: '1.0.0' },
    ],
  },
  configSchema: {
    schema: {
      type: 'object',
      properties: {
        defaultOwner: {
          type: 'string',
          description: 'Optional default GitHub repository owner.',
        },
        defaultRepo: {
          type: 'string',
          description: 'Optional default GitHub repository name.',
        },
        apiBaseUrl: {
          type: 'string',
          description:
            'Optional GitHub REST API base URL (useful for enterprise instances).',
        },
      },
    },
    example: {
      defaultOwner: 'lssm-tech',
      defaultRepo: 'contractspec',
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['token', 'webhookSecret'],
      properties: {
        token: {
          type: 'string',
          description:
            'GitHub API token used to post comments and automation messages.',
        },
        webhookSecret: {
          type: 'string',
          description:
            'Secret used to verify inbound GitHub webhook signatures.',
        },
      },
    },
    example: {
      token: 'ghp_***',
      webhookSecret: '***',
    },
  },
  healthCheck: {
    method: 'custom',
    timeoutMs: 4000,
  },
  docsUrl: 'https://docs.github.com/en/rest',
  constraints: {
    rateLimit: {
      rpm: 300,
    },
  },
  byokSetup: {
    setupInstructions:
      'Create a GitHub token or app installation token with repository access and configure the webhook secret.',
    requiredScopes: ['repo', 'read:org'],
    keyRotationSupported: true,
    quotaTrackingSupported: false,
  },
});

export function registerMessagingGithubIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(messagingGithubIntegrationSpec);
}
