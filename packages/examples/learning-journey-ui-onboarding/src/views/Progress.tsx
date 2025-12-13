'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@lssm/lib.ui-kit-web/ui/card';
import { Progress } from '@lssm/lib.ui-kit-web/ui/progress';
import { XpBar, BadgeDisplay } from '@lssm/example.learning-journey-ui-shared';
import type { LearningViewProps } from '@lssm/example.learning-journey-ui-shared';

export function ProgressView({ track, progress }: LearningViewProps) {
  const totalSteps = track.steps.length;
  const completedSteps = progress.completedStepIds.length;
  const percentComplete =
    totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const totalXp =
    track.totalXp ??
    track.steps.reduce((sum, s) => sum + (s.xpReward ?? 0), 0) +
      (track.completionRewards?.xpBonus ?? 0);

  const remainingSteps = totalSteps - completedSteps;
  const estimatedMinutes = remainingSteps * 5;

  return (
    <div className="space-y-6">
      {/* Main Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📈</span>
            <span>Your Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Circular progress indicator */}
          <div className="flex items-center justify-center">
            <div className="relative flex h-40 w-40 items-center justify-center">
              <svg
                className="absolute h-full w-full -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  strokeWidth="8"
                  className="stroke-muted"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${percentComplete * 2.83} 283`}
                  className="stroke-blue-500 transition-all duration-500"
                />
              </svg>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {Math.round(percentComplete)}%
                </div>
                <div className="text-muted-foreground text-sm">Complete</div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-500">
                {completedSteps}
              </div>
              <div className="text-muted-foreground text-sm">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500">
                {remainingSteps}
              </div>
              <div className="text-muted-foreground text-sm">Remaining</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{estimatedMinutes}m</div>
              <div className="text-muted-foreground text-sm">Est. Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* XP Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>⚡</span>
            <span>Experience Points</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-500">
              {progress.xpEarned}
            </span>
            <span className="text-muted-foreground">/ {totalXp} XP</span>
          </div>
          <XpBar
            current={progress.xpEarned}
            max={totalXp}
            showLabel={false}
            size="lg"
          />
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🏅</span>
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BadgeDisplay badges={progress.badges} size="lg" />
          {progress.badges.length === 0 &&
            track.completionRewards?.badgeKey && (
              <p className="text-muted-foreground text-sm">
                Complete all steps to earn the "
                {track.completionRewards.badgeKey}" badge!
              </p>
            )}
        </CardContent>
      </Card>

      {/* Step-by-step breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📋</span>
            <span>Step Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {track.steps.map((step, index) => {
              const isCompleted = progress.completedStepIds.includes(step.id);
              const stepProgress = isCompleted ? 100 : 0;

              return (
                <div key={step.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={
                        isCompleted ? 'text-green-500' : 'text-foreground'
                      }
                    >
                      {index + 1}. {step.title}
                    </span>
                    <span
                      className={
                        isCompleted ? 'text-green-500' : 'text-muted-foreground'
                      }
                    >
                      {isCompleted ? '✓' : 'Pending'}
                    </span>
                  </div>
                  <Progress value={stepProgress} className="h-1" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Re-export with correct name
export { ProgressView as Progress };
