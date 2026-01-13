'use client';

/**
 * CRM Pipeline Board - Kanban-style deal board
 *
 * Features:
 * - Visual pipeline stages
 * - Deal cards with click actions
 * - Quick move dropdown per card
 * - Drag-and-drop ready (UI only, no lib dependency)
 */
import { useState } from 'react';
// import { Button } from '@contractspec/lib.design-system';
import type { Deal } from './hooks/useDealList';
import { CrmDealCard } from './CrmDealCard';

interface CrmPipelineBoardProps {
  dealsByStage: Record<string, Deal[]>;
  stages: { id: string; name: string; position: number }[];
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
  onDealMove,
}: CrmPipelineBoardProps) {
  // Track which deal has the quick-move dropdown open
  const [quickMoveOpen, setQuickMoveOpen] = useState<string | null>(null);

  // Sort stages by position
  const sortedStages = [...stages].sort((a, b) => a.position - b.position);

  const handleQuickMove = (dealId: string, toStageId: string) => {
    onDealMove?.(dealId, toStageId);
    setQuickMoveOpen(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {sortedStages.map((stage) => {
        const deals = dealsByStage[stage.id] ?? [];
        const stageValue = deals.reduce((sum, d) => sum + d.value, 0);

        return (
          <div
            key={stage.id}
            className="bg-muted/30 flex w-72 flex-shrink-0 flex-col rounded-lg"
          >
            {/* Stage Header */}
            <div className="border-border flex items-center justify-between border-b px-3 py-2">
              <div>
                <h3 className="font-medium">{stage.name}</h3>
                <p className="text-muted-foreground text-xs">
                  {deals.length} deals · {formatCurrency(stageValue)}
                </p>
              </div>
              <span className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium">
                {deals.length}
              </span>
            </div>

            {/* Deals Column */}
            <div className="flex flex-1 flex-col gap-2 p-2">
              {deals.length === 0 ? (
                <div className="border-muted-foreground/20 text-muted-foreground flex h-24 items-center justify-center rounded-md border-2 border-dashed text-xs">
                  No deals
                </div>
              ) : (
                deals.map((deal) => (
                  <div key={deal.id} className="group relative">
                    <CrmDealCard
                      deal={deal}
                      onClick={() => onDealClick?.(deal.id)}
                    />

                    {/* Quick Move Button */}
                    {deal.status === 'OPEN' && onDealMove && (
                      <div className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickMoveOpen(
                              quickMoveOpen === deal.id ? null : deal.id
                            );
                          }}
                          className="bg-background border-border hover:bg-muted flex h-6 w-6 items-center justify-center rounded border text-xs shadow-sm"
                          title="Quick move"
                        >
                          ➡️
                        </button>

                        {/* Quick Move Dropdown */}
                        {quickMoveOpen === deal.id && (
                          <div className="bg-card border-border absolute top-7 right-0 z-20 min-w-[140px] rounded-lg border py-1 shadow-lg">
                            <p className="text-muted-foreground px-3 py-1 text-xs font-medium">
                              Move to:
                            </p>
                            {sortedStages
                              .filter((s) => s.id !== deal.stageId)
                              .map((s) => (
                                <button
                                  key={s.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuickMove(deal.id, s.id);
                                  }}
                                  className="hover:bg-muted w-full px-3 py-1.5 text-left text-sm"
                                >
                                  {s.name}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
