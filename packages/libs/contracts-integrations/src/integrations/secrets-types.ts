/**
 * Secret Provider types for integrations
 * These are core type definitions that don't require runtime dependencies.
 */

export interface SecretValue {
  data: Uint8Array;
  version?: string;
  metadata?: Record<string, string>;
}

export interface SecretProvider {
  id: string;
  canHandle(reference: string): boolean;
  getSecret(reference: string): Promise<SecretValue>;
}
