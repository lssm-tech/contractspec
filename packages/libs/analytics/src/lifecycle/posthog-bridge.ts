import type { LifecycleAssessment } from '@contractspec/lib.lifecycle';
import { lifecycleEventNames } from './metric-collectors';

export interface PostHogLikeClient {
  capture: (event: {
    distinctId: string;
    event: string;
    properties?: Record<string, unknown>;
  }) => Promise<void> | void;
}

export const trackLifecycleAssessment = async (
  client: PostHogLikeClient,
  tenantId: string,
  assessment: LifecycleAssessment
) => {
  await client.capture({
    distinctId: tenantId,
    event: lifecycleEventNames.assessmentRun,
    properties: {
      stage: assessment.stage,
      confidence: assessment.confidence,
      axes: assessment.axes,
    },
  });
};

export const trackLifecycleStageChange = async (
  client: PostHogLikeClient,
  tenantId: string,
  previousStage: number | undefined,
  nextStage: number
) => {
  await client.capture({
    distinctId: tenantId,
    event: lifecycleEventNames.stageChanged,
    properties: {
      previousStage,
      nextStage,
    },
  });
};


