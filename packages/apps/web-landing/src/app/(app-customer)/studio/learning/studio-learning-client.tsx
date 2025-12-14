'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card } from '@lssm/lib.ui-kit-web/ui/card';
import { Button } from '@lssm/lib.design-system';
import {
  useMyLearningEvents,
  useStudioProjects,
} from '@lssm/bundle.contractspec-studio/presentation/hooks/studio';

export default function StudioLearningClient() {
  const { data: projectsData } = useStudioProjects({ enabled: true });
  const projects = projectsData?.myStudioProjects ?? [];

  const { data, isLoading, refetch } = useMyLearningEvents({ limit: 200 });
  const events = data?.myLearningEvents ?? [];

  return (
    <main className="section-padding py-10">
      <div className="mx-auto max-w-4xl space-y-4">
        <header className="space-y-1">
          <p className="text-sm font-semibold">Learning</p>
          <p className="text-muted-foreground text-sm">
            Studio learning events are persisted to the database.
          </p>
        </header>

        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold">Projects</p>
            <Button variant="ghost" onPress={() => void refetch()}>
              Refresh
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {projects.map((p) => (
              <Button key={p.id} asChild variant="outline" size="sm">
                <Link href={`/studio/${p.slug}/learning`}>{p.name}</Link>
              </Button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Recent events</p>
            <Button variant="ghost" size="sm" onPress={() => void refetch()}>
              Refresh
            </Button>
          </div>
          {isLoading ? (
            <p className="text-muted-foreground mt-3 text-sm">Loading…</p>
          ) : events.length ? (
            <div className="mt-3 space-y-2">
              {events.slice(0, 50).map((e) => (
                <div
                  key={e.id}
                  className="flex items-start justify-between gap-3 rounded-md border border-border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{e.name}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {e.projectId ? `project: ${e.projectId}` : 'org-wide'} ·{' '}
                      {new Date(e.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground mt-3 text-sm">
              No events recorded yet.
            </p>
          )}
        </Card>
      </div>
    </main>
  );
}


