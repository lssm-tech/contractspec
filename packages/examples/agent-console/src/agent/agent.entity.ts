import {
  defineEntity,
  defineEntityEnum,
  field,
  index,
} from '@lssm/lib.schema/entity';

/**
 * Agent status for lifecycle management.
 */
export const AgentStatusEntityEnum = defineEntityEnum({
  name: 'AgentStatus',
  values: ['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED'],
  description: 'Lifecycle status of the agent',
});

/**
 * Agent model provider.
 */
export const ModelProviderEntityEnum = defineEntityEnum({
  name: 'ModelProvider',
  values: ['OPENAI', 'ANTHROPIC', 'GOOGLE', 'MISTRAL', 'CUSTOM'],
  description: 'AI model provider',
});

/**
 * Agent entity - Represents an AI agent configuration.
 */
export const AgentEntity = defineEntity({
  name: 'Agent',
  schema: 'agent_console',
  description:
    'Represents an AI agent configuration with assigned tools and parameters.',
  fields: {
    id: field.id(),
    organizationId: field.string({
      description: 'Organization that owns this agent',
    }),
    name: field.string({ description: 'Agent name (1-100 chars)' }),
    slug: field.string({
      description: 'URL-safe identifier (lowercase, numbers, hyphens)',
    }),
    description: field.string({
      isOptional: true,
      description: 'Agent description (max 1000 chars)',
    }),
    status: field.enum('AgentStatus', { default: 'DRAFT' }),
    modelProvider: field.enum('ModelProvider', { default: 'OPENAI' }),
    modelName: field.string({
      description: "Model identifier: 'gpt-4', 'claude-3-opus', etc.",
    }),
    modelConfig: field.json({
      isOptional: true,
      description: 'Model parameters: temperature, max_tokens, etc.',
    }),
    systemPrompt: field.string({ description: 'System prompt for the agent' }),
    userPromptTemplate: field.string({
      isOptional: true,
      description: 'Template for user prompts',
    }),
    toolIds: field.string({
      isArray: true,
      isOptional: true,
      description: 'IDs of assigned tools',
    }),
    toolChoice: field.string({
      default: 'auto',
      description: "Tool selection mode: 'auto', 'required', 'none'",
    }),
    maxIterations: field.int({
      default: 10,
      description: 'Maximum iterations per run',
    }),
    maxTokensPerRun: field.int({
      isOptional: true,
      description: 'Maximum tokens per run',
    }),
    timeoutMs: field.int({
      default: 120000,
      description: 'Execution timeout in milliseconds',
    }),
    version: field.string({ default: '1.0.0', description: 'Agent version' }),
    tags: field.string({
      isArray: true,
      isOptional: true,
      description: 'Tags for categorization',
    }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    createdById: field.string({
      isOptional: true,
      description: 'User who created this agent',
    }),
    tools: field.hasMany('Tool', {
      description: 'Tools assigned to this agent',
    }),
  },
  indexes: [
    index.unique(['organizationId', 'slug']),
    index.on(['organizationId', 'status']),
    index.on(['modelProvider', 'modelName']),
  ],
  enums: [AgentStatusEntityEnum, ModelProviderEntityEnum],
});

/**
 * AgentTool join entity - Links agents to their assigned tools.
 */
export const AgentToolEntity = defineEntity({
  name: 'AgentTool',
  schema: 'agent_console',
  description: 'Links an agent to its assigned tools with configuration.',
  fields: {
    id: field.id(),
    agentId: field.foreignKey({ description: 'Agent ID' }),
    toolId: field.foreignKey({ description: 'Tool ID' }),
    config: field.json({
      isOptional: true,
      description: 'Tool-specific configuration for this agent',
    }),
    order: field.int({
      default: 0,
      description: 'Order of tool in agent tool list',
    }),
    isEnabled: field.boolean({
      default: true,
      description: 'Whether tool is enabled for this agent',
    }),
    createdAt: field.createdAt(),
    agent: field.belongsTo('Agent', ['agentId'], ['id']),
    tool: field.belongsTo('Tool', ['toolId'], ['id']),
  },
  indexes: [
    index.unique(['agentId', 'toolId']),
    index.on(['agentId', 'order']),
  ],
});
