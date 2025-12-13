const example = {
  id: 'workflow-system',
  title: 'Workflow / Approval System',
  summary:
    'State-machine driven approvals with RBAC, audit trail, notifications, and jobs.',
  tags: ['workflow', 'approval', 'state-machine', 'rbac'],
  kind: 'template',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.workflow-system',
    goalDocId: 'docs.examples.workflow-system.goal',
    usageDocId: 'docs.examples.workflow-system.usage',
    constraintsDocId: 'docs.examples.workflow-system.constraints',
  },
  entrypoints: {
    packageName: '@lssm/example.workflow-system',
    feature: './feature',
    contracts: './contracts',
    presentations: './presentations',
    handlers: './handlers',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['playground', 'specs', 'builder', 'markdown', 'evolution'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
} as const;

export default example;


