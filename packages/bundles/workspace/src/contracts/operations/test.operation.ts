import { defineCommand } from '@contractspec/lib.contracts-spec';
import { z } from 'zod';
import { fromZod } from '@contractspec/lib.schema';

export const testOperation = defineCommand({
  meta: {
    key: 'test',
    title: 'Test Specs',
    description: 'Run tests defined in contract specs',
    version: '1.0.0',
    stability: 'stable',
    tags: ['cli', 'test'],
    goal: 'Execute tests defined in specs',
    context: 'Run via CLI',
    owners: ['@lssm/core'],
  },
  policy: {
    auth: 'anonymous',
  },
  io: {
    input: fromZod(
      z.object({
        specFile: z
          .string()
          .describe('Path to the test spec file (or glob pattern)'),
        registry: z
          .string()
          .optional()
          .describe('Path to the test registry (optional)'),
        json: z.boolean().optional().describe('Output results as JSON'),
      })
    ),
    output: fromZod(
      z.object({
        passed: z.boolean(),
        results: z.array(z.any()),
      })
    ),
  },
});
