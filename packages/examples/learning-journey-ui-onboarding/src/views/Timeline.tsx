'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@lssm/lib.ui-kit-web/ui/card';
import { JourneyMap } from '../components/JourneyMap';
import type { LearningViewProps } from '@lssm/example.learning-journey-ui-shared';

export function Timeline({ track, progress }: LearningViewProps) {
  // Find current step
  const currentStepId =
    track.steps.find((s) => !progress.completedStepIds.includes(s.id))?.id ??
    null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold">Your Learning Journey</h2>
        <p className="text-muted-foreground">
          Follow the path through each surface and feature
        </p>
      </div>

      {/* Journey Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🗺️</span>
            <span>Journey Map</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <JourneyMap
            steps={track.steps}
            completedStepIds={progress.completedStepIds}
            currentStepId={currentStepId}
          />
        </CardContent>
      </Card>

      {/* Detailed Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📍</span>
            <span>Step by Step</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Vertical line */}
            <div className="bg-border absolute top-0 left-4 h-full w-0.5" />

            {/* Steps */}
            <div className="space-y-6">
              {track.steps.map((step, index) => {
                const isCompleted = progress.completedStepIds.includes(step.id);
                const isCurrent = step.id === currentStepId;
                const surface = (step.metadata?.surface as string) ?? 'general';

                return (
                  <div key={step.id} className="relative flex gap-4 pl-2">
                    {/* Node */}
                    <div
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                        isCompleted
                          ? 'border-green-500 bg-green-500 text-white'
                          : isCurrent
                            ? 'border-blue-500 bg-blue-500 text-white ring-4 ring-blue-500/20'
                            : 'border-border bg-background text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <div className="rounded-lg border p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4
                                className={`font-semibold ${
                                  isCompleted
                                    ? 'text-green-500'
                                    : isCurrent
                                      ? 'text-blue-500'
                                      : 'text-foreground'
                                }`}
                              >
                                {step.title}
                              </h4>
                              <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
                                {surface}
                              </span>
                            </div>
                            <p className="text-muted-foreground mt-1 text-sm">
                              {step.description}
                            </p>
                          </div>
                          {step.xpReward && (
                            <span
                              className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
                                isCompleted
                                  ? 'bg-green-500/10 text-green-500'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              +{step.xpReward} XP
                            </span>
                          )}
                        </div>

                        {/* Status */}
                        <div className="mt-3 text-xs">
                          {isCompleted ? (
                            <span className="text-green-500">✓ Completed</span>
                          ) : isCurrent ? (
                            <span className="text-blue-500">→ In Progress</span>
                          ) : (
                            <span className="text-muted-foreground">
                              ○ Not Started
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
