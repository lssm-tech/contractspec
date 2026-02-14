import {
  StabilityEnum,
  definePresentation,
} from '@contractspec/lib.contracts-spec';
import { RunSummaryModel } from './run.schema';

/**
 * Presentation for displaying a list of agent runs.
 */
export const RunListPresentation = definePresentation({
  meta: {
    key: 'agent-console.run.list',
    version: '1.0.0',
    title: 'Run List',
    description:
      'List view of agent runs with status, tokens, and duration info',
    goal: 'Provide an overview of agent execution history and performance.',
    context: 'Run history dashboard.',
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
});

/**
 * Presentation for run detail view.
 */
export const RunDetailPresentation = definePresentation({
  meta: {
    key: 'agent-console.run.detail',
    version: '1.0.0',
    title: 'Run Details',
    description: 'Detailed view of an agent run with steps, logs, and metrics',
    goal: 'Allow users to inspect and debug a specific agent run.',
    context: 'Detailed view of an agent run.',
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
});
