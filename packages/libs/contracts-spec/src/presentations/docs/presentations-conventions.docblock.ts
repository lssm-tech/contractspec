import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '../../docs/registry';

export const tech_contracts_presentations_conventions_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.contracts.presentations-conventions',
    title: 'Presentations Conventions (A11y & i18n)',
    summary:
      '- Always provide `meta.description` (\u2265 3 chars) \u2014 used by a11y/docs/agents.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/contracts/presentations-conventions',
    tags: ['tech', 'contracts', 'presentations-conventions'],
    body: '## Presentations Conventions (A11y & i18n)\n\n- Always provide `meta.description` (\u2265 3 chars) \u2014 used by a11y/docs/agents.\n- Prefer source = BlockNote for rich guides; use component key for interactive flows.\n- i18n strings belong in host apps; descriptors carry keys/defaults only.\n- Target selection: include only what you intend to support to avoid drift.\n- PII: declare JSON-like paths under `policy.pii`; engine redacts in outputs.\n',
  },
];
registerDocBlocks(tech_contracts_presentations_conventions_DocBlocks);
