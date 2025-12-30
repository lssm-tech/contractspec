import { defineEnum } from '@contractspec/lib.schema';

/**
 * Query type enum.
 */
export const QueryTypeEnum = defineEnum('QueryType', [
  'SQL',
  'METRIC',
  'AGGREGATION',
  'CUSTOM',
]);
