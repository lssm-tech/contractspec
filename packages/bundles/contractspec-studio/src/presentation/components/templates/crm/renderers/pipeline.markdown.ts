/**
 * Markdown renderer for CRM Pipeline presentation
 *
 * Imports handlers from the hooks module to ensure correct build order.
 */
import type { PresentationRenderer } from '@lssm/lib.contracts';
import type { Deal } from '../hooks/useDealList';
import {
  mockListDealsHandler,
  mockGetPipelineStagesHandler,
} from '@lssm/example.crm-pipeline/handlers';

function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value);
}

export const crmPipelineMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc, ctx) => {
    const pipelineId = 'pipeline-1';
    const [dealsResult, stages] = await Promise.all([
      mockListDealsHandler({ pipelineId, limit: 50 }),
      mockGetPipelineStagesHandler({ pipelineId }),
    ]);

    // Group deals by stage
    const dealsByStage: Record<string, Deal[]> = {};
    for (const stage of stages) {
      dealsByStage[stage.id] = dealsResult.deals.filter(
        (d: Deal) => d.stageId === stage.id && d.status === 'OPEN'
      );
    }

    // Build Markdown
    const lines: string[] = [
      '# CRM Pipeline',
      '',
      `**Total Value**: ${formatCurrency(dealsResult.totalValue)}`,
      `**Total Deals**: ${dealsResult.total}`,
      '',
    ];

    for (const stage of stages.sort(
      (a: { position: number }, b: { position: number }) =>
        a.position - b.position
    )) {
      const stageDeals = dealsByStage[stage.id] ?? [];
      const stageValue = stageDeals.reduce((sum, d: Deal) => sum + d.value, 0);

      lines.push(`## ${stage.name}`);
      lines.push(
        `_${stageDeals.length} deals · ${formatCurrency(stageValue)}_`
      );
      lines.push('');

      if (stageDeals.length === 0) {
        lines.push('_No deals_');
      } else {
        for (const deal of stageDeals) {
          lines.push(
            `- **${deal.name}** - ${formatCurrency(deal.value, deal.currency)}`
          );
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
