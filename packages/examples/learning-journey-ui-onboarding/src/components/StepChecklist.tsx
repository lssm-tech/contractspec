'use client';

import { Button } from '@lssm/lib.design-system';
import { cn } from '@lssm/lib.ui-kit-core';
import type { LearningJourneyStepSpec } from '@lssm/module.learning-journey/track-spec';

interface StepChecklistProps {
  step: LearningJourneyStepSpec;
  stepNumber: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onComplete?: () => void;
}

export function StepChecklist({
  step,
  stepNumber,
  isCompleted,
  isCurrent,
  isExpanded,
  onToggle,
  onComplete,
}: StepChecklistProps) {
  return (
    <div
      className={cn(
        'rounded-xl border transition-all',
        isCompleted && 'border-green-500/50 bg-green-500/5',
        isCurrent && !isCompleted && 'border-violet-500 bg-violet-500/5',
        !isCompleted && !isCurrent && 'border-border'
      )}
    >
      {/* Header */}
      <button
        type="button"
        className="flex w-full items-center gap-4 p-4 text-left"
        onClick={onToggle}
      >
        {/* Checkbox/Number */}
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
            isCompleted && 'border-green-500 bg-green-500 text-white',
            isCurrent && !isCompleted && 'border-violet-500 text-violet-500',
            !isCompleted &&
              !isCurrent &&
              'border-muted-foreground text-muted-foreground'
          )}
        >
          {isCompleted ? '✓' : stepNumber}
        </div>

        {/* Title & Description */}
        <div className="min-w-0 flex-1">
          <h4
            className={cn(
              'font-semibold',
              isCompleted && 'text-green-500',
              isCurrent && !isCompleted && 'text-foreground',
              !isCompleted && !isCurrent && 'text-muted-foreground'
            )}
          >
            {step.title}
          </h4>
          {!isExpanded && step.description && (
            <p className="text-muted-foreground truncate text-sm">
              {step.description}
            </p>
          )}
        </div>

        {/* XP Badge */}
        {step.xpReward && (
          <span
            className={cn(
              'shrink-0 rounded-full px-2 py-1 text-xs font-semibold',
              isCompleted
                ? 'bg-green-500/10 text-green-500'
                : 'bg-muted text-muted-foreground'
            )}
          >
            +{step.xpReward} XP
          </span>
        )}

        {/* Expand indicator */}
        <span
          className={cn(
            'shrink-0 transition-transform',
            isExpanded && 'rotate-180'
          )}
        >
          ▼
        </span>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t px-4 py-4">
          {step.description && (
            <p className="text-muted-foreground mb-4">{step.description}</p>
          )}

          {step.instructions && (
            <div className="bg-muted mb-4 rounded-lg p-4">
              <p className="mb-2 text-sm font-medium">Instructions:</p>
              <p className="text-muted-foreground text-sm">
                {step.instructions}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {step.actionUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(step.actionUrl, '_blank')}
              >
                {step.actionLabel ?? 'Try it'}
              </Button>
            )}
            {!isCompleted && (
              <Button size="sm" onClick={onComplete}>
                Mark as Complete
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
