import { defineCommand, defineQuery, } from '@lssm/lib.contracts/spec';
import { defineSchemaModel, ScalarTypeEnum, defineEnum } from '@lssm/lib.schema';

const OWNERS = ['agent-console-team'] as const;

// ============ Enums ============

export const AgentStatusEnum = defineEnum('AgentStatus', ['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED']);
export const ModelProviderEnum = defineEnum('ModelProvider', ['OPENAI', 'ANTHROPIC', 'GOOGLE', 'MISTRAL', 'CUSTOM']);
export const ToolChoiceEnum = defineEnum('ToolChoice', ['auto', 'required', 'none']);

// ============ Schemas ============

export const AgentModel = defineSchemaModel({
  name: 'Agent',
  description: 'AI agent configuration',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: AgentStatusEnum, isOptional: false },
    modelProvider: { type: ModelProviderEnum, isOptional: false },
    modelName: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    modelConfig: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    systemPrompt: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userPromptTemplate: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    toolIds: { type: ScalarTypeEnum.String_unsecure(), isArray: true, isOptional: true },
    toolChoice: { type: ToolChoiceEnum, isOptional: false, defaultValue: 'auto' },
    maxIterations: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false, defaultValue: 10 },
    maxTokensPerRun: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    timeoutMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false, defaultValue: 120000 },
    version: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    tags: { type: ScalarTypeEnum.String_unsecure(), isArray: true, isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

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

export const AgentWithToolsModel = defineSchemaModel({
  name: 'AgentWithTools',
  description: 'Agent with associated tools',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: AgentStatusEnum, isOptional: false },
    modelProvider: { type: ModelProviderEnum, isOptional: false },
    modelName: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    modelConfig: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    systemPrompt: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userPromptTemplate: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    toolIds: { type: ScalarTypeEnum.String_unsecure(), isArray: true, isOptional: true },
    toolChoice: { type: ToolChoiceEnum, isOptional: false },
    maxIterations: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    maxTokensPerRun: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    timeoutMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    tags: { type: ScalarTypeEnum.String_unsecure(), isArray: true, isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    tools: { type: AgentToolRefModel, isArray: true, isOptional: true },
  },
});

export const CreateAgentInputModel = defineSchemaModel({
  name: 'CreateAgentInput',
  description: 'Input for creating an agent',
  fields: {
    organizationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    modelProvider: { type: ModelProviderEnum, isOptional: false },
    modelName: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    modelConfig: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    systemPrompt: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userPromptTemplate: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    toolIds: { type: ScalarTypeEnum.String_unsecure(), isArray: true, isOptional: true },
    toolChoice: { type: ToolChoiceEnum, isOptional: true },
    maxIterations: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    maxTokensPerRun: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    timeoutMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    tags: { type: ScalarTypeEnum.String_unsecure(), isArray: true, isOptional: true },
  },
});

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
    userPromptTemplate: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    toolIds: { type: ScalarTypeEnum.String_unsecure(), isArray: true, isOptional: true },
    toolChoice: { type: ToolChoiceEnum, isOptional: true },
    maxIterations: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    maxTokensPerRun: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    timeoutMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    tags: { type: ScalarTypeEnum.String_unsecure(), isArray: true, isOptional: true },
  },
});

// ============ Contracts ============

/**
 * CreateAgentCommand - Creates a new agent configuration
 */
export const CreateAgentCommand = defineCommand({
  meta: {
    name: 'agent.agent.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['agent', 'create'],
    description: 'Creates a new AI agent configuration.',
    goal: 'Allow users to define new AI agents with specific models and tools.',
    context: 'Called from the agent builder UI when creating a new agent.',
  },
  io: {
    input: CreateAgentInputModel,
    output: defineSchemaModel({
      name: 'CreateAgentOutput',
      fields: {
        id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
        slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        status: { type: AgentStatusEnum, isOptional: false },
      },
    }),
    errors: {
      SLUG_EXISTS: {
        description: 'An agent with this slug already exists in the organization',
        http: 409,
        gqlCode: 'SLUG_EXISTS',
        when: 'Slug is already taken',
      },
    },
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [{ name: 'agent.created', version: 1, when: 'Agent is successfully created', payload: AgentSummaryModel }],
    audit: ['agent.created'],
  },
});

/**
 * UpdateAgentCommand - Updates an existing agent
 */
export const UpdateAgentCommand = defineCommand({
  meta: {
    name: 'agent.agent.update',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['agent', 'update'],
    description: 'Updates an existing AI agent configuration.',
    goal: 'Allow users to modify agent settings and configuration.',
    context: 'Called from the agent settings UI.',
  },
  io: {
    input: UpdateAgentInputModel,
    output: defineSchemaModel({
      name: 'UpdateAgentOutput',
      fields: {
        id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
        status: { type: AgentStatusEnum, isOptional: false },
        updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
      },
    }),
    errors: {
      AGENT_NOT_FOUND: {
        description: 'The specified agent does not exist',
        http: 404,
        gqlCode: 'AGENT_NOT_FOUND',
        when: 'Agent ID is invalid',
      },
    },
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [{ name: 'agent.updated', version: 1, when: 'Agent is updated', payload: AgentSummaryModel }],
    audit: ['agent.updated'],
  },
});

/**
 * GetAgentQuery - Retrieves an agent by ID
 */
export const GetAgentQuery = defineQuery({
  meta: {
    name: 'agent.agent.get',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['agent', 'get'],
    description: 'Retrieves an agent by its ID.',
    goal: 'View detailed agent configuration.',
    context: 'Called when viewing agent details or editing.',
  },
  io: {
    input: defineSchemaModel({
      name: 'GetAgentInput',
      fields: {
        agentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        includeTools: { type: ScalarTypeEnum.Boolean(), isOptional: true },
      },
    }),
    output: AgentWithToolsModel,
    errors: {
      AGENT_NOT_FOUND: {
        description: 'The specified agent does not exist',
        http: 404,
        gqlCode: 'AGENT_NOT_FOUND',
        when: 'Agent ID is invalid',
      },
    },
  },
  policy: {
    auth: 'user',
  },
});

/**
 * ListAgentsQuery - Lists agents for an organization
 */
export const ListAgentsQuery = defineQuery({
  meta: {
    name: 'agent.agent.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['agent', 'list'],
    description: 'Lists agents for an organization with optional filtering.',
    goal: 'Browse and search available agents.',
    context: 'Agent list/dashboard view.',
  },
  io: {
    input: defineSchemaModel({
      name: 'ListAgentsInput',
      fields: {
        organizationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        status: { type: AgentStatusEnum, isOptional: true },
        modelProvider: { type: ModelProviderEnum, isOptional: true },
        search: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
        limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true, defaultValue: 20 },
        offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true, defaultValue: 0 },
      },
    }),
    output: defineSchemaModel({
      name: 'ListAgentsOutput',
      fields: {
        items: { type: AgentSummaryModel, isArray: true, isOptional: false },
        total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
        hasMore: { type: ScalarTypeEnum.Boolean(), isOptional: false },
      },
    }),
  },
  policy: {
    auth: 'user',
  },
});

/**
 * AssignToolToAgentCommand - Assigns a tool to an agent
 */
export const AssignToolToAgentCommand = defineCommand({
  meta: {
    name: 'agent.agent.assignTool',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['agent', 'tool', 'assign'],
    description: 'Assigns a tool to an agent with optional configuration.',
    goal: 'Enable agents to use specific tools.',
    context: 'Agent configuration UI - tool selection.',
  },
  io: {
    input: defineSchemaModel({
      name: 'AssignToolToAgentInput',
      fields: {
        agentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        toolId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        config: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
        order: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
      },
    }),
    output: defineSchemaModel({
      name: 'AssignToolToAgentOutput',
      fields: {
        agentToolId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        agentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        toolId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      },
    }),
    errors: {
      TOOL_ALREADY_ASSIGNED: {
        description: 'This tool is already assigned to the agent',
        http: 409,
        gqlCode: 'TOOL_ALREADY_ASSIGNED',
        when: 'Tool assignment already exists',
      },
    },
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    audit: ['agent.tool.assigned'],
  },
});

/**
 * RemoveToolFromAgentCommand - Removes a tool from an agent
 */
export const RemoveToolFromAgentCommand = defineCommand({
  meta: {
    name: 'agent.agent.removeTool',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['agent', 'tool', 'remove'],
    description: 'Removes a tool assignment from an agent.',
    goal: 'Disable specific tools for an agent.',
    context: 'Agent configuration UI - tool management.',
  },
  io: {
    input: defineSchemaModel({
      name: 'RemoveToolFromAgentInput',
      fields: {
        agentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        toolId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      },
    }),
    output: defineSchemaModel({
      name: 'RemoveToolFromAgentOutput',
      fields: {
        success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
      },
    }),
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    audit: ['agent.tool.removed'],
  },
});
