import { defineEnum } from '@lssm/lib.schema';

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


