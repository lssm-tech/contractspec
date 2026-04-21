import { MOCK_AGENTS } from '../shared/mock-agents';
import { MOCK_RUNS } from '../shared/mock-runs';
import { MOCK_TOOLS } from '../shared/mock-tools';

export type AgentConsolePreviewAgent = (typeof MOCK_AGENTS)[number];
export type AgentConsolePreviewRun = (typeof MOCK_RUNS)[number];
export type AgentConsolePreviewTool = (typeof MOCK_TOOLS)[number];
export type AgentConsolePreviewTab = 'runs' | 'agents' | 'tools' | 'metrics';

export const AGENT_CONSOLE_PREVIEW_TABS: readonly {
	id: AgentConsolePreviewTab;
	label: string;
	icon: string;
}[] = [
	{ id: 'runs', label: 'Runs', icon: '▶' },
	{ id: 'agents', label: 'Agents', icon: '🤖' },
	{ id: 'tools', label: 'Tools', icon: '🔧' },
	{ id: 'metrics', label: 'Metrics', icon: '📊' },
];

export function createAgentConsolePreviewMetrics(
	runs: readonly AgentConsolePreviewRun[]
) {
	const completedRuns = runs.filter((run) => run.status === 'COMPLETED').length;
	const totalTokens = runs.reduce((sum, run) => sum + run.totalTokens, 0);
	const totalCostUsd = runs.reduce(
		(sum, run) => sum + (run.estimatedCostUsd ?? 0),
		0
	);
	const durations = runs
		.map((run) => run.durationMs)
		.filter((duration): duration is number => typeof duration === 'number');

	return {
		averageDurationMs:
			durations.length > 0
				? durations.reduce((sum, duration) => sum + duration, 0) /
					durations.length
				: 0,
		completedRuns,
		successRate: runs.length > 0 ? completedRuns / runs.length : 0,
		totalCostUsd,
		totalRuns: runs.length,
		totalTokens,
	};
}

export function formatAgentConsoleTokens(tokens: number): string {
	if (tokens < 1000) return tokens.toString();
	if (tokens < 1_000_000) return `${(tokens / 1000).toFixed(1)}K`;
	return `${(tokens / 1_000_000).toFixed(2)}M`;
}

export function formatAgentConsoleDuration(ms?: number): string {
	if (!ms) return '-';
	if (ms < 1000) return `${ms}ms`;
	if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
	return `${(ms / 60_000).toFixed(1)}m`;
}

export function formatAgentConsoleDate(value: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(value);
}

export function getAgentConsolePressProps(handler: () => void) {
	if (typeof document === 'undefined') {
		return { onPress: handler };
	}

	return { onClick: handler };
}
