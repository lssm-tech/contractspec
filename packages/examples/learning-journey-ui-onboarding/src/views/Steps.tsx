'use client';

import { useState } from 'react';
import { Progress } from '@contractspec/lib.ui-kit-web/ui/progress';
import { StepChecklist } from '../components/StepChecklist';
import type { LearningViewProps } from '@contractspec/example.learning-journey-ui-shared';

export function Steps({ track, progress, onStepComplete }: LearningViewProps) {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(() => {
    // Auto-expand first incomplete step
    const firstIncomplete = track.steps.find(
      (s) => !progress.completedStepIds.includes(s.id)
    );
    return firstIncomplete?.id ?? null;
  });

  const completedSteps = progress.completedStepIds.length;
  const totalSteps = track.steps.length;
  const percentComplete =
    totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const currentStepIndex = track.steps.findIndex(
    (s) => !progress.completedStepIds.includes(s.id)
  );

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Complete Each Step</h2>
          <span className="text-muted-foreground text-sm">
            {completedSteps} / {totalSteps} completed
          </span>
        </div>
        <Progress value={percentComplete} className="h-2" />
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {track.steps.map((step, index) => {
          const isCompleted = progress.completedStepIds.includes(step.id);
          const isCurrent = index === currentStepIndex;

          return (
            <StepChecklist
              key={step.id}
              step={step}
              stepNumber={index + 1}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              isExpanded={expandedStepId === step.id}
              onToggle={() =>
                setExpandedStepId(expandedStepId === step.id ? null : step.id)
              }
              onComplete={() => {
                onStepComplete?.(step.id);
                // Auto-expand next step
                const nextStep = track.steps[index + 1];
                if (
                  nextStep &&
                  !progress.completedStepIds.includes(nextStep.id)
                ) {
                  setExpandedStepId(nextStep.id);
                }
              }}
            />
          );
        })}
      </div>

      {/* Completion rewards hint */}
      {track.completionRewards && percentComplete < 100 && (
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
          <p className="text-sm">
            🎁 Complete all steps to unlock:
            {track.completionRewards.xpBonus && (
              <span className="ml-2 font-semibold text-blue-500">
                +{track.completionRewards.xpBonus} XP bonus
              </span>
            )}
            {track.completionRewards.badgeKey && (
              <span className="ml-2 font-semibold text-amber-500">
                + "{track.completionRewards.badgeKey}" badge
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
