import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
  meta: {
    key: 'project-management-sync',
    version: '1.0.0',
    title: 'Project Management Sync',
    description:
      'Create project-management work items in Linear, Jira Cloud, or Notion from a shared payload.',
    kind: 'integration',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.integrations'],
    tags: ['project-management', 'linear', 'jira', 'notion', 'integrations'],
  },
  docs: {
    rootDocId: 'docs.examples.project-management-sync',
    usageDocId: 'docs.examples.project-management-sync.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.project-management-sync',
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
