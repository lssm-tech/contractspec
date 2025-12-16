import { defineEnum } from '@lssm/lib.schema';

/**
 * Instance status enum.
 */
export const InstanceStatusEnum = defineEnum('InstanceStatus', [
  'PENDING',
  'RUNNING',
  'WAITING',
  'PAUSED',
  'COMPLETED',
  'CANCELLED',
  'FAILED',
  'TIMEOUT',
]);
