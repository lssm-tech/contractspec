'use client';

import * as React from 'react';
import { Card } from '@lssm/lib.ui-kit-web/ui/card';
import { Button } from '@lssm/lib.design-system';
import {
  StudioLearningEventNames,
  useStudioLearningEventRecorder,
  useEvolutionSessions,
  useStartEvolutionSession,
  useUpdateEvolutionSession,
} from '@lssm/bundle.contractspec-studio/presentation/hooks/studio';
import { useSelectedProject } from '../SelectedProjectContext';

export default function ProjectEvolutionClient() {
  const project = useSelectedProject();
  const { data, isLoading, refetch } = useEvolutionSessions(project.id);
  const sessions = data?.evolutionSessions ?? [];

  const start = useStartEvolutionSession();
  const update = useUpdateEvolutionSession();
  const { recordFireAndForget: recordLearningEvent } =
    useStudioLearningEventRecorder();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">Evolution</p>
          <p className="text-muted-foreground text-sm">
            Sessions are persisted in DB (`EvolutionSession`).
          </p>
        </div>
        <Button
          loading={start.isPending}
          onPress={async () => {
            await start.mutateAsync({
              projectId: project.id,
              trigger: 'MANUAL',
              signals: { source: 'studio-ui' },
              context: { projectSlug: project.slug, projectName: project.name },
              suggestions: { items: [] },
            });
            await refetch();
          }}
        >
          Start session
        </Button>
      </div>

      <Card className="p-4">
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading…</p>
        ) : sessions.length ? (
          <div className="space-y-2">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="border-border flex flex-wrap items-center justify-between gap-3 rounded-md border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {s.trigger} · {s.status}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {new Date(s.startedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    loading={update.isPending}
                    onPress={async () => {
                      await update.mutateAsync({
                        id: s.id,
                        status: 'COMPLETED',
                        completedAt: new Date().toISOString(),
                        appliedChanges: { applied: false },
                      });
                      await refetch();
                      recordLearningEvent({
                        projectId: project.id,
                        name: StudioLearningEventNames.EVOLUTION_APPLIED,
                        payload: { evolutionSessionId: s.id },
                      });
                    }}
                  >
                    Mark complete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No sessions yet.</p>
        )}
      </Card>
    </div>
  );
}






