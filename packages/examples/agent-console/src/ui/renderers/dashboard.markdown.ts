/**
 * Markdown Renderer for Agent Console Dashboard
 *
 * Provides a comprehensive overview of agents, runs, and tools.
 */
import type { PresentationSpec } from '@contractspec/lib.contracts/presentations';
import type { PresentationRenderer } from '@contractspec/lib.contracts/presentations/transform-engine';
import {
  mockListAgentsHandler,
  mockListRunsHandler,
  mockListToolsHandler,
} from '@contractspec/example.agent-console/handlers';

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
  render: async (desc: PresentationSpec) => {
    // Only handle AgentConsoleDashboard
    if (
      desc.source.type !== 'component' ||
      desc.source.componentKey !== 'AgentConsoleDashboard'
    ) {
      throw new Error(
        'agentDashboardMarkdownRenderer: not AgentConsoleDashboard'
      );
    }

    // Fetch all data in parallel
    const [agentsData, runsData, toolsData] = await Promise.all([
      mockListAgentsHandler({
        organizationId: 'demo-org',
        limit: 100,
      }),
      mockListRunsHandler({
        limit: 100,
      }),
      mockListToolsHandler({
        organizationId: 'demo-org',
        limit: 100,
      }),
    ]);

    // Calculate stats
    const activeAgents = agentsData.items.filter(
      (a) => a.status === 'ACTIVE'
    ).length;
    const completedRuns = runsData.items.filter(
      (r) => r.status === 'COMPLETED'
    ).length;
    const failedRuns = runsData.items.filter(
      (r) => r.status === 'FAILED'
    ).length;
    const totalTokens = runsData.items.reduce(
      (sum, r) => sum + (r.totalTokens ?? 0),
      0
    );
    const totalCost = runsData.items.reduce(
      (sum, r) => sum + (r.estimatedCostUsd ?? 0),
      0
    );
    const activeTools = toolsData.items.filter(
      (t) => t.status === 'ACTIVE'
    ).length;

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
      `| Total Agents | ${agentsData.total} |`,
      `| Active Agents | ${activeAgents} |`,
      `| Total Runs | ${runsData.total} |`,
      `| Completed Runs | ${completedRuns} |`,
      `| Failed Runs | ${failedRuns} |`,
      `| Total Tokens | ${totalTokens.toLocaleString()} |`,
      `| Total Cost | $${totalCost.toFixed(4)} |`,
      `| Total Tools | ${toolsData.total} |`,
      `| Active Tools | ${activeTools} |`,
      '',
      '## Agents',
      '',
    ];

    // Agent list
    if (agentsData.items.length === 0) {
      lines.push('_No agents configured._');
    } else {
      lines.push('| Agent | Model | Status | Description |');
      lines.push('|-------|-------|--------|-------------|');
      for (const agent of agentsData.items.slice(0, 5)) {
        lines.push(
          `| ${agent.name} | ${agent.modelProvider}/${agent.modelName} | ${agent.status} | ${agent.description ?? '-'} |`
        );
      }
      if (agentsData.items.length > 5) {
        lines.push(`| ... | ... | ... | _${agentsData.total - 5} more_ |`);
      }
    }

    lines.push('');
    lines.push('## Recent Runs');
    lines.push('');

    // Recent runs
    if (runsData.items.length === 0) {
      lines.push('_No runs yet._');
    } else {
      lines.push('| Run ID | Agent | Status | Duration | Tokens | Cost |');
      lines.push('|--------|-------|--------|----------|--------|------|');
      for (const run of runsData.items.slice(0, 5)) {
        lines.push(
          `| ${run.id.slice(-8)} | ${run.agentName} | ${run.status} | ${run.durationMs ? formatDuration(run.durationMs) : '-'} | ${run.totalTokens ?? 0} | $${(run.estimatedCostUsd ?? 0).toFixed(4)} |`
        );
      }
      if (runsData.items.length > 5) {
        lines.push(
          `| ... | ... | ... | ... | ... | _${runsData.total - 5} more_ |`
        );
      }
    }

    lines.push('');
    lines.push('## Tools');
    lines.push('');

    // Tool categories
    const toolsByCategory: Record<string, typeof toolsData.items> = {};
    for (const tool of toolsData.items) {
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
