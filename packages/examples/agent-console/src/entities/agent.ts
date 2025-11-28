import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema/entity';
import { z } from 'zod';

/**
 * Agent status for lifecycle management
 */
export const AgentStatusEnum = defineEntityEnum({
  name: 'AgentStatus',
  values: [
    'DRAFT', // Being configured
    'ACTIVE', // Available for execution
    'PAUSED', // Temporarily unavailable
    'ARCHIVED', // No longer active
  ],
  description: 'Lifecycle status of the agent',
});

/**
 * Agent model provider
 */
export const ModelProviderEnum = defineEntityEnum({
  name: 'ModelProvider',
  values: ['OPENAI', 'ANTHROPIC', 'GOOGLE', 'MISTRAL', 'CUSTOM'],
  description: 'AI model provider',
});

/**
 * Agent entity - Represents an AI agent configuration
 */
export const AgentEntity = defineEntity({
  name: 'Agent',
  schema: 'agent_console',
  description: 'Represents an AI agent configuration with assigned tools and parameters.',
  fields: {
    id: field.id(),
    organizationId: field.string({ description: 'Organization that owns this agent' }),
    name: field.string({ zod: z.string().min(1).max(100) }),
    slug: field.string({ zod: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/) }),
    description: field.string({ isOptional: true, zod: z.string().max(1000) }),
    status: field.enum('AgentStatus', { default: 'DRAFT' }),
    // Model configuration
    modelProvider: field.enum('ModelProvider', { default: 'OPENAI' }),
    modelName: field.string({ description: "Model identifier: 'gpt-4', 'claude-3-opus', etc." }),
    modelConfig: field.json({ isOptional: true, description: 'Model parameters: temperature, max_tokens, etc.' }),
    // Prompts
    systemPrompt: field.string({ description: 'System prompt for the agent' }),
    userPromptTemplate: field.string({ isOptional: true, description: 'Template for user prompts' }),
    // Tool configuration
    toolIds: field.string({ isArray: true, isOptional: true, description: 'IDs of assigned tools' }),
    toolChoice: field.string({ default: 'auto', description: "Tool selection mode: 'auto', 'required', 'none'" }),
    // Execution limits
    maxIterations: field.int({ default: 10, description: 'Maximum iterations per run' }),
    maxTokensPerRun: field.int({ isOptional: true, description: 'Maximum tokens per run' }),
    timeoutMs: field.int({ default: 120000, description: 'Execution timeout in milliseconds' }),
    // Metadata
    version: field.string({ default: '1.0.0', description: 'Agent version' }),
    tags: field.string({ isArray: true, isOptional: true, description: 'Tags for categorization' }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    createdById: field.string({ isOptional: true, description: 'User who created this agent' }),
    // Relations (virtual for type purposes)
    tools: field.hasMany('Tool', { description: 'Tools assigned to this agent' }),
  },
  indexes: [
    index.unique(['organizationId', 'slug']),
    index.on(['organizationId', 'status']),
    index.on(['modelProvider', 'modelName']),
  ],
  enums: [AgentStatusEnum, ModelProviderEnum],
});

/**
 * AgentTool join entity - Links agents to their assigned tools
 */
export const AgentToolEntity = defineEntity({
  name: 'AgentTool',
  schema: 'agent_console',
  description: 'Links an agent to its assigned tools with configuration.',
  fields: {
    id: field.id(),
    agentId: field.foreignKey({ description: 'Agent ID' }),
    toolId: field.foreignKey({ description: 'Tool ID' }),
    // Tool-specific configuration for this agent
    config: field.json({ isOptional: true, description: 'Tool-specific configuration for this agent' }),
    // Ordering for tool priority
    order: field.int({ default: 0, description: 'Order of tool in agent tool list' }),
    isEnabled: field.boolean({ default: true, description: 'Whether tool is enabled for this agent' }),
    createdAt: field.createdAt(),
    // Relations
    agent: field.belongsTo('Agent', ['agentId'], ['id']),
    tool: field.belongsTo('Tool', ['toolId'], ['id']),
  },
  indexes: [
    index.unique(['agentId', 'toolId']),
    index.on(['agentId', 'order']),
  ],
});
