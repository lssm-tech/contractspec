'use client';

import * as React from 'react';
import { Button } from '@lssm/lib.design-system';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@lssm/lib.ui-kit-web/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@lssm/lib.ui-kit-web/ui/tabs';
import { useRecordLearningEvent } from '../../../hooks/studio/mutations/useLearningEventMutations';
import { useMyOnboardingProgress } from '../../../hooks/studio/queries/useMyOnboardingProgress';
import { useMyOnboardingTracks } from '../../../hooks/studio/queries/useMyOnboardingTracks';
import type { LearningJourneyStepSpec } from '@lssm/module.learning-journey/track-spec';
import {
  JourneyMap,
  StepChecklist,
} from '@lssm/example.learning-journey-ui-onboarding/components';

export interface LearningTrackDetailProps {
  /** Preferred: the onboarding track key (ex: `studio_getting_started`). */
  trackKey?: string;
  /** Fallback for presentation props (many example models use `id`). */
  id?: string;
  name?: string;
  description?: string | null;
  steps?: Array<{
    id: string;
    title: string;
    description?: string | null;
    instructions?: string | null;
    order?: number | null;
    xpReward?: number | null;
    completionEvent?: string;
  }>;
}

export function LearningTrackDetail(props: LearningTrackDetailProps) {
  const inferredTrackKey = props.trackKey ?? props.id ?? '';

  const tracksQuery = useMyOnboardingTracks({
    includeProgress: false,
    enabled: !props.steps?.length,
  });

  const dbTrack =
    props.steps?.length || !inferredTrackKey
      ? null
      : ((tracksQuery.data?.myOnboardingTracks.tracks ?? []).find(
          (t) => t.trackKey === inferredTrackKey
        ) ?? null);

  const track = React.useMemo(() => {
    if (props.steps?.length) {
      return {
        trackKey: inferredTrackKey,
        name: props.name ?? inferredTrackKey,
        description: props.description ?? null,
        steps: props.steps.map((s) => ({
          stepKey: s.id,
          title: s.title,
          description: s.description ?? null,
          instructions: s.instructions ?? null,
          order: s.order ?? null,
          xpReward: s.xpReward ?? null,
          completionEvent: s.completionEvent ?? 'module.navigated',
        })),
      };
    }

    if (!dbTrack) return null;
    return {
      trackKey: dbTrack.trackKey,
      name: dbTrack.name,
      description: dbTrack.description ?? null,
      steps: dbTrack.steps.map((s) => ({
        stepKey: s.stepKey,
        title: s.title,
        description: s.description ?? null,
        instructions: s.instructions ?? null,
        order: s.order,
        xpReward: s.xpReward ?? null,
        completionEvent: s.completionEvent,
        completionCondition: s.completionCondition,
        metadata: s.metadata,
        actionUrl: s.actionUrl ?? null,
        actionLabel: s.actionLabel ?? null,
      })),
    };
  }, [dbTrack, inferredTrackKey, props.description, props.name, props.steps]);

  const { data: progressData } = useMyOnboardingProgress(inferredTrackKey, {
    enabled: Boolean(inferredTrackKey),
  });
  const progress = progressData?.myOnboardingProgress ?? null;

  const recordLearning = useRecordLearningEvent();

  const stepsForUi: LearningJourneyStepSpec[] = React.useMemo(() => {
    if (!track) return [];
    const sorted = [...track.steps].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
    return sorted.map((s) => ({
      id: s.stepKey,
      title: s.title,
      description: s.description ?? undefined,
      instructions: s.instructions ?? undefined,
      order: s.order ?? undefined,
      xpReward: s.xpReward ?? undefined,
      completion: {
        eventName: s.completionEvent,
        payloadFilter: getPayloadFilter(
          (s as { completionCondition?: unknown }).completionCondition
        ),
      },
      metadata: asRecord((s as { metadata?: unknown }).metadata),
      actionUrl: (s as { actionUrl?: string | null }).actionUrl ?? undefined,
      actionLabel:
        (s as { actionLabel?: string | null }).actionLabel ?? undefined,
    }));
  }, [track]);

  const completedStepIds = React.useMemo(() => {
    if (!progress) return [];
    return progress.stepCompletions
      .filter((c) => c.status === 'COMPLETED' || c.status === 'SKIPPED')
      .map((c) => c.stepKey);
  }, [progress]);

  const currentStepId = React.useMemo(() => {
    for (const step of stepsForUi) {
      if (!completedStepIds.includes(step.id)) return step.id;
    }
    return null;
  }, [completedStepIds, stepsForUi]);

  const [expandedStepId, setExpandedStepId] = React.useState<string | null>(
    null
  );

  if (!inferredTrackKey) {
    return (
      <Card className="p-6">
        <p className="text-sm font-semibold">No track selected</p>
        <p className="text-muted-foreground mt-1 text-sm">
          Open a learning track from the learning hub.
        </p>
      </Card>
    );
  }

  if (!track) {
    return (
      <Card className="p-6">
        <p className="text-sm font-semibold">Track not found</p>
        <p className="text-muted-foreground mt-1 text-sm">
          We couldn’t find the learning track: {inferredTrackKey}
        </p>
      </Card>
    );
  }

  const percent = progress?.progress ?? 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            <span className="truncate">{track.name}</span>
            <span className="text-muted-foreground text-xs">{percent}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {track.description ? (
            <p className="text-muted-foreground text-sm">{track.description}</p>
          ) : null}
          <Tabs defaultValue="checklist">
            <TabsList>
              <TabsTrigger value="checklist">Checklist</TabsTrigger>
              <TabsTrigger value="map">Map</TabsTrigger>
            </TabsList>
            <TabsContent value="checklist" className="space-y-3 pt-3">
              {stepsForUi.map((step, index) => {
                const isCompleted = completedStepIds.includes(step.id);
                const isCurrent = step.id === currentStepId;
                const isExpanded = expandedStepId === step.id;
                return (
                  <StepChecklist
                    key={step.id}
                    step={step}
                    stepNumber={index + 1}
                    isCompleted={isCompleted}
                    isCurrent={isCurrent}
                    isExpanded={isExpanded}
                    onToggle={() =>
                      setExpandedStepId((prev) =>
                        prev === step.id ? null : step.id
                      )
                    }
                    onComplete={() => {
                      const payloadFilter = (
                        step.completion as { payloadFilter?: unknown }
                      ).payloadFilter;
                      recordLearning.mutate({
                        name: step.completion.eventName,
                        payload: payloadFilter,
                      });
                    }}
                  />
                );
              })}
            </TabsContent>
            <TabsContent value="map" className="pt-3">
              <JourneyMap
                steps={stepsForUi}
                completedStepIds={completedStepIds}
                currentStepId={currentStepId}
              />
            </TabsContent>
          </Tabs>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onPress={() => {
                if (!currentStepId) return;
                const step = stepsForUi.find((s) => s.id === currentStepId);
                if (!step) return;
                recordLearning.mutate({
                  name: step.completion.eventName,
                  payload: (step.completion as { payloadFilter?: unknown })
                    .payloadFilter,
                });
              }}
            >
              Mark current step complete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== 'object' || value === null) return undefined;
  if (Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}
function getPayloadFilter(
  completionCondition: unknown
): Record<string, unknown> | undefined {
  const record = asRecord(completionCondition);
  const payloadFilter = record?.payloadFilter;
  return asRecord(payloadFilter);
}


