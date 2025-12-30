'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@contractspec/lib.design-system';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { Progress } from '@contractspec/lib.ui-kit-web/ui/progress';
import { useGraphQL } from '../../../libs/gql-client';
// ...
import { MY_ONBOARDING_TRACKS_QUERY } from '../../../hooks/studio/queries/useMyOnboardingTracks';

export function LearningTrackProgressWidget() {
  const { data, isLoading } = useGraphQL(
    MY_ONBOARDING_TRACKS_QUERY,
    {
      includeProgress: true,
      productId: undefined,
    },
    {
      // enabled: true,
    }
  );

  const tracks = data?.myOnboardingTracks?.tracks ?? [];
  const progress = data?.myOnboardingTracks?.progress ?? [];

  const progressByTrackKey = React.useMemo(() => {
    const map = new Map<string, (typeof progress)[number]>();
    for (const p of progress) {
      if (p.trackKey) {
        map.set(p.trackKey, p);
      }
    }
    return map;
  }, [progress]);

  const active = React.useMemo(() => {
    for (const track of tracks) {
      if (!track.trackKey) continue;
      const p = progressByTrackKey.get(track.trackKey);
      if (!p) return { track, progress: null };
      if (!p.isCompleted && !p.isDismissed) return { track, progress: p };
    }
    return tracks[0]
      ? {
          track: tracks[0],
          progress: tracks[0].trackKey
            ? (progressByTrackKey.get(tracks[0].trackKey) ?? null)
            : null,
        }
      : null;
  }, [progressByTrackKey, tracks]);

  if (isLoading) {
    return (
      <Card className="p-4">
        <p className="text-muted-foreground text-sm">Loading progress…</p>
      </Card>
    );
  }

  if (!active) {
    return (
      <Card className="p-4">
        <p className="text-muted-foreground text-sm">
          No active learning journey.
        </p>
      </Card>
    );
  }

  const percent = active.progress?.progress ?? 0;
  const isCompleted = active.progress?.isCompleted ?? false;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-3">
          <span className="truncate">{active.track.name}</span>
          <span className="text-muted-foreground text-xs">
            {isCompleted ? 'Done' : `${percent}%`}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={percent} className="h-2" />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-muted-foreground text-xs">
            {(active.track.steps ?? []).length} steps ·{' '}
            {active.progress?.xpEarned ?? 0} XP
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href={`/studio/learning/${active.track.trackKey}`}>
              {isCompleted ? 'Review' : 'Continue'}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
