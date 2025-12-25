import { defineCommand, defineQuery } from '@lssm/lib.contracts/operations';
import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import { ToolCategoryEnum, ToolStatusEnum } from './tool.enum';
import {
  CreateToolInputModel,
  ToolModel,
  ToolSummaryModel,
  UpdateToolInputModel,
} from './tool.schema';

const OWNERS = ['@agent-console-team'] as const;

/**
 * CreateToolCommand - Creates a new tool definition.
 */
export const CreateToolCommand = defineCommand({
  meta: {
    key: 'agent.tool.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['tool', 'create'],
    description: 'Creates a new AI tool definition.',
    goal: 'Allow users to define new tools that agents can use.',
    context: 'Called from the tool builder UI when creating a new tool.',
  },
  io: {
    input: CreateToolInputModel,
    output: defineSchemaModel({
      name: 'CreateToolOutput',
      fields: {
        id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
        slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        status: { type: ToolStatusEnum, isOptional: false },
      },
    }),
    errors: {
      SLUG_EXISTS: {
        description: 'A tool with this slug already exists in the organization',
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
        key: 'tool.created',
        version: 1,
        stability: 'stable',
        owners: [...OWNERS],
        tags: ['tool', 'created'],
        when: 'Tool is successfully created',
        payload: ToolSummaryModel,
      },
    ],
    audit: ['tool.created'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'create-tool-happy-path',
        given: ['User is authenticated', 'Organization exists'],
        when: ['User submits valid tool configuration'],
        then: ['New tool is created', 'ToolCreated event is emitted'],
      },
      {
        key: 'create-tool-slug-conflict',
        given: ['Tool with same slug exists'],
        when: ['User submits tool with duplicate slug'],
        then: ['SLUG_EXISTS error is returned'],
      },
    ],
    examples: [
      {
        key: 'create-api-tool',
        input: {
          name: 'Weather API',
          slug: 'weather-api',
          category: 'api',
          description: 'Fetches weather data',
        },
        output: {
          id: 'tool-123',
          name: 'Weather API',
          slug: 'weather-api',
          status: 'draft',
        },
      },
    ],
  },
});

/**
 * UpdateToolCommand - Updates an existing tool.
 */
export const UpdateToolCommand = defineCommand({
  meta: {
    key: 'agent.tool.update',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['tool', 'update'],
    description: 'Updates an existing AI tool definition.',
    goal: 'Allow users to modify tool settings and configuration.',
    context: 'Called from the tool settings UI.',
  },
  io: {
    input: UpdateToolInputModel,
    output: defineSchemaModel({
      name: 'UpdateToolOutput',
      fields: {
        id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
        status: { type: ToolStatusEnum, isOptional: false },
        updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
      },
    }),
    errors: {
      TOOL_NOT_FOUND: {
        description: 'The specified tool does not exist',
        http: 404,
        gqlCode: 'TOOL_NOT_FOUND',
        when: 'Tool ID is invalid',
      },
    },
  },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        key: 'tool.updated',
        version: 1,
        stability: 'stable',
        owners: [...OWNERS],
        tags: ['tool', 'updated'],
        when: 'Tool is updated',
        payload: ToolSummaryModel,
      },
    ],
    audit: ['tool.updated'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'update-tool-happy-path',
        given: ['Tool exists', 'User owns the tool'],
        when: ['User submits updated configuration'],
        then: ['Tool is updated', 'ToolUpdated event is emitted'],
      },
    ],
    examples: [
      {
        key: 'update-description',
        input: { toolId: 'tool-123', description: 'Updated weather API tool' },
        output: {
          id: 'tool-123',
          name: 'Weather API',
          status: 'draft',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      },
    ],
  },
});

/**
 * GetToolQuery - Retrieves a tool by ID.
 */
export const GetToolQuery = defineQuery({
  meta: {
    key: 'agent.tool.get',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['tool', 'get'],
    description: 'Retrieves a tool by its ID.',
    goal: 'View detailed tool configuration.',
    context: 'Called when viewing tool details or editing.',
  },
  io: {
    input: defineSchemaModel({
      name: 'GetToolInput',
      fields: {
        toolId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      },
    }),
    output: ToolModel,
    errors: {
      TOOL_NOT_FOUND: {
        description: 'The specified tool does not exist',
        http: 404,
        gqlCode: 'TOOL_NOT_FOUND',
        when: 'Tool ID is invalid',
      },
    },
  },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'get-tool-happy-path',
        given: ['Tool exists'],
        when: ['User requests tool by ID'],
        then: ['Tool details are returned'],
      },
    ],
    examples: [
      {
        key: 'get-basic',
        input: { toolId: 'tool-123' },
        output: {
          id: 'tool-123',
          name: 'Weather API',
          status: 'active',
          category: 'api',
        },
      },
    ],
  },
});

/**
 * ListToolsQuery - Lists tools for an organization.
 */
export const ListToolsQuery = defineQuery({
  meta: {
    key: 'agent.tool.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['tool', 'list'],
    description: 'Lists tools for an organization with optional filtering.',
    goal: 'Browse and search available tools.',
    context: 'Tool list/dashboard view.',
  },
  io: {
    input: defineSchemaModel({
      name: 'ListToolsInput',
      fields: {
        organizationId: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: false,
        },
        category: { type: ToolCategoryEnum, isOptional: true },
        status: { type: ToolStatusEnum, isOptional: true },
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
      name: 'ListToolsOutput',
      fields: {
        items: { type: ToolSummaryModel, isArray: true, isOptional: false },
        total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
        hasMore: { type: ScalarTypeEnum.Boolean(), isOptional: false },
      },
    }),
  },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'list-tools-happy-path',
        given: ['Organization has tools'],
        when: ['User lists tools'],
        then: ['Paginated list of tools is returned'],
      },
    ],
    examples: [
      {
        key: 'list-by-category',
        input: { organizationId: 'org-123', category: 'api', limit: 10 },
        output: { items: [], total: 0, hasMore: false },
      },
    ],
  },
});

/**
 * TestToolCommand - Tests a tool with sample input.
 */
export const TestToolCommand = defineCommand({
  meta: {
    key: 'agent.tool.test',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['tool', 'test'],
    description: 'Tests a tool with sample input to verify it works correctly.',
    goal: 'Validate tool configuration before deployment.',
    context: 'Tool builder UI - test panel.',
  },
  io: {
    input: defineSchemaModel({
      name: 'TestToolInput',
      fields: {
        toolId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        testInput: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
      },
    }),
    output: defineSchemaModel({
      name: 'TestToolOutput',
      fields: {
        success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
        output: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
        error: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
        durationMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
      },
    }),
    errors: {
      TOOL_NOT_FOUND: {
        description: 'The specified tool does not exist',
        http: 404,
        gqlCode: 'TOOL_NOT_FOUND',
        when: 'Tool ID is invalid',
      },
      TOOL_EXECUTION_ERROR: {
        description: 'Tool execution failed',
        http: 500,
        gqlCode: 'TOOL_EXECUTION_ERROR',
        when: 'Tool returns an error',
      },
    },
  },
  policy: { auth: 'user' },
  sideEffects: { audit: ['tool.tested'] },
  acceptance: {
    scenarios: [
      {
        key: 'test-tool-success',
        given: ['Tool exists', 'Tool is configured correctly'],
        when: ['User runs test with valid input'],
        then: ['Tool executes successfully', 'Output is returned'],
      },
      {
        key: 'test-tool-failure',
        given: ['Tool exists', 'Tool has configuration error'],
        when: ['User runs test'],
        then: ['TOOL_EXECUTION_ERROR is returned'],
      },
    ],
    examples: [
      {
        key: 'test-weather-api',
        input: { toolId: 'tool-123', testInput: { city: 'Paris' } },
        output: { success: true, output: { temperature: 22 }, durationMs: 150 },
      },
    ],
  },
});
