'use client';

import { Button } from '@lssm/lib.design-system';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@lssm/lib.ui-kit-web/ui/card';
import {
  XpBar,
  StreakCounter,
  BadgeDisplay,
} from '@lssm/example.learning-journey-ui-shared';
import type { LearningViewProps } from '@lssm/example.learning-journey-ui-shared';

interface GamifiedOverviewProps extends LearningViewProps {
  onStart?: () => void;
}

export function Overview({ track, progress, onStart }: GamifiedOverviewProps) {
  const totalXp =
    track.totalXp ??
    track.steps.reduce((sum, s) => sum + (s.xpReward ?? 0), 0) +
      (track.completionRewards?.xpBonus ?? 0);

  const completedSteps = progress.completedStepIds.length;
  const totalSteps = track.steps.length;
  const isComplete = completedSteps === totalSteps;

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <Card className="overflow-hidden bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-4xl shadow-lg">
              {isComplete ? '🏆' : '🎯'}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{track.name}</h1>
              <p className="text-muted-foreground mt-1">{track.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <StreakCounter days={progress.streakDays} size="lg" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              XP Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-violet-500">
              {progress.xpEarned.toLocaleString()}
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
              Steps Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {completedSteps}{' '}
              <span className="text-muted-foreground text-lg">
                / {totalSteps}
              </span>
            </div>
            <div className="bg-muted mt-2 h-2 w-full overflow-hidden rounded-full">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Badges Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BadgeDisplay badges={progress.badges} size="lg" />
          </CardContent>
        </Card>
      </div>

      {/* Next Step Preview */}
      {!isComplete && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🎯</span>
              <span>Next Challenge</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const nextStep = track.steps.find(
                (s) => !progress.completedStepIds.includes(s.id)
              );
              if (!nextStep) return null;

              return (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{nextStep.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {nextStep.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {nextStep.xpReward && (
                      <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-500">
                        +{nextStep.xpReward} XP
                      </span>
                    )}
                    <Button onClick={onStart}>Start</Button>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Completion Message */}
      {isComplete && (
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="text-4xl">🎉</div>
            <div>
              <h3 className="text-lg font-semibold text-green-500">
                Track Complete!
              </h3>
              <p className="text-muted-foreground">
                You've mastered all {totalSteps} challenges and earned{' '}
                {progress.xpEarned} XP.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
