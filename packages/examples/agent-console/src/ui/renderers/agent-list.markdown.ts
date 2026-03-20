/**
 * Markdown Renderer for Agent List Presentation
 *
 * Uses handlers from the agent-console example package.
 */

import {
	AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
	AGENT_CONSOLE_DEMO_PROJECT_ID,
	createAgentConsoleDemoHandlers,
} from '@contractspec/example.agent-console/shared';
import type { PresentationSpec } from '@contractspec/lib.contracts-spec/presentations';
import type { PresentationRenderer } from '@contractspec/lib.contracts-spec/presentations/transform-engine';

interface AgentListItem {
	name: string;
	description?: string;
	status: string;
	modelProvider: string;
	modelName: string;
}

/**
 * Markdown renderer for agent-console.agent.list presentation
 * Only handles AgentListView component
 */
export const agentListMarkdownRenderer: PresentationRenderer<{
	mimeType: string;
	body: string;
}> = {
	target: 'markdown',
	render: async (desc: PresentationSpec, ctx) => {
		// Only handle AgentListView
		if (
			desc.source.type !== 'component' ||
			desc.source.componentKey !== 'AgentListView'
		) {
			throw new Error('agentListMarkdownRenderer: not AgentListView');
		}

		const data: {
			items: AgentListItem[];
			total: number;
			hasMore: boolean;
		} = Array.isArray(ctx?.data)
			? {
					items: ctx.data as AgentListItem[],
					total: ctx.data.length,
					hasMore: false,
				}
			: await createAgentConsoleDemoHandlers({
					projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
				}).listAgents({
					projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
					organizationId: AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
					limit: 50,
					offset: 0,
				});

		// Generate markdown
		const lines: string[] = [
			`# ${desc.meta.description ?? 'Agent List'}`,
			'',
			`> ${desc.meta.key} v${desc.meta.version}`,
			'',
			`**Total Agents:** ${data.total}`,
			'',
			'## Agents',
			'',
		];

		// Group by status
		const byStatus: Record<string, AgentListItem[]> = {};
		for (const agent of data.items) {
			const status = agent.status;
			if (byStatus[status]) {
				byStatus[status].push(agent);
			} else {
				byStatus[status] = [agent];
			}
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
