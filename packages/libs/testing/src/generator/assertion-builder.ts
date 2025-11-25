import type { GoldenTestCase } from '../types';

export interface AssertionContext {
  runnerCall: string;
  caseRef: string;
}

export function buildAssertions(
  testCase: GoldenTestCase,
  ctx: AssertionContext
) {
  if (testCase.success) {
    return [
      `const result = await ${ctx.runnerCall};`,
      `expect(result).toEqual(${serialize(testCase.expectedOutput ?? null)});`,
    ].join('\n      ');
  }
  return `await expect(${ctx.runnerCall}).rejects.toMatchObject(${serialize(
    testCase.expectedError ?? { message: 'expected failure' }
  )});`;
}

export function serialize(value: unknown) {
  return JSON.stringify(
    value,
    (_key, val) => {
      if (val instanceof Date) return val.toISOString();
      if (typeof val === 'undefined') return null;
      return val;
    },
    2
  );
}







