import type { LifecyclePipelineEvent } from '@contractspec/lib.observability';
import { lifecycleEventNames } from '@contractspec/lib.analytics';

export interface ManagedLifecycleEvent {
  name: string;
  properties: Record<string, unknown>;
}

export type LifecycleEventPublisher = (
  event: ManagedLifecycleEvent
) => Promise<void> | void;

export class LifecycleEventBridge {
  constructor(private readonly publisher?: LifecycleEventPublisher) {}

  forward(event: LifecyclePipelineEvent) {
    if (!this.publisher) return;
    switch (event.type) {
      case 'assessment.recorded':
        this.publisher({
          name: lifecycleEventNames.assessmentRun,
          properties: {
            tenantId: event.payload.tenantId,
            stage: event.payload.stage,
          },
        });
        break;
      case 'stage.changed':
        this.publisher({
          name: lifecycleEventNames.stageChanged,
          properties: {
            tenantId: event.payload.tenantId,
            previousStage: event.payload.previousStage,
            nextStage: event.payload.nextStage,
          },
        });
        break;
      case 'confidence.low':
        this.publisher({
          name: `${lifecycleEventNames.assessmentRun}.low_confidence`,
          properties: {
            tenantId: event.payload.tenantId,
            confidence: event.payload.confidence,
          },
        });
        break;
    }
  }
}


