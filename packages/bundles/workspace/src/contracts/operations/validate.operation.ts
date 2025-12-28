import { defineCommand } from '@contractspec/lib.contracts';
import { z } from 'zod';
import { fromZod } from '@contractspec/lib.schema';

export const validateOperation = defineCommand({
  meta: {
    key: 'validate',
    title: 'Validate Spec',
    description:
      'Validate a contract spec file structure and optionally its implementation',
    version: '1.0.0',
    stability: 'stable',
    tags: ['cli', 'validation'],
    goal: 'Ensure spec validity and integrity',
    context: 'Run via CLI or CI to check specs',
    owners: ['@lssm/core'],
  },
  policy: {
    auth: 'anonymous',
  },
  io: {
    input: fromZod(
      z.object({
        spec: z.string().describe('Path to the spec file to validate'),
        blueprint: z
          .string()
          .optional()
          .describe('Validate against a blueprint spec'),
        checkImplementation: z
          .union([z.boolean(), z.literal('auto')])
          .optional()
          .describe('Validate implementation against spec (requires AI)'),
      })
    ),
    output: fromZod(
      z.object({
        valid: z.boolean(),
        errors: z.array(z.string()),
        warnings: z.array(z.string()),
        structureResult: z.any().optional(), // Detailed structure result
      })
    ),
  },
});
