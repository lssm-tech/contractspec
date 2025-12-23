import { defineEnum } from '@lssm/lib.schema';

/**
 * Sync direction enum.
 */
export const SyncDirectionEnum = defineEnum('SyncDirection', [
  'INBOUND',
  'OUTBOUND',
  'BIDIRECTIONAL',
]);

/**
 * Sync status enum.
 */
export const SyncStatusEnum = defineEnum('SyncStatus', [
  'PENDING',
  'RUNNING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
]);

/**
 * Mapping type enum.
 */
export const MappingTypeEnum = defineEnum('MappingType', [
  'DIRECT',
  'TRANSFORM',
  'LOOKUP',
  'CONSTANT',
  'COMPUTED',
]);
