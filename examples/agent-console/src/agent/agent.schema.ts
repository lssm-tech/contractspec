import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import {
  AgentStatusEnum,
  ModelProviderEnum,
  ToolChoiceEnum,
} from './agent.enum';

/**
 * AI agent configuration schema.
 */
export const AgentModel = defineSchemaModel({
  name: 'Agent',
  description: 'AI agent configuration',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: AgentStatusEnum, isOptional: false },
    modelProvider: { type: ModelProviderEnum, isOptional: false },
    modelName: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    modelConfig: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    systemPrompt: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userPromptTemplate: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    toolIds: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
    toolChoice: {
      type: ToolChoiceEnum,
      isOptional: false,
      defaultValue: 'auto',
    },
    maxIterations: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
      defaultValue: 10,
    },
    maxTokensPerRun: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    timeoutMs: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
      defaultValue: 120000,
    },
    version: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    tags: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Summary of an agent for list views.
 */
export const AgentSummaryModel = defineSchemaModel({
  name: 'AgentSummary',
  description: 'Summary of an agent for list views',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: AgentStatusEnum, isOptional: false },
    modelProvider: { type: ModelProviderEnum, isOptional: false },
    modelName: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    version: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Tool reference in agent context.
 */
export const AgentToolRefModel = defineSchemaModel({
  name: 'AgentToolRef',
  description: 'Tool reference in agent context',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    category: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

/**
 * Agent with associated tools.
 */
export const AgentWithToolsModel = defineSchemaModel({
  name: 'AgentWithTools',
  description: 'Agent with associated tools',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: AgentStatusEnum, isOptional: false },
    modelProvider: { type: ModelProviderEnum, isOptional: false },
    modelName: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    modelConfig: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    systemPrompt: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userPromptTemplate: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    toolIds: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
    toolChoice: { type: ToolChoiceEnum, isOptional: false },
    maxIterations: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    maxTokensPerRun: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    timeoutMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    tags: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    tools: { type: AgentToolRefModel, isArray: true, isOptional: true },
  },
});

/**
 * Input for creating an agent.
 */
export const CreateAgentInputModel = defineSchemaModel({
  name: 'CreateAgentInput',
  description: 'Input for creating an agent',
  fields: {
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    modelProvider: { type: ModelProviderEnum, isOptional: false },
    modelName: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    modelConfig: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    systemPrompt: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userPromptTemplate: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    toolIds: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
    toolChoice: { type: ToolChoiceEnum, isOptional: true },
    maxIterations: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    maxTokensPerRun: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    timeoutMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    tags: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
  },
});

/**
 * Input for updating an agent.
 */
export const UpdateAgentInputModel = defineSchemaModel({
  name: 'UpdateAgentInput',
  description: 'Input for updating an agent',
  fields: {
    agentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: true },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: AgentStatusEnum, isOptional: true },
    modelConfig: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    systemPrompt: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    userPromptTemplate: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    toolIds: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
    toolChoice: { type: ToolChoiceEnum, isOptional: true },
    maxIterations: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    maxTokensPerRun: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    timeoutMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    tags: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
  },
});
