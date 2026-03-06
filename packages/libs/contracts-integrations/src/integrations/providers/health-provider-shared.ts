import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import { defineIntegration, type IntegrationSpec } from '../spec';
import type { IntegrationTransportConfig } from '../transport';
import type { IntegrationAuthConfig } from '../auth';

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

const HEALTH_DEFAULT_TRANSPORTS: IntegrationTransportConfig[] = [
  { type: 'rest' },
  { type: 'mcp', transport: 'http' },
  {
    type: 'webhook',
    inbound: {
      signatureHeader: 'x-webhook-signature',
      signingAlgorithm: 'hmac-sha256',
    },
  },
];

const HEALTH_DEFAULT_AUTH_METHODS: IntegrationAuthConfig[] = [
  { type: 'oauth2', grantType: 'authorization_code', tokenUrl: '', scopes: [] },
  { type: 'api-key' },
  { type: 'bearer' },
  { type: 'basic' },
];

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
  /** Override default transports for this health provider. */
  transports?: IntegrationTransportConfig[];
  /** Override default auth methods for this health provider. */
  supportedAuthMethods?: IntegrationAuthConfig[];
  /** OAuth token endpoint URL (populates oauth2 auth config). */
  oauthTokenUrl?: string;
}

export function defineHealthProviderSpec(
  input: HealthProviderSpecInput
): IntegrationSpec {
  const authMethods =
    input.supportedAuthMethods ?? buildHealthAuthMethods(input);

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
    transports: input.transports ?? HEALTH_DEFAULT_TRANSPORTS,
    preferredTransport: 'rest',
    supportedAuthMethods: authMethods,
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
      keyRotationSupported: false,
      quotaTrackingSupported: false,
    },
  });
}

function buildHealthAuthMethods(
  input: HealthProviderSpecInput
): IntegrationAuthConfig[] {
  if (input.oauthTokenUrl) {
    return HEALTH_DEFAULT_AUTH_METHODS.map((m) => {
      if (m.type === 'oauth2') {
        return {
          ...m,
          tokenUrl: input.oauthTokenUrl!,
          scopes: input.byokScopes ?? [],
        };
      }
      return m;
    });
  }
  return [...HEALTH_DEFAULT_AUTH_METHODS];
}
