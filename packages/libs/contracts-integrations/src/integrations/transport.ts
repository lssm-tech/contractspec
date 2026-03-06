/**
 * Generic transport abstraction for integration providers.
 *
 * Replaces the domain-specific HealthTransportStrategy with a
 * first-class, discriminated-union transport config that every
 * IntegrationSpec can declare and every connection can activate.
 */

export type IntegrationTransportType = 'rest' | 'mcp' | 'webhook' | 'sdk';

export interface RestTransportConfig {
  type: 'rest';
  /** Default base URL for the provider API. */
  baseUrl?: string;
  /** Headers sent with every request (e.g. content-type). */
  defaultHeaders?: Record<string, string>;
  /** Header name used to negotiate the API version (e.g. Stripe-Version). */
  apiVersionHeader?: string;
  /** Rate-limit response header names for automatic back-pressure. */
  rateLimitHeaders?: {
    remaining: string;
    reset: string;
    limit?: string;
  };
  /** Response content types accepted (default: application/json). */
  acceptContentTypes?: string[];
}

export interface McpTransportConfig {
  type: 'mcp';
  /** Underlying MCP wire transport. */
  transport: 'stdio' | 'http' | 'sse';
  /** Remote MCP server URL (http/sse). */
  url?: string;
  /** Local MCP server command (stdio). */
  command?: string;
  /** Arguments for the local command. */
  args?: string[];
  /** Optional tool-name prefix to avoid collisions. */
  toolPrefix?: string;
}

export interface WebhookTransportConfig {
  type: 'webhook';
  /** Inbound webhook configuration (provider pushes to us). */
  inbound?: {
    signatureHeader: string;
    signingAlgorithm: 'hmac-sha256' | 'hmac-sha1' | 'ed25519';
    /** Whether the provider supports webhook registration via API. */
    registrationSupported?: boolean;
  };
  /** Outbound webhook configuration (we push to provider). */
  outbound?: {
    deliveryRetries: number;
    timeoutMs: number;
  };
}

export interface SdkTransportConfig {
  type: 'sdk';
  /** npm package name of the official SDK. */
  packageName: string;
  /** Minimum supported SDK version (semver). */
  minVersion?: string;
  /** Language/runtime the SDK targets. */
  runtime?: 'node' | 'browser' | 'universal';
}

export type IntegrationTransportConfig =
  | RestTransportConfig
  | McpTransportConfig
  | WebhookTransportConfig
  | SdkTransportConfig;

/**
 * Extract a specific transport config from an array by type.
 */
export function findTransportConfig<T extends IntegrationTransportType>(
  transports: IntegrationTransportConfig[],
  type: T
): Extract<IntegrationTransportConfig, { type: T }> | undefined {
  return transports.find(
    (t): t is Extract<IntegrationTransportConfig, { type: T }> =>
      t.type === type
  );
}

/**
 * Check whether a given transport type is available in a spec's transports.
 */
export function supportsTransport(
  transports: IntegrationTransportConfig[],
  type: IntegrationTransportType
): boolean {
  return transports.some((t) => t.type === type);
}
