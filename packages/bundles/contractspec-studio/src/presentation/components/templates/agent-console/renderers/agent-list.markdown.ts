/**
 * Markdown Renderer for Agent List Presentation
 *
 * Uses handlers from the agent-console example package.
 */
import type {
  PresentationRenderer,
  PresentationDescriptorV2,
} from '@lssm/lib.contracts';
import {
  mockListAgentsHandler,
  type AgentSummary,
} from '@lssm/example.agent-console/handlers/index';

type Agent = AgentSummary;

/**
 * Markdown renderer for agent-console.agent.list presentation
 * Only handles AgentListView component
 */
export const agentListMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc: PresentationDescriptorV2) => {
    // Only handle AgentListView
    if (
      desc.source.type !== 'component' ||
      desc.source.componentKey !== 'AgentListView'
    ) {
      throw new Error('agentListMarkdownRenderer: not AgentListView');
    }

    // Fetch data using mock handler
    const data = await mockListAgentsHandler({
      organizationId: 'demo-org',
      limit: 50,
      offset: 0,
    });

    // Generate markdown
    const lines: string[] = [
      `# ${desc.meta.description ?? 'Agent List'}`,
      '',
      `> ${desc.meta.name} v${desc.meta.version}`,
      '',
      `**Total Agents:** ${data.total}`,
      '',
      '## Agents',
      '',
    ];

    // Group by status
    const byStatus: Record<string, Agent[]> = {};
    for (const agent of data.items) {
      const status = agent.status;
      if (!byStatus[status]) byStatus[status] = [];
      byStatus[status]!.push(agent);
    }

    for (const [status, agents] of Object.entries(byStatus)) {
      lines.push(`### ${status} (${agents.length})`);
      lines.push('');
      for (const agent of agents) {
        lines.push(
          `- **${agent.name}** (${agent.modelProvider}/${agent.modelName})`
        );
        if (agent.description) {
          lines.push(`  > ${agent.description}`);
        }
      }
      lines.push('');
    }

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};
