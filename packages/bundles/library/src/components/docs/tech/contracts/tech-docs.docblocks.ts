import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts/docs';

export const techContractsDocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.contracts.index',
    title: 'Contracts tech docs',
    summary: 'Entry for ContractSpec contracts technical documentation.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/tech/contracts',
    tags: ['tech', 'contracts'],
    body: `# Contracts Tech Docs

Reference docs for ContractSpec contracts: app-config, capabilities, data-views, integrations, policy, presentations, overlays, and more.`,
  },
];
registerDocBlocks(techContractsDocBlocks);
