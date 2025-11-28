'use client';

/**
 * CRM Pipeline Board - Kanban-style deal board
 */
import type { Deal } from '@lssm/example.crm-pipeline/handlers';
import { CrmDealCard } from './CrmDealCard';

interface CrmPipelineBoardProps {
  dealsByStage: Record<string, Deal[]>;
  stages: Array<{ id: string; name: string; position: number }>;
  onDealClick?: (dealId: string) => void;
  onDealMove?: (dealId: string, toStageId: string) => void;
}

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

export function CrmPipelineBoard({
  dealsByStage,
  stages,
  onDealClick,
}: CrmPipelineBoardProps) {
  // Sort stages by position
  const sortedStages = [...stages].sort((a, b) => a.position - b.position);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {sortedStages.map((stage) => {
        const deals = dealsByStage[stage.id] ?? [];
        const stageValue = deals.reduce((sum, d) => sum + d.value, 0);

        return (
          <div
            key={stage.id}
            className="flex w-72 flex-shrink-0 flex-col rounded-lg bg-muted/30"
          >
            {/* Stage Header */}
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <div>
                <h3 className="font-medium">{stage.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {deals.length} deals · {formatCurrency(stageValue)}
                </p>
              </div>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {deals.length}
              </span>
            </div>

            {/* Deals Column */}
            <div className="flex flex-1 flex-col gap-2 p-2">
              {deals.length === 0 ? (
                <div className="flex h-24 items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/20 text-xs text-muted-foreground">
                  No deals
                </div>
              ) : (
                deals.map((deal) => (
                  <CrmDealCard
                    key={deal.id}
                    deal={deal}
                    onClick={() => onDealClick?.(deal.id)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
