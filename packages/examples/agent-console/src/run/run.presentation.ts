import type { PresentationSpec } from '@lssm/lib.contracts';
import { StabilityEnum } from '@lssm/lib.contracts';
import { RunSummaryModel } from './run.schema';

/**
 * Presentation for displaying a list of agent runs.
 */
export const RunListPresentation: PresentationSpec = {
  meta: {
    name: 'agent-console.run.list',
    version: 1,
    title: 'Run List',
    description:
      'List view of agent runs with status, tokens, and duration info',
    domain: 'agent-console',
    owners: ['@agent-console-team'],
    tags: ['run', 'list', 'dashboard'],
    stability: StabilityEnum.Experimental,
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
export const RunDetailPresentation: PresentationSpec = {
  meta: {
    name: 'agent-console.run.detail',
    version: 1,
    title: 'Run Details',
    description: 'Detailed view of an agent run with steps, logs, and metrics',
    domain: 'agent-console',
    owners: ['@agent-console-team'],
    tags: ['run', 'detail'],
    stability: StabilityEnum.Experimental,
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'RunDetailView',
  },
  targets: ['react', 'markdown'],
  policy: { flags: ['agent-console.enabled'] },
};
