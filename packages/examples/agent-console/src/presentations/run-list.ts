/**
 * Run List Presentation Descriptor
 */
import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';
import { RunSummaryModel } from '../contracts/run';

/**
 * Presentation for displaying a list of agent runs.
 */
export const RunListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'agent-console.run.list',
    version: 1,
    description: 'List view of agent execution runs with status, tokens, duration, and cost',
    domain: 'agent-console',
    owners: ['agent-console-team'],
    tags: ['run', 'list', 'history'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'RunListView',
    props: RunSummaryModel,
  },
  targets: ['react', 'markdown', 'application/json'],
  policy: {
    flags: ['agent-console.enabled'],
  },
};

/**
 * Presentation for run detail view with steps and logs.
 */
export const RunDetailPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'agent-console.run.detail',
    version: 1,
    description: 'Detailed view of a run with step-by-step execution and logs',
    domain: 'agent-console',
    owners: ['agent-console-team'],
    tags: ['run', 'detail', 'debug'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'RunDetailView',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['agent-console.enabled'],
  },
};

/**
 * Presentation for run metrics dashboard.
 */
export const RunMetricsPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'agent-console.run.metrics',
    version: 1,
    description: 'Metrics and analytics dashboard for agent runs',
    domain: 'agent-console',
    owners: ['agent-console-team'],
    tags: ['run', 'metrics', 'analytics'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'RunMetricsView',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['agent-console.enabled'],
  },
};

