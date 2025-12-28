import { defineEnum } from '@contractspec/lib.schema';

/**
 * Tool category enum.
 */
export const ToolCategoryEnum = defineEnum('ToolCategory', [
  'RETRIEVAL',
  'COMPUTATION',
  'COMMUNICATION',
  'INTEGRATION',
  'UTILITY',
  'CUSTOM',
]);

/**
 * Tool status enum.
 */
export const ToolStatusEnum = defineEnum('ToolStatus', [
  'DRAFT',
  'ACTIVE',
  'DEPRECATED',
  'DISABLED',
]);

/**
 * Implementation type enum.
 */
export const ImplementationTypeEnum = defineEnum('ImplementationType', [
  'http',
  'function',
  'workflow',
]);
