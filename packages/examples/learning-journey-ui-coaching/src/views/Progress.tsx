'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@lssm/lib.ui-kit-web/ui/card';
import {
  XpBar,
  BadgeDisplay,
  StreakCounter,
} from '@lssm/example.learning-journey-ui-shared';
import { EngagementMeter } from '../components/EngagementMeter';
import type { LearningViewProps } from '@lssm/example.learning-journey-ui-shared';

export function ProgressView({ track, progress }: LearningViewProps) {
  const totalXp =
    track.totalXp ?? track.steps.reduce((sum, s) => sum + (s.xpReward ?? 0), 0);

  const completedSteps = progress.completedStepIds.length;
  const totalSteps = track.steps.length;
  const pendingSteps = totalSteps - completedSteps;

  // For demo: split completed into "actioned" and "acknowledged"
  // In real app, this would come from progress data
  const actioned = Math.floor(completedSteps * 0.7);
  const acknowledged = completedSteps - actioned;

  return (
    <div className="space-y-6">
      {/* Engagement Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📊</span>
            <span>Engagement Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EngagementMeter
            actioned={actioned}
            acknowledged={acknowledged}
            pending={pendingSteps}
            streak={progress.streakDays}
          />
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              XP Earned
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-orange-500">
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Engagement Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <StreakCounter days={progress.streakDays} size="lg" />
              <div className="text-muted-foreground text-sm">
                {progress.streakDays > 0
                  ? 'Keep going!'
                  : 'Start your streak today!'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🏅</span>
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BadgeDisplay badges={progress.badges} size="lg" maxVisible={10} />
          {progress.badges.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Action tips to unlock achievements!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tip Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>💡</span>
            <span>Tip Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {track.steps.map((step) => {
              const isCompleted = progress.completedStepIds.includes(step.id);

              return (
                <div
                  key={step.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        isCompleted ? 'text-green-500' : 'text-amber-500'
                      }
                    >
                      {isCompleted ? '✓' : '○'}
                    </span>
                    <span
                      className={
                        isCompleted
                          ? 'text-muted-foreground'
                          : 'text-foreground'
                      }
                    >
                      {step.title}
                    </span>
                  </div>
                  <span
                    className={`text-sm ${
                      isCompleted ? 'text-green-500' : 'text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? 'Actioned' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { ProgressView as Progress };

