'use client';

import * as React from 'react';
import { Card } from '@lssm/lib.ui-kit-web/ui/card';
import { Button } from '@lssm/lib.design-system';
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
            Activity events for this project (persisted to DB).
          </p>
        </div>
        <Button variant="ghost" onPress={() => void refetch()}>
          Refresh
        </Button>
      </div>

      <Card className="p-4">
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading…</p>
        ) : events.length ? (
          <div className="space-y-2">
            {events.slice(0, 50).map((e) => (
              <div
                key={e.id}
                className="flex items-start justify-between gap-3 rounded-md border border-border p-3"
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


