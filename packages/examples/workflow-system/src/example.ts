import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
  meta: {
    key: 'workflow-system',
    version: '1.0.0',
    title: 'Workflow / Approval System',
    description:
      'State-machine driven approvals with RBAC, audit trail, notifications, and jobs.',
    kind: 'template',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['workflow', 'approval', 'state-machine', 'rbac'],
  },
  docs: {
    rootDocId: 'docs.examples.workflow-system',
    goalDocId: 'docs.examples.workflow-system.goal',
    usageDocId: 'docs.examples.workflow-system.usage',
    constraintsDocId: 'docs.examples.workflow-system.constraints',
  },
  entrypoints: {
    packageName: '@contractspec/example.workflow-system',
    feature: './feature',
    contracts: './contracts',
    presentations: './presentations',
    handlers: './handlers',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: {
      enabled: true,
      modes: ['playground', 'specs', 'builder', 'markdown', 'evolution'],
    },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
});

export default example;
