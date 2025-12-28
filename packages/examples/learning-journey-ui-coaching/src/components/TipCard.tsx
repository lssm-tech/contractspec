'use client';

import { Button } from '@contractspec/lib.design-system';
import { Card, CardContent } from '@contractspec/lib.ui-kit-web/ui/card';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import type { LearningJourneyStepSpec } from '@contractspec/module.learning-journey/track-spec';

interface TipCardProps {
  step: LearningJourneyStepSpec;
  isCompleted: boolean;
  isCurrent: boolean;
  onComplete?: () => void;
  onDismiss?: () => void;
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

export function TipCard({
  step,
  isCompleted,
  isCurrent,
  onComplete,
  onDismiss,
}: TipCardProps) {
  const tipId = (step.metadata?.tipId as string) ?? 'default';
  const icon = TIP_ICONS[tipId] ?? TIP_ICONS.default;

  return (
    <Card
      className={cn(
        'transition-all',
        isCompleted && 'opacity-60',
        isCurrent && 'ring-2 ring-amber-500'
      )}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Icon */}
          <div
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl',
              isCompleted
                ? 'bg-green-500/10'
                : isCurrent
                  ? 'bg-amber-500/10'
                  : 'bg-muted'
            )}
          >
            {isCompleted ? '✓' : icon}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold">{step.title}</h4>
              {step.xpReward && (
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold',
                    isCompleted
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-amber-500/10 text-amber-500'
                  )}
                >
                  +{step.xpReward} XP
                </span>
              )}
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              {step.description}
            </p>

            {/* Actions */}
            {!isCompleted && (
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={onComplete}>
                  Take Action
                </Button>
                <Button variant="outline" size="sm" onClick={onDismiss}>
                  Dismiss
                </Button>
              </div>
            )}

            {isCompleted && (
              <p className="mt-2 text-sm text-green-500">✓ Tip acknowledged</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
