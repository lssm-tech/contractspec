/**
 * Markdown Renderer for Tool Registry Presentation
 *
 * Uses dynamic import for handlers to ensure correct build order.
 */
import type { PresentationSpec } from '@contractspec/lib.contracts-spec/presentations';
import type { PresentationRenderer } from '@contractspec/lib.contracts-spec/presentations/transform-engine';
import { mockListToolsHandler } from '@contractspec/example.agent-console/handlers';

interface ToolItem {
  id: string;
  name: string;
  description?: string;
  version: string;
  category: string;
  status: string;
}

/**
 * Markdown renderer for agent-console.tool.registry presentation
 * Only handles ToolRegistryView component
 */
export const toolRegistryMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc: PresentationSpec) => {
    // Only handle ToolRegistryView
    if (
      desc.source.type !== 'component' ||
      desc.source.componentKey !== 'ToolRegistryView'
    ) {
      throw new Error('toolRegistryMarkdownRenderer: not ToolRegistryView');
    }

    // Fetch data using mock handler
    const data = await mockListToolsHandler({
      organizationId: 'demo-org',
      limit: 50,
      offset: 0,
    });

    // Generate markdown
    const lines: string[] = [
      `# ${desc.meta.description ?? 'Tool Registry'}`,
      '',
      `> ${desc.meta.key} v${desc.meta.version}`,
      '',
      `**Total Tools:** ${data.total}`,
      '',
    ];

    // Group by category
    const byCategory: Record<string, ToolItem[]> = {};
    for (const tool of data.items as ToolItem[]) {
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
        lines.push(`> \`${tool.id}\``);
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
