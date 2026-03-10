import { describe, expect, it } from 'bun:test';
import { OperationSpecRegistry } from './registry';
import { defineQuery } from './operation';
import type { HandlerCtx } from '../types';
import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { StabilityEnum } from '../ownership';

const OutputModel = new SchemaModel({
  name: 'NoInputOutput',
  fields: {
    received: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const NoInputQuery = defineQuery({
  meta: {
    key: 'test.noInput',
    version: '1.0.0',
    description: 'Query with no input schema',
    goal: 'Test rawInput passthrough',
    context: 'Testing',
    owners: ['@team.test'],
    tags: ['test'],
    stability: StabilityEnum.Experimental,
  },
  io: {
    input: null,
    output: OutputModel,
  },
  policy: { auth: 'anonymous' },
});

describe('OperationSpecRegistry', () => {
  it('passes rawInput to handler when spec has no input schema', async () => {
    const registry = new OperationSpecRegistry();
    registry.register(NoInputQuery);
    registry.bind(
      NoInputQuery,
      async (
        input: unknown,
        _ctx: HandlerCtx
      ): Promise<{ received: string }> => {
        return { received: JSON.stringify(input) };
      }
    );

    const rawInput = { custom: 'payload', count: 42 };
    const result = await registry.execute(
      'test.noInput',
      '1.0.0',
      rawInput,
      {}
    );

    expect(result).toEqual({ received: JSON.stringify(rawInput) });
  });
});
