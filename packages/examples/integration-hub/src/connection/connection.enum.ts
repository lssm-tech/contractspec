import { defineEnum } from '@contractspec/lib.schema';

/**
 * Connection status enum.
 */
export const ConnectionStatusEnum = defineEnum('ConnectionStatus', [
  'PENDING',
  'CONNECTED',
  'DISCONNECTED',
  'ERROR',
  'EXPIRED',
]);

/**
 * Authentication method used by a connection.
 */
export const AuthTypeEnum = defineEnum('AuthType', [
  'api-key',
  'oauth2',
  'bearer',
  'header',
  'basic',
  'webhook-signing',
  'service-account',
]);

/**
 * Transport protocol for communicating with the external system.
 */
export const TransportTypeEnum = defineEnum('TransportType', [
  'rest',
  'mcp',
  'webhook',
  'sdk',
]);
