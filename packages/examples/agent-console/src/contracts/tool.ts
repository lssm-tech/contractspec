import { defineCommand, defineQuery } from '@lssm/lib.contracts/spec';
import {
  defineSchemaModel,
  ScalarTypeEnum,
  defineEnum,
} from '@lssm/lib.schema';

const OWNERS = ['agent-console-team'] as const;

// ============ Enums ============

export const ToolCategoryEnum = defineEnum('ToolCategory', [
  'RETRIEVAL',
  'COMPUTATION',
  'COMMUNICATION',
  'INTEGRATION',
  'UTILITY',
  'CUSTOM',
]);

export const ToolStatusEnum = defineEnum('ToolStatus', [
  'DRAFT',
  'ACTIVE',
  'DEPRECATED',
  'DISABLED',
]);

export const ImplementationTypeEnum = defineEnum('ImplementationType', [
  'http',
  'function',
  'workflow',
]);

// ============ Schemas ============

export const ToolModel = defineSchemaModel({
  name: 'Tool',
  description: 'AI tool definition',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    category: { type: ToolCategoryEnum, isOptional: false },
    status: { type: ToolStatusEnum, isOptional: false },
    parametersSchema: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
    outputSchema: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    implementationType: { type: ImplementationTypeEnum, isOptional: false },
    implementationConfig: {
      type: ScalarTypeEnum.JSONObject(),
      isOptional: false,
    },
    maxInvocationsPerMinute: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
    },
    timeoutMs: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
      defaultValue: 30000,
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

export const ToolSummaryModel = defineSchemaModel({
  name: 'ToolSummary',
  description: 'Summary of a tool for list views',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    category: { type: ToolCategoryEnum, isOptional: false },
    status: { type: ToolStatusEnum, isOptional: false },
    version: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const CreateToolInputModel = defineSchemaModel({
  name: 'CreateToolInput',
  description: 'Input for creating a tool',
  fields: {
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    category: { type: ToolCategoryEnum, isOptional: true },
    parametersSchema: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
    outputSchema: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    implementationType: { type: ImplementationTypeEnum, isOptional: false },
    implementationConfig: {
      type: ScalarTypeEnum.JSONObject(),
      isOptional: false,
    },
    maxInvocationsPerMinute: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
    },
    timeoutMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    tags: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
  },
});

export const UpdateToolInputModel = defineSchemaModel({
  name: 'UpdateToolInput',
  description: 'Input for updating a tool',
  fields: {
    toolId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: true },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ToolStatusEnum, isOptional: true },
    parametersSchema: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    outputSchema: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    implementationConfig: {
      type: ScalarTypeEnum.JSONObject(),
      isOptional: true,
    },
    maxInvocationsPerMinute: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
    },
    timeoutMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    tags: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
  },
});

// ============ Contracts ============

/**
 * CreateToolCommand - Creates a new tool definition
 */
export const CreateToolCommand = defineCommand({
  meta: {
    name: 'agent.tool.create',
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
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'tool.created',
        version: 1,
        when: 'Tool is successfully created',
        payload: ToolSummaryModel,
      },
    ],
    audit: ['tool.created'],
  },
});

/**
 * UpdateToolCommand - Updates an existing tool
 */
export const UpdateToolCommand = defineCommand({
  meta: {
    name: 'agent.tool.update',
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
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'tool.updated',
        version: 1,
        when: 'Tool is updated',
        payload: ToolSummaryModel,
      },
    ],
    audit: ['tool.updated'],
  },
});

/**
 * GetToolQuery - Retrieves a tool by ID
 */
export const GetToolQuery = defineQuery({
  meta: {
    name: 'agent.tool.get',
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
  policy: {
    auth: 'user',
  },
});

/**
 * ListToolsQuery - Lists tools for an organization
 */
export const ListToolsQuery = defineQuery({
  meta: {
    name: 'agent.tool.list',
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
  policy: {
    auth: 'user',
  },
});

/**
 * TestToolCommand - Tests a tool with sample input
 */
export const TestToolCommand = defineCommand({
  meta: {
    name: 'agent.tool.test',
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
  policy: {
    auth: 'user',
  },
  sideEffects: {
    audit: ['tool.tested'],
  },
});
