'use client';

import Link from 'next/link';
import { Card } from '@lssm/lib.ui-kit-web/ui/card';
import { Button } from '@lssm/lib.design-system';
import { LearningTrackProgressWidget } from '@lssm/bundle.contractspec-studio/presentation/components';
import { useMyLearningEvents } from '@lssm/bundle.contractspec-studio/presentation/hooks/studio';
import { useSelectedProject } from '../SelectedProjectContext';

export default function ProjectLearningClient() {
  const project = useSelectedProject();
  const { data, isLoading, refetch } = useMyLearningEvents({
    projectId: project.id,
    limit: 200,
  });
  const events = data?.myLearningEvents ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">Learning</p>
          <p className="text-muted-foreground text-sm">
            Your learning journey progress (org-wide) + this project’s activity.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/studio/learning">Open learning hub</Link>
          </Button>
          <Button size="sm" variant="ghost" onPress={() => void refetch()}>
            Refresh activity
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <LearningTrackProgressWidget />
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Recent activity (debug)</p>
        </div>
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading…</p>
        ) : events.length ? (
          <div className="space-y-2">
            {events.slice(0, 50).map((e) => (
              <div
                key={e.id}
                className="border-border flex items-start justify-between gap-3 rounded-md border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{e.name}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {new Date(e.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No events yet.</p>
        )}
      </Card>
    </div>
  );
}

