import { defineCommand } from '@contractspec/lib.contracts';
import { z } from 'zod';

export const testOperation = defineCommand({
  meta: {
    name: 'test',
    title: 'Test Specs',
    description: 'Run tests defined in contract specs',
    version: '1.0.0',
    stability: 'stable',
    tags: ['cli', 'test'],
  },
  input: z.object({
    specFile: z.string().describe('Path to the test spec file (or glob pattern)'),
    registry: z.string().optional().describe('Path to the test registry (optional)'),
    json: z.boolean().optional().describe('Output results as JSON'),
  }),
  output: z.object({
    passed: z.boolean(),
    results: z.array(z.any()),
  }),
});
