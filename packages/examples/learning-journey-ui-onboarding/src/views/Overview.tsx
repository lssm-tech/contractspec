'use client';

import { Button } from '@lssm/lib.design-system';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@lssm/lib.ui-kit-web/ui/card';
import { Progress } from '@lssm/lib.ui-kit-web/ui/progress';
import { XpBar } from '@lssm/example.learning-journey-ui-shared';
import type { LearningViewProps } from '@lssm/example.learning-journey-ui-shared';

interface OnboardingOverviewProps extends LearningViewProps {
  onStart?: () => void;
}

export function Overview({
  track,
  progress,
  onStart,
}: OnboardingOverviewProps) {
  const totalSteps = track.steps.length;
  const completedSteps = progress.completedStepIds.length;
  const percentComplete =
    totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  const isComplete = completedSteps === totalSteps;

  // Estimate time remaining (rough: 5 min per step)
  const remainingSteps = totalSteps - completedSteps;
  const estimatedMinutes = remainingSteps * 5;

  const totalXp =
    track.totalXp ??
    track.steps.reduce((sum, s) => sum + (s.xpReward ?? 0), 0) +
      (track.completionRewards?.xpBonus ?? 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="overflow-hidden bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-purple-500/10">
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-4xl shadow-lg">
              {isComplete ? '🎉' : '🚀'}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{track.name}</h1>
              <p className="text-muted-foreground mt-1 max-w-2xl">
                {track.description}
              </p>
              {!isComplete && (
                <p className="text-muted-foreground mt-3 text-sm">
                  ⏱️ Estimated time:{' '}
                  {estimatedMinutes > 0
                    ? `~${estimatedMinutes} minutes`
                    : 'Less than a minute'}
                </p>
              )}
            </div>
            {!isComplete && (
              <Button size="lg" onClick={onStart}>
                {completedSteps > 0 ? 'Continue' : 'Get Started'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(percentComplete)}%
            </div>
            <Progress value={percentComplete} className="mt-2 h-2" />
            <p className="text-muted-foreground mt-2 text-sm">
              {completedSteps} of {totalSteps} steps completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              XP Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">
              {progress.xpEarned}
            </div>
            <XpBar
              current={progress.xpEarned}
              max={totalXp}
              showLabel={false}
              size="sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Time Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isComplete ? '✓' : `~${estimatedMinutes}m`}
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              {isComplete ? 'All done!' : `${remainingSteps} steps to go`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Step Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📋</span>
            <span>Your Journey</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {track.steps.map((step, index) => {
              const isStepCompleted = progress.completedStepIds.includes(
                step.id
              );
              const isCurrent =
                !isStepCompleted &&
                track.steps
                  .slice(0, index)
                  .every((s) => progress.completedStepIds.includes(s.id));

              return (
                <div
                  key={step.id}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      isStepCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                          ? 'bg-blue-500 text-white'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isStepCompleted ? '✓' : index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-medium ${
                        isStepCompleted
                          ? 'text-green-500'
                          : isCurrent
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                  {step.xpReward && (
                    <span className="text-muted-foreground text-sm">
                      +{step.xpReward} XP
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Completion Message */}
      {isComplete && (
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="text-4xl">🎉</div>
            <div>
              <h3 className="text-lg font-semibold text-green-500">
                Onboarding Complete!
              </h3>
              <p className="text-muted-foreground">
                You've completed all {totalSteps} steps. Welcome aboard!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

