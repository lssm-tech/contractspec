import { describe, expect, it } from 'bun:test';
import {
  jsonSchemaForSpec,
  defaultRestPath,
  defaultMcpTool,
  defaultMcpPrompt,
  defaultGqlField,
  sanitizeMcpName,
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
        version: '1.0.0',
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
    expect(result.meta.version).toBe('1.0.0');
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
        version: '1.0.0',
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
        version: '1.0.0',
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
    expect(defaultRestPath('user.create', '1.0.0')).toBe('/user/create/v1.0.0');
    expect(defaultRestPath('orders.list', '2.0.0')).toBe('/orders/list/v2.0.0');
    expect(defaultRestPath('payment.process', '10.0.0')).toBe(
      '/payment/process/v10.0.0'
    );
  });

  it('should handle nested namespaces', () => {
    expect(defaultRestPath('api.v1.users.list', '1.0.0')).toBe(
      '/api/v1/users/list/v1.0.0'
    );
  });
});

describe('defaultMcpTool', () => {
  it('should generate MCP tool name from name and version with underscores', () => {
    expect(defaultMcpTool('user.create', '1.0.0')).toBe('user_create-v1_0_0');
    expect(defaultMcpTool('orders.list', '2.0.0')).toBe('orders_list-v2_0_0');
  });

  it('should handle deeply nested namespaces', () => {
    expect(defaultMcpTool('cli.suggestCommand', '1.0.0')).toBe(
      'cli_suggestCommand-v1_0_0'
    );
  });
});

describe('defaultGqlField', () => {
  it('should generate GraphQL field name from name and version', () => {
    expect(defaultGqlField('user.create', '1.0.0')).toBe('user_create_v1.0.0');
    expect(defaultGqlField('orders.list', '2.0.0')).toBe('orders_list_v2.0.0');
    expect(defaultGqlField('api.v1.users.get', '3.0.0')).toBe(
      'api_v1_users_get_v3.0.0'
    );
  });
});

describe('sanitizeMcpName', () => {
  it('should replace dots with underscores', () => {
    expect(sanitizeMcpName('user.create')).toBe('user_create');
    expect(sanitizeMcpName('cli.suggestCommand')).toBe('cli_suggestCommand');
    expect(sanitizeMcpName('a.b.c.d')).toBe('a_b_c_d');
  });

  it('should truncate names longer than 64 characters', () => {
    const longName = 'a'.repeat(100);
    expect(sanitizeMcpName(longName)).toHaveLength(64);
  });

  it('should preserve names without dots', () => {
    expect(sanitizeMcpName('simple_name')).toBe('simple_name');
    expect(sanitizeMcpName('with-hyphen')).toBe('with-hyphen');
  });
});

describe('defaultMcpPrompt', () => {
  it('should sanitize prompt keys by replacing dots', () => {
    expect(defaultMcpPrompt('prompt.assistant')).toBe('prompt_assistant');
    expect(defaultMcpPrompt('cli.help')).toBe('cli_help');
  });

  it('should handle keys without dots', () => {
    expect(defaultMcpPrompt('simple')).toBe('simple');
  });
});
