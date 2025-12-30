import { defineEnum } from '@contractspec/lib.schema';

/**
 * Store status enum.
 */
export const StoreStatusEnum = defineEnum('StoreStatus', [
  'PENDING',
  'ACTIVE',
  'SUSPENDED',
  'CLOSED',
]);
