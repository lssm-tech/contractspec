import { z } from 'zod';
import type { ExampleDefinition } from './types';

const ExampleDefinitionSchema: z.ZodType<ExampleDefinition> = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string()).default([]),
  kind: z.enum([
    'template',
    'workflow',
    'integration',
    'knowledge',
    'blueprint',
    'ui',
    'script',
    'library',
  ]),
  visibility: z.enum(['public', 'internal', 'mixed']),
  docs: z
    .object({
      rootDocId: z.string().optional(),
      goalDocId: z.string().optional(),
      usageDocId: z.string().optional(),
      referenceDocId: z.string().optional(),
      constraintsDocId: z.string().optional(),
    })
    .optional(),
  entrypoints: z.object({
    packageName: z.string().min(1),
    feature: z.string().optional(),
    presentations: z.string().optional(),
    contracts: z.string().optional(),
    handlers: z.string().optional(),
    ui: z.string().optional(),
    docs: z.string().optional(),
  }),
  surfaces: z.object({
    templates: z.boolean(),
    sandbox: z.object({
      enabled: z.boolean(),
      modes: z.array(
        z.enum(['playground', 'specs', 'builder', 'markdown', 'evolution'])
      ),
    }),
    studio: z.object({
      enabled: z.boolean(),
      installable: z.boolean(),
    }),
    mcp: z.object({
      enabled: z.boolean(),
    }),
  }),
});

export type ExampleValidationError = {
  exampleId?: string;
  message: string;
  path?: string;
};

export type ValidateExamplesResult =
  | { ok: true; examples: ExampleDefinition[] }
  | { ok: false; errors: ExampleValidationError[] };

export function validateExamples(
  examples: ExampleDefinition[]
): ValidateExamplesResult {
  const errors: ExampleValidationError[] = [];

  const seen = new Set<string>();
  for (const example of examples) {
    if (seen.has(example.id)) {
      errors.push({
        exampleId: example.id,
        message: `Duplicate example id: ${example.id}`,
      });
      continue;
    }
    seen.add(example.id);

    const parsed = ExampleDefinitionSchema.safeParse(example);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        errors.push({
          exampleId: example.id,
          message: issue.message,
          path: issue.path.join('.'),
        });
      }
    }
  }

  if (errors.length) return { ok: false, errors };
  return { ok: true, examples };
}


