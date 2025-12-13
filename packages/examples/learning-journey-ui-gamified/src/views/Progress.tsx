'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@lssm/lib.ui-kit-web/ui/card';
import { XpBar, BadgeDisplay } from '@lssm/example.learning-journey-ui-shared';
import { MasteryRing } from '../components/MasteryRing';
import type { LearningViewProps } from '@lssm/example.learning-journey-ui-shared';

export function Progress({ track, progress }: LearningViewProps) {
  const totalXp =
    track.totalXp ??
    track.steps.reduce((sum, s) => sum + (s.xpReward ?? 0), 0) +
      (track.completionRewards?.xpBonus ?? 0);

  const completedSteps = progress.completedStepIds.length;
  const totalSteps = track.steps.length;
  const percentComplete =
    totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  // Group steps by metadata surface for mastery rings
  const surfaces = new Map<string, { total: number; completed: number }>();
  track.steps.forEach((step) => {
    const surface = (step.metadata?.surface as string) ?? 'general';
    const current = surfaces.get(surface) ?? { total: 0, completed: 0 };
    surfaces.set(surface, {
      total: current.total + 1,
      completed:
        current.completed +
        (progress.completedStepIds.includes(step.id) ? 1 : 0),
    });
  });

  const surfaceColors: ('green' | 'blue' | 'violet' | 'orange')[] = [
    'green',
    'blue',
    'violet',
    'orange',
  ];

  return (
    <div className="space-y-6">
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
            <span className="text-4xl font-bold text-violet-500">
              {progress.xpEarned.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              / {totalXp.toLocaleString()} XP
            </span>
          </div>
          <XpBar
            current={progress.xpEarned}
            max={totalXp}
            showLabel={false}
            size="lg"
          />

          {track.completionRewards?.xpBonus && percentComplete < 100 && (
            <p className="text-muted-foreground text-sm">
              🎁 Complete all steps for a{' '}
              <span className="font-semibold text-green-500">
                +{track.completionRewards.xpBonus} XP
              </span>{' '}
              bonus!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Mastery Rings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🎯</span>
            <span>Skill Mastery</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-6">
            {Array.from(surfaces.entries()).map(([surface, data], index) => (
              <MasteryRing
                key={surface}
                label={surface.charAt(0).toUpperCase() + surface.slice(1)}
                percentage={(data.completed / data.total) * 100}
                color={surfaceColors[index % surfaceColors.length]}
                size="lg"
              />
            ))}
            <MasteryRing
              label="Overall"
              percentage={percentComplete}
              color="violet"
              size="lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🏅</span>
            <span>Badges Earned</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BadgeDisplay badges={progress.badges} size="lg" maxVisible={10} />
          {progress.badges.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Complete the track to earn your first badge!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Step Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📊</span>
            <span>Step Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
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
                        isCompleted ? 'text-green-500' : 'text-muted-foreground'
                      }
                    >
                      {isCompleted ? '✓' : '○'}
                    </span>
                    <span
                      className={
                        isCompleted
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }
                    >
                      {step.title}
                    </span>
                  </div>
                  {step.xpReward && (
                    <span
                      className={`text-sm font-medium ${isCompleted ? 'text-green-500' : 'text-muted-foreground'}`}
                    >
                      {isCompleted ? '+' : ''}
                      {step.xpReward} XP
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
