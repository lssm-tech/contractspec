'use client';

import { cn } from '@lssm/lib.ui-kit-web/ui/utils';
import type { LearningJourneyStepSpec } from '@lssm/module.learning-journey/track-spec';

interface JourneyMapProps {
  steps: LearningJourneyStepSpec[];
  completedStepIds: string[];
  currentStepId?: string | null;
}

const SURFACE_ICONS: Record<string, string> = {
  templates: '📋',
  'spec-editor': '✏️',
  regenerator: '🔄',
  playground: '🎮',
  evolution: '🤖',
  dashboard: '📊',
  settings: '⚙️',
  default: '📍',
};

export function JourneyMap({
  steps,
  completedStepIds,
  currentStepId,
}: JourneyMapProps) {
  return (
    <div className="relative overflow-x-auto pb-4">
      <div className="flex min-w-max items-center gap-2">
        {steps.map((step, index) => {
          const isCompleted = completedStepIds.includes(step.id);
          const isCurrent = step.id === currentStepId;
          const surface = (step.metadata?.surface as string) ?? 'default';
          const icon = SURFACE_ICONS[surface] ?? SURFACE_ICONS.default;

          return (
            <div key={step.id} className="flex items-center">
              {/* Node */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'flex h-14 w-14 items-center justify-center rounded-2xl border-2 text-2xl transition-all',
                    isCompleted && 'border-green-500 bg-green-500/10',
                    isCurrent &&
                      !isCompleted &&
                      'border-violet-500 bg-violet-500/10 ring-4 ring-violet-500/20',
                    !isCompleted && !isCurrent && 'border-muted bg-muted/50'
                  )}
                >
                  {isCompleted ? '✓' : icon}
                </div>
                <div className="text-center">
                  <p
                    className={cn(
                      'max-w-[100px] truncate text-xs font-medium',
                      isCompleted && 'text-green-500',
                      isCurrent && !isCompleted && 'text-violet-500',
                      !isCompleted && !isCurrent && 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </p>
                </div>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-2 h-1 w-8 rounded-full transition-colors',
                    completedStepIds.includes(steps[index + 1]?.id ?? '')
                      ? 'bg-green-500'
                      : isCompleted
                        ? 'bg-green-500/50'
                        : 'bg-muted'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

