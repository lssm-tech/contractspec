import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';
import { RunSummaryModel } from './run.schema';

/**
 * Presentation for displaying a list of agent runs.
 */
export const RunListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'agent-console.run.list',
    version: 1,
    description:
      'List view of agent runs with status, tokens, and duration info',
    domain: 'agent-console',
    owners: ['agent-console-team'],
    tags: ['run', 'list', 'dashboard'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'RunListView',
    props: RunSummaryModel,
  },
  targets: ['react', 'markdown', 'application/json'],
  policy: { flags: ['agent-console.enabled'] },
};

/**
 * Presentation for run detail view.
 */
export const RunDetailPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'agent-console.run.detail',
    version: 1,
    description: 'Detailed view of an agent run with steps, logs, and metrics',
    domain: 'agent-console',
    owners: ['agent-console-team'],
    tags: ['run', 'detail'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'RunDetailView',
  },
  targets: ['react', 'markdown'],
  policy: { flags: ['agent-console.enabled'] },
};
