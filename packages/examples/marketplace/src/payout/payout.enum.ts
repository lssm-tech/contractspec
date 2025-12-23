import { defineEnum } from '@lssm/lib.schema';

/**
 * Payout status enum.
 */
export const PayoutStatusEnum = defineEnum('PayoutStatus', [
  'PENDING',
  'PROCESSING',
  'PAID',
  'FAILED',
  'CANCELLED',
]);
