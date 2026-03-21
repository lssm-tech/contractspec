/**
 * Markdown Renderer for Tool Registry Presentation
 *
 * Uses dynamic import for handlers to ensure correct build order.
 */

import {
	AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
	AGENT_CONSOLE_DEMO_PROJECT_ID,
	createAgentConsoleDemoHandlers,
} from '@contractspec/example.agent-console/shared';
import type { PresentationSpec } from '@contractspec/lib.contracts-spec/presentations';
import type { PresentationRenderer } from '@contractspec/lib.presentation-runtime-core/transform-engine';

interface ToolItem {
	id: string;
	name: string;
	description?: string;
	version: string;
	category: string;
	status: string;
}

/**
 * Markdown renderer for agent-console.tool.list presentation
 * Only handles ToolRegistryView component
 */
export const toolRegistryMarkdownRenderer: PresentationRenderer<{
	mimeType: string;
	body: string;
}> = {
	target: 'markdown',
	render: async (desc: PresentationSpec, ctx) => {
		// Only handle ToolRegistryView
		if (
			desc.source.type !== 'component' ||
			desc.source.componentKey !== 'ToolRegistryView'
		) {
			throw new Error('toolRegistryMarkdownRenderer: not ToolRegistryView');
		}

		const data = Array.isArray(ctx?.data)
			? {
					items: ctx.data as ToolItem[],
					total: ctx.data.length,
					hasMore: false,
				}
			: await createAgentConsoleDemoHandlers({
					projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
				}).listTools({
					projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
					organizationId: AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
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
