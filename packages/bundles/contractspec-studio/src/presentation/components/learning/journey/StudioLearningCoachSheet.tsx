'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@lssm/lib.design-system';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@lssm/lib.ui-kit-web/ui/sheet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@lssm/lib.ui-kit-web/ui/tabs';
import type { LearningJourneyStepSpec } from '@lssm/module.learning-journey/track-spec';
import {
  JourneyMap,
  StepChecklist,
} from '@lssm/example.learning-journey-ui-onboarding/components';
import { TipFeed } from '@lssm/example.learning-journey-ui-coaching/components';
import { useRecordLearningEvent } from '../../../hooks/studio/mutations/useLearningEventMutations';
import { useDismissOnboardingTrack } from '../../../hooks/studio/mutations/useDismissOnboardingTrack';
import { useMyOnboardingProgress } from '../../../hooks/studio/queries/useMyOnboardingProgress';
import { useMyOnboardingTracks } from '../../../hooks/studio/queries/useMyOnboardingTracks';
import {
  asRecord,
  getActiveProjectSlug,
  getPayloadFilter,
  getStepHref,
} from './studio-learning-coach-utils';

const STUDIO_ONBOARDING_TRACK_KEY = 'studio_getting_started';

export function StudioLearningCoachSheet({
  organizationId,
}: {
  organizationId?: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = React.useState(false);
  const [expandedStepId, setExpandedStepId] = React.useState<string | null>(
    null
  );

  const tracksQuery = useMyOnboardingTracks({
    includeProgress: true,
    enabled: true,
  });
  const tracks = tracksQuery.data?.myOnboardingTracks.tracks ?? [];
  const progressList = tracksQuery.data?.myOnboardingTracks.progress ?? [];

  const track =
    tracks.find((t) => t.trackKey === STUDIO_ONBOARDING_TRACK_KEY) ?? null;
  const progressFromList =
    progressList.find((p) => p.trackKey === STUDIO_ONBOARDING_TRACK_KEY) ??
    null;

  const progressQuery = useMyOnboardingProgress(STUDIO_ONBOARDING_TRACK_KEY, {
    enabled: Boolean(track),
  });
  const progress = progressQuery.data?.myOnboardingProgress ?? progressFromList;

  const dismiss = useDismissOnboardingTrack();
  const recordLearning = useRecordLearningEvent();

  React.useEffect(() => {
    if (!track || !progress) return;
    if (progress.isCompleted || progress.isDismissed) return;
    const storageKey = `studio.learningCoach.autoOpened:${organizationId ?? 'unknown'}:${track.trackKey}`;
    try {
      if (localStorage.getItem(storageKey)) return;
      localStorage.setItem(storageKey, '1');
      setOpen(true);
    } catch {
      setOpen(true);
    }
  }, [organizationId, progress, track]);

  const stepsForUi: LearningJourneyStepSpec[] = React.useMemo(() => {
    if (!track) return [];
    return [...track.steps]
      .sort((a, b) => a.order - b.order)
      .map((s) => ({
        id: s.stepKey,
        title: s.title,
        description: s.description ?? undefined,
        instructions: s.instructions ?? undefined,
        order: s.order,
        xpReward: s.xpReward ?? undefined,
        completion: {
          eventName: s.completionEvent,
          payloadFilter: getPayloadFilter(s.completionCondition),
        },
        metadata: asRecord(s.metadata),
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

  const currentStep = React.useMemo(() => {
    if (!currentStepId) return null;
    return stepsForUi.find((s) => s.id === currentStepId) ?? null;
  }, [currentStepId, stepsForUi]);

  const activeProjectSlug = React.useMemo(
    () => getActiveProjectSlug(pathname),
    [pathname]
  );
  const nextHref = currentStep
    ? getStepHref(currentStep.id, activeProjectSlug)
    : null;

  const tipsTrack =
    tracks.find((t) => t.trackKey === 'money_ambient_coach') ?? null;
  const tipsItems = React.useMemo(() => {
    if (!tipsTrack) return [];
    return tipsTrack.steps
      .sort((a, b) => a.order - b.order)
      .map((s) => ({
        step: {
          id: s.stepKey,
          title: s.title,
          description: s.description ?? undefined,
          xpReward: s.xpReward ?? undefined,
          completion: {
            eventName: s.completionEvent,
            payloadFilter: getPayloadFilter(s.completionCondition),
          },
          metadata: asRecord(s.metadata),
        },
        isCompleted: false,
      }));
  }, [tipsTrack]);

  if (!track || !progress || progress.isCompleted || progress.isDismissed) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Studio coach</SheetTitle>
          <SheetDescription>
            {track.name} · {progress.progress}% complete
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto px-4 pb-2">
          <Tabs defaultValue="onboarding">
            <TabsList>
              <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
              <TabsTrigger value="tips">Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="onboarding" className="space-y-4 pt-4">
              <JourneyMap
                steps={stepsForUi}
                completedStepIds={completedStepIds}
                currentStepId={currentStepId}
              />

              <div className="flex flex-wrap gap-2">
                {nextHref ? (
                  <Button
                    size="sm"
                    onPress={() => {
                      router.push(nextHref);
                      setOpen(false);
                    }}
                  >
                    Take me there
                  </Button>
                ) : null}
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => router.push('/studio/learning')}
                >
                  Learning hub
                </Button>
              </div>

              <div className="space-y-3">
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
                        recordLearning.mutate({
                          name: step.completion.eventName,
                          payload: (
                            step.completion as { payloadFilter?: unknown }
                          ).payloadFilter,
                        });
                      }}
                    />
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="tips" className="pt-4">
              <TipFeed items={tipsItems} />
            </TabsContent>
          </Tabs>
        </div>

        <SheetFooter>
          <Button
            variant="ghost"
            onPress={async () => {
              setOpen(false);
            }}
          >
            Close
          </Button>
          <Button
            variant="destructive"
            loading={dismiss.isPending}
            onPress={async () => {
              await dismiss.mutateAsync(track.trackKey);
              setOpen(false);
              await Promise.all([
                tracksQuery.refetch(),
                progressQuery.refetch(),
              ]);
            }}
          >
            Dismiss
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}


