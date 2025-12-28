import { defineEnum } from '@contractspec/lib.schema';

/**
 * Integration status enum.
 */
export const IntegrationStatusEnum = defineEnum('IntegrationStatus', [
  'DRAFT',
  'ACTIVE',
  'PAUSED',
  'ERROR',
  'ARCHIVED',
]);
