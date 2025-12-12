'use client';

import { TipCard } from '../components/TipCard';
import type { LearningViewProps } from '@lssm/example.learning-journey-ui-shared';

export function Steps({ track, progress, onStepComplete }: LearningViewProps) {
  const completedSteps = progress.completedStepIds.length;
  const totalSteps = track.steps.length;

  // Sort: pending first, then completed
  const sortedSteps = [...track.steps].sort((a, b) => {
    const aCompleted = progress.completedStepIds.includes(a.id);
    const bCompleted = progress.completedStepIds.includes(b.id);
    if (aCompleted === bCompleted) return 0;
    return aCompleted ? 1 : -1;
  });

  const currentStepId = track.steps.find(
    (s) => !progress.completedStepIds.includes(s.id)
  )?.id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold">Coaching Tips</h2>
        <p className="text-muted-foreground">
          Review and take action on personalized tips
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          {completedSteps} of {totalSteps} tips actioned
        </p>
      </div>

      {/* Tips Stack */}
      <div className="space-y-3">
        {sortedSteps.map((step) => {
          const isCompleted = progress.completedStepIds.includes(step.id);
          const isCurrent = step.id === currentStepId;

          return (
            <TipCard
              key={step.id}
              step={step}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              onComplete={() => onStepComplete?.(step.id)}
              onDismiss={() => onStepComplete?.(step.id)} // Dismiss also completes
            />
          );
        })}
      </div>

      {/* All done */}
      {completedSteps === totalSteps && (
        <div className="text-muted-foreground text-center">
          <span className="text-2xl">✨</span>
          <p className="mt-2">All tips have been addressed!</p>
        </div>
      )}
    </div>
  );
}

