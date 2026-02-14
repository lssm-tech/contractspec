/**
 * Markdown Renderer for Run List Presentation
 *
 * Uses dynamic import for handlers to ensure correct build order.
 */
import type { PresentationSpec } from '@contractspec/lib.contracts-spec/presentations';
import type { PresentationRenderer } from '@contractspec/lib.contracts-spec/presentations/transform-engine';
import type { Run } from '../hooks/useRunList';
import { mockListRunsHandler } from '@contractspec/example.agent-console/handlers';

interface RunListOutput {
  items: Run[];
  total: number;
  hasMore: boolean;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

/**
 * Markdown renderer for agent-console.run.list presentation
 * Only handles RunListView component
 */
export const runListMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc: PresentationSpec) => {
    // Only handle RunListView
    if (
      desc.source.type !== 'component' ||
      desc.source.componentKey !== 'RunListView'
    ) {
      throw new Error('runListMarkdownRenderer: not RunListView');
    }

    // Fetch data using mock handler
    const data = (await mockListRunsHandler({
      organizationId: 'demo-org',
      limit: 20,
      offset: 0,
    })) as RunListOutput;

    // Generate markdown
    const lines: string[] = [
      `# ${desc.meta.description ?? 'Agent Runs'}`,
      '',
      `> ${desc.meta.key} v${desc.meta.version}`,
      '',
      `**Total Runs:** ${data.total}`,
      '',
      '## Recent Runs',
      '',
      '| ID | Agent | Status | Duration | Tokens | Cost |',
      '| --- | --- | --- | --- | --- | --- |',
    ];

    for (const run of data.items.slice(0, 10)) {
      lines.push(
        `| ${run.id.slice(-8)} | ${run.agentName} | ${run.status} | ${run.durationMs ? formatDuration(run.durationMs) : '-'} | ${run.totalTokens} | $${run.estimatedCostUsd?.toFixed(4) ?? '-'} |`
      );
    }

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};
