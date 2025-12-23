import { defineEnum } from '@lssm/lib.schema';

/**
 * Product status enum.
 */
export const ProductStatusEnum = defineEnum('ProductStatus', [
  'DRAFT',
  'PENDING_REVIEW',
  'ACTIVE',
  'OUT_OF_STOCK',
  'DISCONTINUED',
  'REJECTED',
]);
