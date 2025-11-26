import type { GoldenTestCase } from '../types';
import { serialize } from '../generator/assertion-builder';

export interface JestAdapterOptions {
  suiteName: string;
  cases: GoldenTestCase[];
  runnerImport: string;
  runnerFunction: string;
}

export function generateJestSuite(options: JestAdapterOptions) {
  const caseBlocks = options.cases
    .map((testCase) => {
      const inputConst = serialize(testCase.input);
      const metadataConst = serialize(testCase.metadata ?? {});
      const successBlock = `const result = await ${options.runnerFunction}(input${testCase.id}, metadata${testCase.id});
    expect(result).toEqual(${serialize(testCase.expectedOutput ?? null)});`;
      const failureBlock = `await expect(${options.runnerFunction}(input${testCase.id}, metadata${testCase.id})).rejects.toMatchObject(${serialize(
        testCase.expectedError ?? { message: 'expected failure' }
      )});`;

      return `
  test('${testCase.name}', async () => {
    const input${testCase.id} = ${inputConst};
    const metadata${testCase.id} = ${metadataConst};
    ${testCase.success ? successBlock : failureBlock}
  });`;
    })
    .join('\n');

  return `
import { ${options.runnerFunction} } from '${options.runnerImport}';

describe('${options.suiteName}', () => {${caseBlocks}
});
`.trim();
}










