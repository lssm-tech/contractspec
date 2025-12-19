'use client';

import { cn } from '@lssm/lib.ui-kit-web/ui/utils';
import type { LearningJourneyStepSpec } from '@lssm/module.learning-journey/track-spec';

interface TipFeedItem {
  step: LearningJourneyStepSpec;
  isCompleted: boolean;
  completedAt?: string;
}

interface TipFeedProps {
  items: TipFeedItem[];
}

const TIP_ICONS: Record<string, string> = {
  cash_buffer_too_high: '💰',
  no_savings_goal: '🎯',
  irregular_savings: '📅',
  noise_late_evening: '🔇',
  guest_frequency_high: '👥',
  shared_space_conflicts: '🏠',
  default: '💡',
};

export function TipFeed({ items }: TipFeedProps) {
  if (items.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        No tips yet. Start engaging with coaching tips!
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="bg-border absolute top-0 left-4 h-full w-0.5" />

      {/* Feed items */}
      <div className="space-y-4">
        {items.map((item) => {
          const tipId = (item.step.metadata?.tipId as string) ?? 'default';
          const icon = TIP_ICONS[tipId] ?? TIP_ICONS.default;

          return (
            <div key={item.step.id} className="relative flex gap-4 pl-2">
              {/* Node */}
              <div
                className={cn(
                  'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm',
                  item.isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {item.isCompleted ? '✓' : icon}
              </div>

              {/* Content */}
              <div className="bg-card flex-1 rounded-lg border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{item.step.title}</p>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                      {item.step.description}
                    </p>
                  </div>
                  {item.step.xpReward && (
                    <span
                      className={cn(
                        'shrink-0 text-xs font-medium',
                        item.isCompleted
                          ? 'text-green-500'
                          : 'text-muted-foreground'
                      )}
                    >
                      +{item.step.xpReward} XP
                    </span>
                  )}
                </div>

                {/* Timestamp */}
                <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
                  {item.isCompleted ? (
                    <span className="text-green-500">
                      ✓ Completed
                      {item.completedAt && ` • ${item.completedAt}`}
                    </span>
                  ) : (
                    <span>Pending action</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
