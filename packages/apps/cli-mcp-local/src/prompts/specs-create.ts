import { definePrompt } from '@lssm/lib.contracts';
import z from 'zod';

export function specsCreatePrompt() {
  const input = z.object({
    type: z.string(),
    name: z.string(),
    version: z.number().optional(),
  });

  return definePrompt({
    meta: {
      name: 'specs.create',
      version: 1,
      title: 'Create a spec',
      description:
        'Guidance to scaffold a spec file using specs.create, then validate and build.',
      tags: ['contractspec', 'specs'],
      stability: 'stable',
      owners: ['@contractspec'],
    },
    args: [
      {
        name: 'type',
        schema: z.string(),
        required: true,
        description: 'operation | event | presentation | feature',
      },
      {
        name: 'name',
        schema: z.string(),
        required: true,
        description: 'Spec name (e.g. users.createUser)',
      },
      { name: 'version', schema: z.number().optional(), description: 'Defaults to 1' },
    ],
    input,
    render: async ({ type, name, version }) => {
      const v = version ?? 1;
      const text =
        `To scaffold a new spec:\n\n` +
        `- Run: specs.create { type: "${type}", name: "${name}", version: ${v} }\n` +
        `- Then: specs.validate { specPath: <returned filePath> }\n` +
        `- Optionally: specs.build { specPath: <returned filePath> }\n` +
        `- Finally link ops/events/presentations from a *.feature.ts file to avoid orphans.\n`;
      return [{ type: 'text', text }];
    },
  });
}


