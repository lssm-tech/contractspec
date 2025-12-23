import { defineEnum } from '@lssm/lib.schema';

/**
 * Deal status enum.
 */
export const DealStatusEnum = defineEnum('DealStatus', [
  'OPEN',
  'WON',
  'LOST',
  'STALE',
]);

/**
 * Deal status filter enum.
 */
export const DealStatusFilterEnum = defineEnum('DealStatusFilter', [
  'OPEN',
  'WON',
  'LOST',
  'all',
]);
