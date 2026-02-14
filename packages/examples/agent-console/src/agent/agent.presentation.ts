import { definePresentation, StabilityEnum } from '@contractspec/lib.contracts-spec';
import { AgentSummaryModel } from './agent.schema';

/**
 * Presentation for displaying a list of AI agents.
 */
export const AgentListPresentation = definePresentation({
  meta: {
    key: 'agent-console.agent.viewList',
    version: '1.0.0',
    title: 'Agent List',
    description:
      'List view of AI agents with status, model provider, and version info',
    goal: 'Provide an overview of all agents in an organization.',
    context: 'Main landing page for agent management.',
    domain: 'agent-console',
    owners: ['@agent-console-team'],
    tags: ['agent', 'list', 'dashboard'],
    stability: StabilityEnum.Experimental,
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'AgentListView',
    props: AgentSummaryModel,
  },
  targets: ['react', 'markdown', 'application/json'],
  policy: { flags: ['agent-console.enabled'] },
});

/**
 * Presentation for agent detail view.
 */
export const AgentDetailPresentation = definePresentation({
  meta: {
    key: 'agent-console.agent.detail',
    version: '1.0.0',
    title: 'Agent Details',
    description:
      'Detailed view of an AI agent with configuration, tools, and recent runs',
    goal: 'Allow users to inspect and configure a specific agent.',
    context: 'Detailed view of an agent.',
    domain: 'agent-console',
    owners: ['@agent-console-team'],
    tags: ['agent', 'detail'],
    stability: StabilityEnum.Experimental,
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'AgentDetailView',
  },
  targets: ['react', 'markdown'],
  policy: { flags: ['agent-console.enabled'] },
});

/**
 * Dashboard presentation for Agent Console - overview of agents, runs, and tools.
 */
export const AgentConsoleDashboardPresentation = definePresentation({
  meta: {
    key: 'agent-console.dashboard',
    version: '1.0.0',
    title: 'Agent Console Dashboard',
    description: 'Dashboard overview of AI agents, runs, and tools',
    goal: 'Provide a high-level overview of the AI platform health and usage.',
    context: 'Root dashboard of the Agent Console.',
    domain: 'agent-console',
    owners: ['@agent-console-team'],
    tags: ['dashboard', 'overview'],
    stability: StabilityEnum.Experimental,
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'AgentConsoleDashboard',
  },
  targets: ['react', 'markdown'],
  policy: { flags: ['agent-console.enabled'] },
});
