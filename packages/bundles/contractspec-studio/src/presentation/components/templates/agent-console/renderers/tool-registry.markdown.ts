/**
 * Markdown Renderer for Tool Registry Presentation
 *
 * Uses dynamic import for handlers to ensure correct build order.
 */
import type {
  PresentationRenderer,
  PresentationDescriptorV2,
} from '@lssm/lib.contracts';
import type { Tool } from '../hooks/useToolList';
import { mockListToolsHandler } from '@lssm/example.agent-console/handlers/index';

interface ToolListOutput {
  items: Tool[];
  total: number;
  hasMore: boolean;
}

/**
 * Markdown renderer for agent-console.tool.registry presentation
 */
export const toolRegistryMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc: PresentationDescriptorV2) => {
    // Fetch data using mock handler
    const data = (await mockListToolsHandler({
      organizationId: 'demo-org',
      limit: 50,
      offset: 0,
    })) as ToolListOutput;

    // Generate markdown
    const lines: string[] = [
      `# ${desc.meta.description ?? 'Tool Registry'}`,
      '',
      `> ${desc.meta.name} v${desc.meta.version}`,
      '',
      `**Total Tools:** ${data.total}`,
      '',
    ];

    // Group by category
    const byCategory: Record<string, Tool[]> = {};
    for (const tool of data.items) {
      const cat = tool.category;
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(tool);
    }

    for (const [category, tools] of Object.entries(byCategory).sort()) {
      lines.push(`## ${category} (${tools.length})`);
      lines.push('');

      for (const tool of tools) {
        const statusIcon =
          tool.status === 'ACTIVE'
            ? '✅'
            : tool.status === 'DEPRECATED'
              ? '⚠️'
              : '❌';
        lines.push(`### ${statusIcon} ${tool.name} v${tool.version}`);
        lines.push('');
        lines.push(`> \`${tool.slug}\``);
        lines.push('');
        if (tool.description) {
          lines.push(tool.description);
          lines.push('');
        }
      }
    }

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};
