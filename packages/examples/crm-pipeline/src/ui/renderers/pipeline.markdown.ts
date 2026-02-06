/**
 * Markdown renderer for CRM Pipeline presentation
 *
 * Imports handlers from the hooks module to ensure correct build order.
 */
import type { PresentationRenderer } from '@contractspec/lib.contracts';
import {
  mockListDealsHandler,
  mockGetPipelineStagesHandler,
} from '../../handlers';

interface DealItem {
  id: string;
  name: string;
  value: number;
  currency: string;
  stageId: string;
  status: string;
}

interface StageItem {
  id: string;
  name: string;
  position: number;
}

function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value);
}

/**
 * Markdown renderer for CRM Pipeline Kanban view (crm-pipeline.deal.pipeline)
 * Only handles PipelineKanbanView component
 */
export const crmPipelineMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc, _ctx) => {
    // Only handle PipelineKanbanView
    if (
      desc.source.type !== 'component' ||
      desc.source.componentKey !== 'PipelineKanbanView'
    ) {
      throw new Error('crmPipelineMarkdownRenderer: not PipelineKanbanView');
    }

    const pipelineId = 'pipeline-1';
    const [dealsResult, stages] = await Promise.all([
      mockListDealsHandler({ pipelineId, limit: 50 }),
      mockGetPipelineStagesHandler({ pipelineId }),
    ]);

    const deals = dealsResult.deals as DealItem[];
    const stageList = stages as StageItem[];

    // Group deals by stage
    const dealsByStage: Record<string, DealItem[]> = {};
    for (const stage of stageList) {
      dealsByStage[stage.id] = deals.filter(
        (d) => d.stageId === stage.id && d.status === 'OPEN'
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

    for (const stage of stageList.sort((a, b) => a.position - b.position)) {
      const stageDeals = dealsByStage[stage.id] ?? [];
      const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

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

/**
 * Markdown renderer for CRM Dashboard (crm-pipeline.dashboard)
 * Only handles CrmDashboard component
 */
export const crmDashboardMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc, _ctx) => {
    // Only handle CrmDashboard
    if (
      desc.source.type !== 'component' ||
      desc.source.componentKey !== 'CrmDashboard'
    ) {
      throw new Error('crmDashboardMarkdownRenderer: not CrmDashboard');
    }

    const pipelineId = 'pipeline-1';
    const [dealsResult, stages] = await Promise.all([
      mockListDealsHandler({ pipelineId, limit: 100 }),
      mockGetPipelineStagesHandler({ pipelineId }),
    ]);

    const deals = dealsResult.deals as DealItem[];
    const stageList = stages as StageItem[];

    // Calculate stats
    const openDeals = deals.filter((d) => d.status === 'OPEN');
    const wonDeals = deals.filter((d) => d.status === 'WON');
    const lostDeals = deals.filter((d) => d.status === 'LOST');
    const openValue = openDeals.reduce((sum, d) => sum + d.value, 0);
    const wonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);

    // Build dashboard markdown
    const lines: string[] = [
      '# CRM Dashboard',
      '',
      '> Sales pipeline overview and key metrics',
      '',
      '## Summary',
      '',
      '| Metric | Value |',
      '|--------|-------|',
      `| Total Deals | ${dealsResult.total} |`,
      `| Pipeline Value | ${formatCurrency(dealsResult.totalValue)} |`,
      `| Open Deals | ${openDeals.length} (${formatCurrency(openValue)}) |`,
      `| Won Deals | ${wonDeals.length} (${formatCurrency(wonValue)}) |`,
      `| Lost Deals | ${lostDeals.length} |`,
      '',
      '## Pipeline Stages',
      '',
    ];

    // Stage summary table
    lines.push('| Stage | Deals | Value |');
    lines.push('|-------|-------|-------|');
    for (const stage of stageList.sort((a, b) => a.position - b.position)) {
      const stageDeals = openDeals.filter((d) => d.stageId === stage.id);
      const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
      lines.push(
        `| ${stage.name} | ${stageDeals.length} | ${formatCurrency(stageValue)} |`
      );
    }

    lines.push('');
    lines.push('## Recent Deals');
    lines.push('');

    // Top 10 recent deals
    const recentDeals = deals.slice(0, 10);
    if (recentDeals.length === 0) {
      lines.push('_No deals yet._');
    } else {
      lines.push('| Deal | Value | Stage | Status |');
      lines.push('|------|-------|-------|--------|');
      for (const deal of recentDeals) {
        const stage = stageList.find((s) => s.id === deal.stageId);
        lines.push(
          `| ${deal.name} | ${formatCurrency(deal.value, deal.currency)} | ${stage?.name ?? '-'} | ${deal.status} |`
        );
      }
    }

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};
