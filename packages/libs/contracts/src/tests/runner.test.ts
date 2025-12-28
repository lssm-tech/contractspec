import { describe, expect, it } from 'bun:test';
import { TestRunner } from './runner';
import type { TestSpec } from './spec';
import {
  defineCommand,
  defineEvent,
  type HandlerCtx,
  OperationSpecRegistry,
} from '@contractspec/lib.contracts';
import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { StabilityEnum } from '../ownership';

const NumberType = ScalarTypeEnum.Float_unsecure();

const AddNumbersInput = new SchemaModel({
  name: 'AddNumbersInput',
  fields: {
    a: { type: NumberType, isOptional: false },
    b: { type: NumberType, isOptional: false },
  },
});

const AddNumbersOutput = new SchemaModel({
  name: 'AddNumbersOutput',
  fields: {
    sum: { type: NumberType, isOptional: false },
  },
});

const SumCalculatedPayload = new SchemaModel({
  name: 'SumCalculatedPayload',
  fields: {
    sum: { type: NumberType, isOptional: false },
  },
});

const SumCalculatedEvent = defineEvent({
  meta: {
    key: 'math.sum_calculated',
    version: 1,
    description: 'Sum calculated',
    stability: StabilityEnum.Experimental,
    owners: ['@team.math'],
    tags: ['math'],
  },
  payload: SumCalculatedPayload,
});

const AddNumbersSpec = defineCommand({
  meta: {
    key: 'math.add',
    version: 1,
    description: 'Adds two numbers',
    goal: 'Verify math operations',
    context: 'Internal testing',
    owners: ['@team.math'],
    tags: ['math'],
    stability: StabilityEnum.Experimental,
  },
  io: {
    input: AddNumbersInput,
    output: AddNumbersOutput,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        key: SumCalculatedEvent.meta.key,
        version: SumCalculatedEvent.meta.version,
        payload: SumCalculatedEvent.payload,
        when: 'after calculation',
      },
    ],
  },
});

const registry = new OperationSpecRegistry();
registry.register(AddNumbersSpec);
registry.bind(
  AddNumbersSpec,
  async (
    input: { a: number; b: number },
    ctx: HandlerCtx
  ): Promise<{ sum: number }> => {
    const { a, b } = input ?? { a: 0, b: 0 };
    const sum = Number(a) + Number(b);
    await ctx.__emitGuard__?.('math.sum_calculated', 1, { sum });
    return { sum };
  }
);

const testSpec: TestSpec = {
  meta: {
    key: 'math.add.tests',
    version: 1,
    title: 'Math add scenarios',
    description: 'Test scenarios for math.add operation',
    owners: ['@team.math'],
    tags: ['math', 'contracts'],
    stability: StabilityEnum.Experimental,
  },
  target: { type: 'operation', operation: { key: 'math.add' } },
  scenarios: [
    {
      key: 'succeeds with valid numbers',
      when: { operation: { key: 'math.add' }, input: { a: 2, b: 3 } },
      then: [
        { type: 'expectOutput', match: { sum: 5 } },
        {
          type: 'expectEvents',
          events: [{ key: 'math.sum_calculated', version: 1, min: 1 }],
        },
      ],
    },
    {
      key: 'fails output assertion',
      when: { operation: { key: 'math.add' }, input: { a: 2, b: 2 } },
      then: [{ type: 'expectOutput', match: { sum: 5 } }],
    },
  ],
};

describe('TestRunner', () => {
  it('runs scenarios and collects results', async () => {
    const runner = new TestRunner({ registry });
    const result = await runner.run(testSpec);
    expect(result.scenarios).toHaveLength(2);
    expect(result.passed).toBe(1);
    expect(result.failed).toBe(1);
    const failedScenario = result.scenarios.find(
      (scenario) => scenario.status === 'failed'
    );
    expect(failedScenario?.assertionResults[0]?.status).toBe('failed');
  });
});
