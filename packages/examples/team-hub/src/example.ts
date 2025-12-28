const example = {
  id: 'team-hub',
  title: 'Team Hub',
  summary:
    'Internal collaboration hub with spaces, tasks, rituals, and announcements.',
  tags: ['tasks', 'rituals', 'announcements', 'collaboration'],
  kind: 'template',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.team-hub',
    goalDocId: 'docs.examples.team-hub.goal',
    usageDocId: 'docs.examples.team-hub.usage',
    constraintsDocId: 'docs.examples.team-hub.constraints',
  },
  entrypoints: {
    packageName: '@contractspec/example.team-hub',
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
} as const;

export default example;
