import { describe, expect, test } from 'bun:test';
import { GoldenTestGenerator, runGoldenTests } from './golden-test-generator';

describe('GoldenTestGenerator', () => {
  test('createCases uses provided ids', () => {
    const generator = new GoldenTestGenerator();
    const cases = generator.createCases([
      {
        id: 'case-1',
        operation: { name: 'op', version: '1.0.0' },
        input: { value: 1 },
        output: { ok: true },
        success: true,
        timestamp: new Date(),
      },
      {
        id: 'case-2',
        operation: { name: 'op', version: '1.0.0' },
        input: { value: 2 },
        output: { ok: false },
        success: false,
        timestamp: new Date(),
      },
    ]);

    expect(cases[0]?.id).toBe('case-1');
    expect(cases[1]?.id).toBe('case-2');
    expect(cases[0]?.name).toBe('case-1-success');
    expect(cases[1]?.name).toBe('case-2-failure');
  });

  test('runGoldenTests validates expected output', async () => {
    const results = await runGoldenTests(
      [
        {
          id: 'case-1',
          name: 'case-1-success',
          input: { value: 1 },
          expectedOutput: { ok: true },
          success: true,
        },
      ],
      async (input) => ({ ok: (input as { value: number }).value === 1 })
    );

    expect(results[0]?.passed).toBe(true);
  });
});
