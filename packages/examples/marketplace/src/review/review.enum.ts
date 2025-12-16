import { defineEnum } from '@lssm/lib.schema';

/**
 * Review status enum.
 */
export const ReviewStatusEnum = defineEnum('ReviewStatus', [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'FLAGGED',
]);


