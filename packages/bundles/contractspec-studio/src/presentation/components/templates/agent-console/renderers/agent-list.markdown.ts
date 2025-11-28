/**
 * Markdown Renderer for Agent List Presentation
 */
import type {
  PresentationRenderer,
  PresentationDescriptorV2,
} from '@lssm/lib.contracts';
import { mockListAgentsHandler } from '@lssm/example.agent-console/handlers';

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
    const byStatus = data.items.reduce(
      (acc, agent) => {
        if (!acc[agent.status]) acc[agent.status] = [];
        acc[agent.status].push(agent);
        return acc;
      },
      {} as Record<string, typeof data.items>
    );

    for (const [status, agents] of Object.entries(byStatus)) {
      lines.push(`### ${status} (${agents.length})`);
      lines.push('');
      for (const agent of agents) {
        lines.push(
          `- **${agent.name}** (${agent.modelProvider}/${agent.modelName}) - v${agent.version}`
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
