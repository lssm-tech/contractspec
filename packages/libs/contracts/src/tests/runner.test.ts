import { describe, expect, it } from 'vitest';
import { TestRunner } from './runner';
import type { TestSpec } from './spec';
import {
  SpecRegistry,
  defineCommand,
  defineEvent,
  type HandlerCtx,
} from '@lssm/lib.contracts';
import { ScalarTypeEnum, SchemaModel } from '@lssm/lib.schema';
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
  name: 'math.sum_calculated',
  version: 1,
  description: 'Sum calculated',
  payload: SumCalculatedPayload,
});

const AddNumbersSpec = defineCommand({
  meta: {
    name: 'math.add',
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
        ref: SumCalculatedEvent,
        when: 'after calculation',
      },
    ],
  },
});

const registry = new SpecRegistry();
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
    name: 'math.add.tests',
    version: 1,
    title: 'Math add scenarios',
    owners: ['@team.math'],
    tags: ['math', 'contracts'],
    stability: StabilityEnum.Experimental,
  },
  target: { type: 'contract', operation: { name: 'math.add' } },
  scenarios: [
    {
      name: 'succeeds with valid numbers',
      when: { operation: { name: 'math.add' }, input: { a: 2, b: 3 } },
      then: [
        { type: 'expectOutput', match: { sum: 5 } },
        {
          type: 'expectEvents',
          events: [{ name: 'math.sum_calculated', version: 1, min: 1 }],
        },
      ],
    },
    {
      name: 'fails output assertion',
      when: { operation: { name: 'math.add' }, input: { a: 2, b: 2 } },
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

