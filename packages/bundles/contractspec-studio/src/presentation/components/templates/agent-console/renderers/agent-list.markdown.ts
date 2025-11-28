/**
 * Markdown Renderer for Agent List Presentation
 *
 * Uses dynamic import for handlers to ensure correct build order.
 */
import type {
  PresentationRenderer,
  PresentationDescriptorV2,
} from '@lssm/lib.contracts';
import type { Agent } from '../hooks/useAgentList';
import { mockListAgentsHandler } from '@lssm/example.agent-console/handlers/index';

interface AgentListOutput {
  items: Agent[];
  total: number;
  hasMore: boolean;
}

// Dynamic import to ensure build order
async function getHandlers() {
  return { mockListAgentsHandler };
}

/**
 * Markdown renderer for agent-console.agent.list presentation
 */
export const agentListMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc: PresentationDescriptorV2) => {
    // Fetch data using mock handler
    const data = (await mockListAgentsHandler({
      organizationId: 'demo-org',
      limit: 50,
      offset: 0,
    })) as AgentListOutput;

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
      if (!byStatus[agent.status]) byStatus[agent.status] = [];
      byStatus[agent.status].push(agent);
    }

    for (const [status, agents] of Object.entries(byStatus)) {
      lines.push(`### ${status} (${agents.length})`);
      lines.push('');
      for (const agent of agents!) {
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
