'use client';

import { Button } from '@lssm/lib.design-system';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@lssm/lib.ui-kit-web/ui/card';
import { XpBar, StreakCounter } from '@lssm/example.learning-journey-ui-shared';
import { TipCard } from '../components/TipCard';
import type { LearningViewProps } from '@lssm/example.learning-journey-ui-shared';

interface CoachingOverviewProps extends LearningViewProps {
  onStart?: () => void;
}

export function Overview({
  track,
  progress,
  onStepComplete,
  onStart,
}: CoachingOverviewProps) {
  const totalXp =
    track.totalXp ?? track.steps.reduce((sum, s) => sum + (s.xpReward ?? 0), 0);

  const completedSteps = progress.completedStepIds.length;
  const totalSteps = track.steps.length;
  const pendingSteps = totalSteps - completedSteps;

  // Get active tips (incomplete ones)
  const activeTips = track.steps
    .filter((s) => !progress.completedStepIds.includes(s.id))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-3xl shadow-lg">
              💡
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{track.name}</h1>
              <p className="text-muted-foreground mt-1">{track.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <StreakCounter days={progress.streakDays} size="lg" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Active Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">
              {pendingSteps}
            </div>
            <p className="text-muted-foreground text-sm">tips for you today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Tips Actioned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {completedSteps}
            </div>
            <p className="text-muted-foreground text-sm">
              out of {totalSteps} total
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
            <div className="text-3xl font-bold text-orange-500">
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
      </div>

      {/* Active Tips Preview */}
      {activeTips.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span>💡</span>
              <span>Tips for You</span>
            </CardTitle>
            {activeTips.length < pendingSteps && (
              <Button variant="outline" size="sm" onClick={onStart}>
                View All ({pendingSteps})
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {activeTips.map((step) => (
              <TipCard
                key={step.id}
                step={step}
                isCompleted={false}
                isCurrent={step.id === activeTips[0]?.id}
                onComplete={() => onStepComplete?.(step.id)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* All Complete */}
      {pendingSteps === 0 && (
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="text-4xl">🎉</div>
            <div>
              <h3 className="text-lg font-semibold text-green-500">
                All Tips Actioned!
              </h3>
              <p className="text-muted-foreground">
                Great job! You've addressed all {totalSteps} coaching tips.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

