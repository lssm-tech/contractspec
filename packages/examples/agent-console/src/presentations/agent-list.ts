/**
 * Agent List Presentation Descriptor
 */
import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';
import { AgentSummaryModel } from '../contracts/agent';

/**
 * Presentation for displaying a list of AI agents.
 * Supports both React (DataTable) and Markdown (list) rendering.
 */
export const AgentListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'agent-console.agent.list',
    version: 1,
    description: 'List view of AI agents with status, model provider, and version info',
    domain: 'agent-console',
    owners: ['agent-console-team'],
    tags: ['agent', 'list', 'dashboard'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'AgentListView',
    props: AgentSummaryModel,
  },
  targets: ['react', 'markdown', 'application/json'],
  policy: {
    flags: ['agent-console.enabled'],
  },
};

/**
 * Presentation for agent detail view.
 */
export const AgentDetailPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'agent-console.agent.detail',
    version: 1,
    description: 'Detailed view of an AI agent with configuration, tools, and recent runs',
    domain: 'agent-console',
    owners: ['agent-console-team'],
    tags: ['agent', 'detail'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'AgentDetailView',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['agent-console.enabled'],
  },
};

