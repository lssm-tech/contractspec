import {
  defineCommand,
  defineQuery,
} from '@contractspec/lib.contracts/operations';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { AgentStatusEnum, ModelProviderEnum } from './agent.enum';
import {
  AgentSummaryModel,
  AgentWithToolsModel,
  CreateAgentInputModel,
  UpdateAgentInputModel,
} from './agent.schema';
import { AgentCreatedEvent } from './agent.event';

const OWNERS = ['@agent-console-team'] as const;

/**
 * CreateAgentCommand - Creates a new agent configuration.
 */
export const CreateAgentCommand = defineCommand({
  meta: {
    key: 'agent-console.agent.create',
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
        description:
          'An agent with this slug already exists in the organization',
        http: 409,
        gqlCode: 'SLUG_EXISTS',
        when: 'Slug is already taken',
      },
    },
  },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        // name: 'agent.created',
        // version: 1,
        // payload: AgentSummaryModel,
        ref: AgentCreatedEvent.meta,
        when: 'Agent is successfully created',
      },
    ],
    audit: ['agent-console.agent.created'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'create-agent-happy-path',
        given: ['User is authenticated', 'Organization exists'],
        when: ['User submits valid agent configuration'],
        then: [
          'New agent is created with DRAFT status',
          'AgentCreated event is emitted',
        ],
      },
      {
        key: 'create-agent-slug-conflict',
        given: ['User is authenticated', 'Agent with same slug exists'],
        when: ['User submits agent with duplicate slug'],
        then: ['SLUG_EXISTS error is returned with 409 status'],
      },
    ],
    examples: [
      {
        key: 'basic-create',
        input: {
          name: 'Support Assistant',
          slug: 'support-assistant',
          modelProvider: 'openai',
          modelId: 'gpt-4',
        },
        output: {
          id: 'agent-123',
          name: 'Support Assistant',
          slug: 'support-assistant',
          status: 'draft',
        },
      },
    ],
  },
});

/**
 * UpdateAgentCommand - Updates an existing agent.
 */
export const UpdateAgentCommand = defineCommand({
  meta: {
    key: 'agent-console.agent.update',
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
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        key: 'agent.updated',
        version: 1,
        stability: 'stable',
        owners: [...OWNERS],
        tags: ['agent', 'updated'],
        when: 'Agent is updated',
        payload: AgentSummaryModel,
      },
    ],
    audit: ['agent.updated'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'update-agent-happy-path',
        given: ['Agent exists', 'User owns the agent'],
        when: ['User submits updated configuration'],
        then: ['Agent is updated', 'AgentUpdated event is emitted'],
      },
      {
        key: 'update-agent-not-found',
        given: ['Agent does not exist'],
        when: ['User attempts to update'],
        then: ['AGENT_NOT_FOUND error is returned'],
      },
    ],
    examples: [
      {
        key: 'update-name',
        input: {
          agentId: 'agent-123',
          name: 'Updated Assistant',
          systemPrompt: 'You are a helpful assistant.',
        },
        output: {
          id: 'agent-123',
          name: 'Updated Assistant',
          status: 'draft',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      },
    ],
  },
});

/**
 * GetAgentQuery - Retrieves an agent by ID.
 */
export const GetAgentQuery = defineQuery({
  meta: {
    key: 'agent-console.agent.get',
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
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'get-agent-happy-path',
        given: ['Agent exists'],
        when: ['User requests agent by ID'],
        then: ['Agent details are returned'],
      },
      {
        key: 'get-agent-with-tools',
        given: ['Agent exists with assigned tools'],
        when: ['User requests agent with includeTools=true'],
        then: ['Agent details with tools list are returned'],
      },
    ],
    examples: [
      {
        key: 'get-basic',
        input: { agentId: 'agent-123', includeTools: false },
        output: {
          id: 'agent-123',
          name: 'Support Assistant',
          status: 'active',
          tools: [],
        },
      },
    ],
  },
});

/**
 * ListAgentsQuery - Lists agents for an organization.
 */
export const ListAgentsQuery = defineQuery({
  meta: {
    key: 'agent-console.agent.list',
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
        organizationId: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: false,
        },
        status: { type: AgentStatusEnum, isOptional: true },
        modelProvider: { type: ModelProviderEnum, isOptional: true },
        search: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
        limit: {
          type: ScalarTypeEnum.Int_unsecure(),
          isOptional: true,
          defaultValue: 20,
        },
        offset: {
          type: ScalarTypeEnum.Int_unsecure(),
          isOptional: true,
          defaultValue: 0,
        },
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
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'list-agents-happy-path',
        given: ['Organization has agents'],
        when: ['User lists agents'],
        then: ['Paginated list of agents is returned'],
      },
      {
        key: 'list-agents-filter-by-status',
        given: ['Organization has agents with mixed statuses'],
        when: ['User filters by status=active'],
        then: ['Only active agents are returned'],
      },
    ],
    examples: [
      {
        key: 'list-basic',
        input: { organizationId: 'org-123', limit: 10, offset: 0 },
        output: { items: [], total: 0, hasMore: false },
      },
    ],
  },
});

/**
 * AssignToolToAgentCommand - Assigns a tool to an agent.
 */
export const AssignToolToAgentCommand = defineCommand({
  meta: {
    key: 'agent-console.agent.assignTool',
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
        agentToolId: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: false,
        },
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
  policy: { auth: 'user' },
  sideEffects: { audit: ['agent.tool.assigned'] },
  acceptance: {
    scenarios: [
      {
        key: 'assign-tool-happy-path',
        given: ['Agent exists', 'Tool exists and is not assigned'],
        when: ['User assigns tool to agent'],
        then: ['Tool is assigned', 'Assignment ID is returned'],
      },
      {
        key: 'assign-tool-already-assigned',
        given: ['Tool is already assigned to agent'],
        when: ['User attempts to assign again'],
        then: ['TOOL_ALREADY_ASSIGNED error is returned'],
      },
    ],
    examples: [
      {
        key: 'assign-basic',
        input: { agentId: 'agent-123', toolId: 'tool-456' },
        output: {
          agentToolId: 'at-789',
          agentId: 'agent-123',
          toolId: 'tool-456',
        },
      },
    ],
  },
});

/**
 * RemoveToolFromAgentCommand - Removes a tool from an agent.
 */
export const RemoveToolFromAgentCommand = defineCommand({
  meta: {
    key: 'agent-console.agent.removeTool',
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
  policy: { auth: 'user' },
  sideEffects: { audit: ['agent.tool.removed'] },
  acceptance: {
    scenarios: [
      {
        key: 'remove-tool-happy-path',
        given: ['Agent exists', 'Tool is assigned to agent'],
        when: ['User removes tool from agent'],
        then: ['Tool is unassigned', 'Success is returned'],
      },
    ],
    examples: [
      {
        key: 'remove-basic',
        input: { agentId: 'agent-123', toolId: 'tool-456' },
        output: { success: true },
      },
    ],
  },
});
