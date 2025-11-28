import {
  defineEntity,
  defineEntityEnum,
  field,
  index,
} from '@lssm/lib.schema/entity';
import { z } from 'zod';

/**
 * Tool category for organization and filtering
 */
export const ToolCategoryEnum = defineEntityEnum({
  name: 'ToolCategory',
  values: [
    'RETRIEVAL', // Search, RAG, document retrieval
    'COMPUTATION', // Math, code execution, data processing
    'COMMUNICATION', // Email, messaging, notifications
    'INTEGRATION', // External API integrations
    'UTILITY', // General utilities
    'CUSTOM', // User-defined tools
  ],
  description: 'Category of the tool for organization and filtering',
});

/**
 * Tool status for lifecycle management
 */
export const ToolStatusEnum = defineEntityEnum({
  name: 'ToolStatus',
  values: [
    'DRAFT', // Being configured
    'ACTIVE', // Available for use
    'DEPRECATED', // Being phased out
    'DISABLED', // Temporarily unavailable
  ],
  description: 'Lifecycle status of the tool',
});

/**
 * Tool entity - Represents an AI tool/function that agents can invoke
 */
export const ToolEntity = defineEntity({
  name: 'Tool',
  schema: 'agent_console',
  description:
    'Represents an AI tool/function that agents can invoke during execution.',
  fields: {
    id: field.id(),
    organizationId: field.string({
      description: 'Organization that owns this tool',
    }),
    name: field.string({ zod: z.string().min(1).max(100) }),
    slug: field.string({
      zod: z
        .string()
        .min(1)
        .max(100)
        .regex(/^[a-z0-9-]+$/),
    }),
    description: field.string({ zod: z.string().max(1000) }),
    category: field.enum('ToolCategory', { default: 'UTILITY' }),
    status: field.enum('ToolStatus', { default: 'DRAFT' }),
    // JSON Schema for tool parameters
    parametersSchema: field.json({
      description: 'JSON Schema for tool input parameters',
    }),
    // JSON Schema for tool output
    outputSchema: field.json({
      isOptional: true,
      description: 'JSON Schema for tool output',
    }),
    // Implementation details
    implementationType: field.string({
      description: "Implementation type: 'http', 'function', 'workflow'",
    }),
    implementationConfig: field.json({
      description: 'Implementation configuration (URL, function name, etc.)',
    }),
    // Rate limiting
    maxInvocationsPerMinute: field.int({
      isOptional: true,
      description: 'Rate limit per minute',
    }),
    timeoutMs: field.int({
      default: 30000,
      description: 'Execution timeout in milliseconds',
    }),
    // Metadata
    version: field.string({ default: '1.0.0', description: 'Tool version' }),
    tags: field.string({
      isArray: true,
      isOptional: true,
      description: 'Tags for categorization',
    }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    createdById: field.string({
      isOptional: true,
      description: 'User who created this tool',
    }),
  },
  indexes: [
    index.unique(['organizationId', 'slug']),
    index.on(['organizationId', 'category']),
    index.on(['organizationId', 'status']),
  ],
  enums: [ToolCategoryEnum, ToolStatusEnum],
});
