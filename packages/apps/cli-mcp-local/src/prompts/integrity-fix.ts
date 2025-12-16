import { definePrompt } from '@lssm/lib.contracts';
import z from 'zod';

export function integrityFixPrompt() {
  const input = z.object({
    issueType: z.string().optional(),
    specName: z.string().optional(),
  });

  return definePrompt({
    meta: {
      name: 'integrity.fix',
      version: 1,
      title: 'Fix integrity issues',
      description: 'Guidance to fix orphaned specs and unresolved references.',
      tags: ['contractspec', 'integrity'],
      stability: 'stable',
      owners: ['@contractspec'],
    },
    args: [
      {
        name: 'issueType',
        schema: z.string().optional(),
        description: 'orphaned | unresolved-ref | broken-link',
      },
      {
        name: 'specName',
        schema: z.string().optional(),
        description: 'Spec name involved (optional)',
      },
    ],
    input,
    render: async ({ issueType, specName }) => {
      const header =
        `You are fixing ContractSpec integrity issues.\n\n` +
        `IssueType: ${issueType ?? 'all'}\n` +
        `Spec: ${specName ?? '(not specified)'}\n`;

      const steps =
        `1) Run: integrity.analyze\n` +
        `2) If orphaned: link it from a *.feature.ts file (FeatureModuleSpec.operations/events/presentations).\n` +
        `3) If unresolved: fix name/version in the feature file OR create the missing spec.\n` +
        `4) Re-run integrity.analyze until healthy=true.\n`;

      return [
        { type: 'text', text: header + '\n' + steps },
        { type: 'resource', uri: 'spec://inventory', title: 'Spec inventory' },
        { type: 'resource', uri: 'feature://list', title: 'Feature list' },
      ];
    },
  });
}
