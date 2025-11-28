/**
 * Markdown Renderer for Tool Registry Presentation
 */
import type { PresentationRenderer, PresentationDescriptorV2 } from '@lssm/lib.contracts';
import { mockListToolsHandler } from '@lssm/example.agent-console/handlers';

/**
 * Markdown renderer for agent-console.tool.registry presentation
 */
export const toolRegistryMarkdownRenderer: PresentationRenderer<{ mimeType: string; body: string }> = {
  target: 'markdown',
  render: async (desc: PresentationDescriptorV2) => {
    // Fetch data
    const data = await mockListToolsHandler({
      organizationId: 'demo-org',
      limit: 50,
      offset: 0,
    });

    // Group by category
    const byCategory = data.items.reduce(
      (acc, tool) => {
        if (!acc[tool.category]) acc[tool.category] = [];
        acc[tool.category].push(tool);
        return acc;
      },
      {} as Record<string, typeof data.items>
    );

    // Generate markdown
    const categoryIcons: Record<string, string> = {
      RETRIEVAL: '🔍',
      COMPUTATION: '🧮',
      COMMUNICATION: '📧',
      INTEGRATION: '🔗',
      UTILITY: '🛠️',
      CUSTOM: '⚙️',
    };

    const lines: string[] = [
      `# ${desc.meta.description ?? 'Tool Registry'}`,
      '',
      `> ${desc.meta.name} v${desc.meta.version}`,
      '',
      `**Total Tools:** ${data.total}`,
      '',
    ];

    for (const [category, tools] of Object.entries(byCategory)) {
      const icon = categoryIcons[category] ?? '📦';
      lines.push(`## ${icon} ${category} (${tools.length})`);
      lines.push('');

      for (const tool of tools) {
        lines.push(`### ${tool.name}`);
        lines.push('');
        lines.push(`- **Slug:** \`${tool.slug}\``);
        lines.push(`- **Version:** ${tool.version}`);
        lines.push(`- **Status:** ${tool.status}`);
        lines.push(`- **Description:** ${tool.description}`);
        lines.push('');
      }
    }

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};

