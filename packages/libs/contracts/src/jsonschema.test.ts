import { describe, expect, it } from 'bun:test';
import {
  jsonSchemaForSpec,
  defaultRestPath,
  defaultMcpTool,
  defaultGqlField,
} from './jsonschema';
import { defineCommand, defineQuery } from './operations';
import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

describe('jsonSchemaForSpec', () => {
  it('should generate JSON schema for command spec', () => {
    const InputModel = new SchemaModel({
      name: 'CreateUserInput',
      fields: {
        name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        email: { type: ScalarTypeEnum.EmailAddress(), isOptional: false },
      },
    });

    const OutputModel = new SchemaModel({
      name: 'CreateUserOutput',
      fields: {
        id: { type: ScalarTypeEnum.ID(), isOptional: false },
      },
    });

    const spec = defineCommand({
      meta: {
        key: 'user.create',
        version: 1,
        description: 'Create a user',
        goal: 'Create a new user in the system',
        context: 'Used during signup',
        stability: 'stable',
        owners: ['platform.core'],
        tags: ['users'],
      },
      policy: { auth: 'anonymous' },
      io: { input: InputModel, output: OutputModel },
    });

    const result = jsonSchemaForSpec(spec);

    expect(result.input).toBeDefined();
    expect(result.output).toBeDefined();
    expect(result.meta.name).toBe('user.create');
    expect(result.meta.version).toBe(1);
    expect(result.meta.kind).toBe('command');
    expect(result.meta.description).toBe('Create a user');
  });

  it('should handle spec without input', () => {
    const OutputModel = new SchemaModel({
      name: 'StatusOutput',
      fields: {
        status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      },
    });

    const spec = defineQuery({
      meta: {
        key: 'system.status',
        version: 1,
        description: 'Get system status',
        goal: 'Check system health',
        context: 'Health checks',
        stability: 'stable',
        owners: ['platform.core'],
        tags: [],
      },
      policy: { auth: 'anonymous' },
      io: { input: null, output: OutputModel },
    });

    const result = jsonSchemaForSpec(spec);

    expect(result.input).toBeNull();
    expect(result.output).toBeDefined();
  });

  it('should handle spec with input and output', () => {
    const InputModel = new SchemaModel({
      name: 'GetItemInput',
      fields: {
        id: { type: ScalarTypeEnum.ID(), isOptional: false },
      },
    });

    const OutputModel = new SchemaModel({
      name: 'GetItemOutput',
      fields: {
        id: { type: ScalarTypeEnum.ID(), isOptional: false },
        name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      },
    });

    const spec = defineQuery({
      meta: {
        key: 'item.get',
        version: 1,
        description: 'Get an item',
        goal: 'Retrieve item from system',
        context: 'Read operations',
        stability: 'stable',
        owners: ['platform.core'],
        tags: [],
      },
      policy: { auth: 'user' },
      io: { input: InputModel, output: OutputModel },
    });

    const result = jsonSchemaForSpec(spec);

    expect(result.input).toBeDefined();
    expect(result.output).toBeDefined();
  });
});

describe('defaultRestPath', () => {
  it('should generate REST path from name and version', () => {
    expect(defaultRestPath('user.create', 1)).toBe('/user/create/v1');
    expect(defaultRestPath('orders.list', 2)).toBe('/orders/list/v2');
    expect(defaultRestPath('payment.process', 10)).toBe('/payment/process/v10');
  });

  it('should handle nested namespaces', () => {
    expect(defaultRestPath('api.v1.users.list', 1)).toBe(
      '/api/v1/users/list/v1'
    );
  });
});

describe('defaultMcpTool', () => {
  it('should generate MCP tool name from name and version', () => {
    expect(defaultMcpTool('user.create', 1)).toBe('user.create-v1');
    expect(defaultMcpTool('orders.list', 2)).toBe('orders.list-v2');
  });
});

describe('defaultGqlField', () => {
  it('should generate GraphQL field name from name and version', () => {
    expect(defaultGqlField('user.create', 1)).toBe('user_create_v1');
    expect(defaultGqlField('orders.list', 2)).toBe('orders_list_v2');
    expect(defaultGqlField('api.v1.users.get', 3)).toBe('api_v1_users_get_v3');
  });
});
