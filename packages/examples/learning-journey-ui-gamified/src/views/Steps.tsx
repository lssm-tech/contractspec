'use client';

import { FlashCard } from '../components/FlashCard';
import type { LearningViewProps } from '@lssm/example.learning-journey-ui-shared';

export function Steps({ track, progress, onStepComplete }: LearningViewProps) {
  const currentStepIndex = track.steps.findIndex(
    (s) => !progress.completedStepIds.includes(s.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold">Complete Your Challenges</h2>
        <p className="text-muted-foreground">
          Tap each card to reveal the action, then mark as complete
        </p>
      </div>

      {/* Card Stack */}
      <div className="grid gap-4 md:grid-cols-2">
        {track.steps.map((step, index) => {
          const isCompleted = progress.completedStepIds.includes(step.id);
          const isCurrent = index === currentStepIndex;

          return (
            <FlashCard
              key={step.id}
              step={step}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              onComplete={() => onStepComplete?.(step.id)}
            />
          );
        })}
      </div>

      {/* Progress Summary */}
      <div className="text-muted-foreground text-center text-sm">
        {progress.completedStepIds.length} of {track.steps.length} completed
        {track.completionRewards?.xpBonus && (
          <span className="ml-2 text-green-500">
            (+{track.completionRewards.xpBonus} XP bonus on completion)
          </span>
        )}
      </div>
    </div>
  );
}
