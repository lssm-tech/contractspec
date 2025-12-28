import {
  defineEntity,
  defineEntityEnum,
  field,
  index,
} from '@contractspec/lib.schema';

/**
 * Tool category enum for entities.
 */
export const ToolCategoryEntityEnum = defineEntityEnum({
  name: 'ToolCategory',
  values: [
    'RETRIEVAL',
    'COMPUTATION',
    'COMMUNICATION',
    'INTEGRATION',
    'UTILITY',
    'CUSTOM',
  ],
  description: 'Category of tool',
});

/**
 * Tool status enum for entities.
 */
export const ToolStatusEntityEnum = defineEntityEnum({
  name: 'ToolStatus',
  values: ['DRAFT', 'ACTIVE', 'DEPRECATED', 'DISABLED'],
  description: 'Status of tool',
});

/**
 * Implementation type enum for entities.
 */
export const ImplementationTypeEntityEnum = defineEntityEnum({
  name: 'ImplementationType',
  values: ['http', 'function', 'workflow'],
  description: 'How the tool is implemented',
});

/**
 * Tool entity - Represents an AI tool definition.
 */
export const ToolEntity = defineEntity({
  name: 'Tool',
  schema: 'agent_console',
  description: 'An AI tool that can be used by agents.',
  fields: {
    id: field.id(),
    organizationId: field.string({
      description: 'Organization that owns this tool',
    }),
    name: field.string({ description: 'Tool name' }),
    slug: field.string({ description: 'URL-safe identifier' }),
    description: field.string({ description: 'Tool description' }),
    category: field.enum('ToolCategory', { default: 'CUSTOM' }),
    status: field.enum('ToolStatus', { default: 'DRAFT' }),
    parametersSchema: field.json({
      description: 'JSON Schema for tool parameters',
    }),
    outputSchema: field.json({
      isOptional: true,
      description: 'JSON Schema for tool output',
    }),
    implementationType: field.enum('ImplementationType'),
    implementationConfig: field.json({
      description: 'Implementation configuration',
    }),
    maxInvocationsPerMinute: field.int({
      isOptional: true,
      description: 'Rate limit',
    }),
    timeoutMs: field.int({ default: 30000, description: 'Execution timeout' }),
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
    agents: field.hasMany('Agent', { description: 'Agents using this tool' }),
  },
  indexes: [
    index.unique(['organizationId', 'slug']),
    index.on(['organizationId', 'category']),
    index.on(['organizationId', 'status']),
  ],
  enums: [
    ToolCategoryEntityEnum,
    ToolStatusEntityEnum,
    ImplementationTypeEntityEnum,
  ],
});
