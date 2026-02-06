import { defineExample } from '@contractspec/lib.contracts';

const example = defineExample({
  meta: {
    key: 'email-gmail',
    version: '1.0.0',
    title: 'Gmail Inbound and Outbound',
    description:
      'List Gmail threads/messages and send outbound email using the Gmail providers.',
    kind: 'integration',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.integrations'],
    tags: ['email', 'gmail', 'inbound', 'outbound', 'integrations'],
  },
  docs: {
    rootDocId: 'docs.examples.email-gmail',
    usageDocId: 'docs.examples.email-gmail.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.email-gmail',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown', 'specs'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
});

export default example;
