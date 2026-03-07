import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import { defineIntegration, type IntegrationSpec } from '../spec';

const STRATEGY_ENUM = [
  'official-api',
  'official-mcp',
  'aggregator-api',
  'aggregator-mcp',
  'unofficial',
] as const;

const DEFAULT_PROVIDED_CAPABILITIES = [
  { key: 'health.activities.read', version: '1.0.0' },
  { key: 'health.workouts.read', version: '1.0.0' },
  { key: 'health.sleep.read', version: '1.0.0' },
  { key: 'health.biometrics.read', version: '1.0.0' },
] as const;

export interface HealthProviderSpecInput {
  key: string;
  title: string;
  description: string;
  docsUrl: string;
  tags: string[];
  supportedModes?: ('managed' | 'byok')[];
  stability?: IntegrationSpec['meta']['stability'];
  byokSetupInstructions?: string;
  byokScopes?: string[];
  capabilities?: { key: string; version: string }[];
  defaultTransport?: (typeof STRATEGY_ENUM)[number];
}

export function defineHealthProviderSpec(
  input: HealthProviderSpecInput
): IntegrationSpec {
  return defineIntegration({
    meta: {
      key: input.key,
      version: '1.0.0',
      category: 'health',
      title: input.title,
      description: input.description,
      domain: 'health',
      owners: ['platform.integrations'],
      tags: ['health', 'wearables', ...input.tags],
      stability: input.stability ?? StabilityEnum.Experimental,
    },
    supportedModes: input.supportedModes ?? ['managed', 'byok'],
    capabilities: {
      provides: input.capabilities ?? [...DEFAULT_PROVIDED_CAPABILITIES],
    },
    configSchema: {
      schema: {
        type: 'object',
        properties: {
          apiBaseUrl: {
            type: 'string',
            description:
              'Optional API base URL override for provider-specific regional or partner endpoints.',
          },
          mcpUrl: {
            type: 'string',
            description:
              'Optional MCP endpoint URL for provider tool transport.',
          },
          oauthTokenUrl: {
            type: 'string',
            description:
              'Optional OAuth token endpoint override used for access-token refresh flows.',
          },
          defaultTransport: {
            type: 'string',
            enum: [...STRATEGY_ENUM],
            description:
              'Preferred transport strategy used before fallbacks are attempted.',
          },
          strategyOrder: {
            type: 'array',
            items: {
              type: 'string',
              enum: [...STRATEGY_ENUM],
            },
            description:
              'Ordered transport fallback strategy. Defaults to official API -> official MCP -> aggregator API -> aggregator MCP -> unofficial.',
          },
          allowUnofficial: {
            type: 'boolean',
            description:
              'Must be true to allow unofficial/automation connectors as fallback.',
          },
          unofficialAllowList: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Optional allowlist of provider keys allowed to use unofficial connectors.',
          },
        },
      },
      example: {
        defaultTransport: input.defaultTransport ?? 'official-api',
        strategyOrder: [...STRATEGY_ENUM],
        allowUnofficial: false,
        unofficialAllowList: [],
      },
    },
    secretSchema: {
      schema: {
        type: 'object',
        properties: {
          apiKey: { type: 'string' },
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
          tokenExpiresAt: { type: 'string' },
          clientId: { type: 'string' },
          clientSecret: { type: 'string' },
          mcpAccessToken: { type: 'string' },
          username: { type: 'string' },
          password: { type: 'string' },
        },
      },
      example: {
        apiKey: 'provider-api-key',
        accessToken: 'oauth-access-token',
        refreshToken: 'oauth-refresh-token',
      },
    },
    healthCheck: {
      method: 'list',
      timeoutMs: 10000,
    },
    docsUrl: input.docsUrl,
    byokSetup: {
      setupInstructions:
        input.byokSetupInstructions ??
        'Create provider credentials, set allowed scopes, and store credentials in secret provider.',
      requiredScopes: input.byokScopes,
    },
  });
}
