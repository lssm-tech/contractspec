/**
 * Markdown Renderer for Run List Presentation
 */
import type {
  PresentationRenderer,
  PresentationDescriptorV2,
} from '@lssm/lib.contracts';
import {
  mockListRunsHandler,
  mockGetRunMetricsHandler,
} from '@lssm/example.agent-console/handlers';

/**
 * Markdown renderer for agent-console.run.list presentation
 */
export const runListMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc: PresentationDescriptorV2) => {
    // Fetch data
    const [runsData, metricsData] = await Promise.all([
      mockListRunsHandler({ limit: 50, offset: 0 }),
      mockGetRunMetricsHandler({
        organizationId: 'demo-org',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
        granularity: 'day',
      }),
    ]);

    // Generate markdown
    const lines: string[] = [
      `# ${desc.meta.description ?? 'Agent Runs'}`,
      '',
      `> ${desc.meta.name} v${desc.meta.version}`,
      '',
      '## Summary',
      '',
      `| Metric | Value |`,
      `|--------|-------|`,
      `| Total Runs | ${metricsData.totalRuns} |`,
      `| Completed | ${metricsData.completedRuns} |`,
      `| Failed | ${metricsData.failedRuns} |`,
      `| Success Rate | ${(metricsData.successRate * 100).toFixed(1)}% |`,
      `| Total Tokens | ${(metricsData.totalTokens / 1000).toFixed(0)}K |`,
      `| Total Cost | $${metricsData.totalCostUsd.toFixed(2)} |`,
      '',
      '## Recent Runs',
      '',
      '| Run ID | Agent | Status | Tokens | Duration | Cost |',
      '|--------|-------|--------|--------|----------|------|',
    ];

    for (const run of runsData.items) {
      const durationStr = run.durationMs
        ? run.durationMs < 1000
          ? `${run.durationMs}ms`
          : `${(run.durationMs / 1000).toFixed(1)}s`
        : '-';
      const costStr = run.estimatedCostUsd
        ? `$${run.estimatedCostUsd.toFixed(4)}`
        : '-';

      lines.push(
        `| ${run.id.slice(-8)} | ${run.agentName} | ${run.status} | ${run.totalTokens} | ${durationStr} | ${costStr} |`
      );
    }

    lines.push('');
    lines.push(`*Showing ${runsData.items.length} of ${runsData.total} runs*`);

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};
