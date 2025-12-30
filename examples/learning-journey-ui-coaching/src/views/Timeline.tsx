'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { TipFeed } from '../components/TipFeed';
import type { LearningViewProps } from '@contractspec/example.learning-journey-ui-shared';

export function Timeline({ track, progress }: LearningViewProps) {
  // Create feed items sorted by completion status (completed first for "recent activity")
  const feedItems = track.steps
    .map((step) => ({
      step,
      isCompleted: progress.completedStepIds.includes(step.id),
      completedAt: progress.completedStepIds.includes(step.id)
        ? 'Recently'
        : undefined,
    }))
    .sort((a, b) => {
      // Completed items first (as recent activity)
      if (a.isCompleted && !b.isCompleted) return -1;
      if (!a.isCompleted && b.isCompleted) return 1;
      return 0;
    });

  const completedCount = feedItems.filter((f) => f.isCompleted).length;
  const pendingCount = feedItems.length - completedCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold">Activity Timeline</h2>
        <p className="text-muted-foreground">
          Your coaching journey and tip history
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {completedCount}
            </div>
            <div className="text-muted-foreground text-sm">Tips Actioned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-500">
              {pendingCount}
            </div>
            <div className="text-muted-foreground text-sm">Tips Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📝</span>
            <span>Coaching Feed</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TipFeed items={feedItems} />
        </CardContent>
      </Card>

      {/* Journey Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📈</span>
            <span>Journey Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Tips</span>
              <span className="font-semibold">{track.steps.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-semibold text-green-500">
                {completedCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">XP Earned</span>
              <span className="font-semibold text-orange-500">
                {progress.xpEarned}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Current Streak</span>
              <span className="font-semibold">
                {progress.streakDays > 0
                  ? `🔥 ${progress.streakDays} days`
                  : 'Start today!'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
