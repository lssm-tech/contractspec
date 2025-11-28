/**
 * Agent Console Dashboard Presentation Descriptor
 */
import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';

/**
 * Main dashboard presentation for the agent console.
 * Combines agent stats, recent runs, and tool overview.
 */
export const AgentConsoleDashboardPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'agent-console.dashboard',
    version: 1,
    description: 'Main dashboard for AI agent operations with stats, recent activity, and quick actions',
    domain: 'agent-console',
    owners: ['agent-console-team'],
    tags: ['dashboard', 'overview'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'AgentConsoleDashboard',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['agent-console.enabled'],
  },
};

