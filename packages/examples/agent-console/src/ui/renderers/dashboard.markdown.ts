/**
 * Markdown Renderer for Agent Console Dashboard
 *
 * Provides a comprehensive overview of agents, runs, and tools.
 */

import {
	type AgentConsoleDashboardData,
	getFallbackAgentConsoleDashboardData,
} from '@contractspec/example.agent-console/shared';
import type { PresentationSpec } from '@contractspec/lib.contracts-spec/presentations';
import type { PresentationRenderer } from '@contractspec/lib.presentation-runtime-core/transform-engine';
import { createAgentVisualizationItems } from '../../visualizations';

function formatDuration(ms: number): string {
	if (ms < 1000) return `${ms}ms`;
	if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
	return `${(ms / 60000).toFixed(1)}m`;
}

/**
 * Markdown renderer for agent-console.dashboard presentation
 * Only handles AgentConsoleDashboard component
 */
export const agentDashboardMarkdownRenderer: PresentationRenderer<{
	mimeType: string;
	body: string;
}> = {
	target: 'markdown',
	render: async (desc: PresentationSpec, ctx) => {
		// Only handle AgentConsoleDashboard
		if (
			desc.source.type !== 'component' ||
			desc.source.componentKey !== 'AgentConsoleDashboard'
		) {
			throw new Error(
				'agentDashboardMarkdownRenderer: not AgentConsoleDashboard'
			);
		}

		const data =
			(ctx?.data as AgentConsoleDashboardData | undefined) ??
			(await getFallbackAgentConsoleDashboardData());

		// Calculate stats
		const activeAgents = data.agents.filter(
			(a) => a.status === 'ACTIVE'
		).length;
		const completedRuns = data.runs.filter(
			(r) => r.status === 'COMPLETED'
		).length;
		const failedRuns = data.runs.filter((r) => r.status === 'FAILED').length;
		const totalTokens = data.runs.reduce(
			(sum, r) => sum + (r.totalTokens ?? 0),
			0
		);
		const totalCost = data.runs.reduce(
			(sum, r) => sum + (r.estimatedCostUsd ?? 0),
			0
		);
		const activeTools = data.tools.filter((t) => t.status === 'ACTIVE').length;
		const visualizationItems = createAgentVisualizationItems(data.runs);

		// Build dashboard markdown
		const lines: string[] = [
			'# Agent Console Dashboard',
			'',
			'> AI agent operations overview',
			'',
			'## Summary',
			'',
			'| Metric | Value |',
			'|--------|-------|',
			`| Total Agents | ${data.summary.totalAgents} |`,
			`| Active Agents | ${activeAgents} |`,
			`| Total Runs | ${data.summary.totalRuns} |`,
			`| Completed Runs | ${completedRuns} |`,
			`| Failed Runs | ${failedRuns} |`,
			`| Total Tokens | ${totalTokens.toLocaleString()} |`,
			`| Total Cost | $${totalCost.toFixed(4)} |`,
			`| Total Tools | ${data.summary.totalTools} |`,
			`| Active Tools | ${activeTools} |`,
			'',
			'## Agents',
			'',
		];

		// Agent list
		if (data.agents.length === 0) {
			lines.push('_No agents configured._');
		} else {
			lines.push('| Agent | Model | Status | Description |');
			lines.push('|-------|-------|--------|-------------|');
			for (const agent of data.agents.slice(0, 5)) {
				lines.push(
					`| ${agent.name} | ${agent.modelProvider}/${agent.modelName} | ${agent.status} | ${agent.description ?? '-'} |`
				);
			}
			if (data.agents.length > 5) {
				lines.push(
					`| ... | ... | ... | _${data.summary.totalAgents - 5} more_ |`
				);
			}
		}

		lines.push('');
		lines.push('## Recent Runs');
		lines.push('');

		// Recent runs
		if (data.runs.length === 0) {
			lines.push('_No runs yet._');
		} else {
			lines.push('| Run ID | Agent | Status | Duration | Tokens | Cost |');
			lines.push('|--------|-------|--------|----------|--------|------|');
			for (const run of data.runs.slice(0, 5)) {
				lines.push(
					`| ${run.id.slice(-8)} | ${run.agentName} | ${run.status} | ${run.durationMs ? formatDuration(run.durationMs) : '-'} | ${run.totalTokens ?? 0} | $${(run.estimatedCostUsd ?? 0).toFixed(4)} |`
				);
			}
			if (data.runs.length > 5) {
				lines.push(
					`| ... | ... | ... | ... | ... | _${data.summary.totalRuns - 5} more_ |`
				);
			}
		}

		lines.push('');
		lines.push('## Visualization Overview');
		lines.push('');
		for (const item of visualizationItems) {
			lines.push(`- **${item.title}** via \`${item.spec.meta.key}\``);
		}

		lines.push('');
		lines.push('## Tools');
		lines.push('');

		// Tool categories
		const toolsByCategory: Record<string, typeof data.tools> = {};
		for (const tool of data.tools) {
			const cat = tool.category;
			if (!toolsByCategory[cat]) toolsByCategory[cat] = [];
			toolsByCategory[cat].push(tool);
		}

		if (Object.keys(toolsByCategory).length === 0) {
			lines.push('_No tools registered._');
		} else {
			lines.push('| Category | Tools | Active |');
			lines.push('|----------|-------|--------|');
			for (const [category, tools] of Object.entries(toolsByCategory).sort()) {
				const active = tools.filter((t) => t.status === 'ACTIVE').length;
				lines.push(`| ${category} | ${tools.length} | ${active} |`);
			}
		}

		return {
			mimeType: 'text/markdown',
			body: lines.join('\n'),
		};
	},
};
