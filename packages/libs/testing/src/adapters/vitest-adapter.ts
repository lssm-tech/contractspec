import type { GoldenTestCase } from '../types';
import { serialize } from '../generator/assertion-builder';

export interface VitestAdapterOptions {
  suiteName: string;
  cases: GoldenTestCase[];
  runnerImport: string;
  runnerFunction: string;
}

export function generateVitestSuite(options: VitestAdapterOptions) {
  const caseBlocks = options.cases
    .map((testCase) => {
      const inputConst = serialize(testCase.input);
      const metadataConst = serialize(testCase.metadata ?? {});
      const assertions = testCase.success
        ? [
            `const result = await ${options.runnerFunction}(input${testCase.id}, metadata${testCase.id});`,
            `expect(result).toEqual(${serialize(testCase.expectedOutput ?? null)});`,
          ]
        : [
            `await expect(${options.runnerFunction}(input${testCase.id}, metadata${testCase.id})).rejects.toMatchObject(${serialize(testCase.expectedError ?? { message: 'expected failure' })});`,
          ];

      return `
  it('${testCase.name}', async () => {
    const input${testCase.id} = ${inputConst};
    const metadata${testCase.id} = ${metadataConst};
    ${assertions.join('\n    ')}
  });`;
    })
    .join('\n');

  return `
import { describe, it, expect } from 'bun:test';
import { ${options.runnerFunction} } from '${options.runnerImport}';

describe('${options.suiteName}', () => {${caseBlocks}
});
`.trim();
}










