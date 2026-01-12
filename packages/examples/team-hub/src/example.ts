import { defineExample } from '@contractspec/lib.contracts';

const example = defineExample({
  meta: {
    key: 'team-hub',
    version: '1.0.0',
    title: 'Team Hub',
    description:
      'Internal collaboration hub with spaces, tasks, rituals, and announcements.',
    kind: 'template',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['tasks', 'rituals', 'announcements', 'collaboration'],
  },
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
});

export default example;
