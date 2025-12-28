import { defineEnum } from '@contractspec/lib.schema';

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
