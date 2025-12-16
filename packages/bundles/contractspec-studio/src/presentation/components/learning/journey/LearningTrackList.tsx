'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@lssm/lib.design-system';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@lssm/lib.ui-kit-web/ui/card';
import { Progress } from '@lssm/lib.ui-kit-web/ui/progress';
import { useMyOnboardingTracks } from '../../../hooks/studio/queries/useMyOnboardingTracks';

export function LearningTrackList() {
  const { data, isLoading, error, refetch } = useMyOnboardingTracks({
    includeProgress: true,
    enabled: true,
  });

  const tracks = data?.myOnboardingTracks.tracks ?? [];
  const progress = data?.myOnboardingTracks.progress ?? [];

  const progressByTrackKey = React.useMemo(() => {
    const map = new Map<string, (typeof progress)[number]>();
    for (const p of progress) {
      map.set(p.trackKey, p);
    }
    return map;
  }, [progress]);

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-sm">
          Loading learning journeys…
        </p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-sm font-semibold">
          Unable to load learning journeys
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          {(error as Error).message}
        </p>
        <div className="mt-4">
          <Button variant="outline" onPress={() => void refetch()}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (!tracks.length) {
    return (
      <Card className="p-6">
        <p className="text-sm font-semibold">No learning journeys yet</p>
        <p className="text-muted-foreground mt-2 text-sm">
          Tracks will appear here once available for your account.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tracks.map((track) => {
        const p = progressByTrackKey.get(track.trackKey);
        const percent = p?.progress ?? 0;
        const isCompleted = p?.isCompleted ?? false;
        const xpEarned = p?.xpEarned ?? 0;

        return (
          <Card key={track.trackKey}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between gap-3">
                <span className="truncate">{track.name}</span>
                <span className="text-muted-foreground text-xs">
                  {isCompleted ? 'Completed' : `${percent}%`}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {track.description ? (
                <p className="text-muted-foreground text-sm">
                  {track.description}
                </p>
              ) : null}

              <div className="space-y-2">
                <Progress value={percent} className="h-2" />
                <p className="text-muted-foreground text-xs">
                  {xpEarned} XP earned · {track.steps.length} steps
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link href={`/studio/learning/${track.trackKey}`}>
                    {isCompleted ? 'Review' : 'Continue'}
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/studio/projects">Go to projects</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}




