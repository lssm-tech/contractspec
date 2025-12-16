import { defineEnum } from '@lssm/lib.schema';

/**
 * Store status enum.
 */
export const StoreStatusEnum = defineEnum('StoreStatus', [
  'PENDING',
  'ACTIVE',
  'SUSPENDED',
  'CLOSED',
]);
