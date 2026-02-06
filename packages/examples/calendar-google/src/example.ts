import { defineExample } from '@contractspec/lib.contracts';

const example = defineExample({
  meta: {
    key: 'calendar-google',
    version: '1.0.0',
    title: 'Google Calendar',
    description:
      'List upcoming events and create a new event using the Google Calendar provider.',
    kind: 'integration',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.integrations'],
    tags: ['calendar', 'google-calendar', 'integrations'],
  },
  docs: {
    rootDocId: 'docs.examples.calendar-google',
    usageDocId: 'docs.examples.calendar-google.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.calendar-google',
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
