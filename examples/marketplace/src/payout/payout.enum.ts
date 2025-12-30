import { defineEnum } from '@contractspec/lib.schema';

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
