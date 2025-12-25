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
});
