import { EventEmitter } from 'node:events';
import type { LifecycleAssessment, LifecycleStage } from '@lssm/lib.lifecycle';
import { getStageLabel } from '@lssm/lib.lifecycle';
import {
  createCounter,
  createHistogram,
  createUpDownCounter,
} from '../metrics';

export type LifecyclePipelineEvent =
  | { type: 'assessment.recorded'; payload: { tenantId?: string; stage: LifecycleStage } }
  | {
      type: 'stage.changed';
      payload: { tenantId?: string; previousStage?: LifecycleStage; nextStage: LifecycleStage };
    }
  | { type: 'confidence.low'; payload: { tenantId?: string; confidence: number } };

export interface LifecycleKpiPipelineOptions {
  meterName?: string;
  emitter?: EventEmitter;
  lowConfidenceThreshold?: number;
}

export class LifecycleKpiPipeline {
  private readonly assessmentCounter;
  private readonly confidenceHistogram;
  private readonly stageUpDownCounter;
  private readonly emitter: EventEmitter;
  private readonly lowConfidenceThreshold: number;
  private readonly currentStageByTenant = new Map<string, LifecycleStage>();

  constructor(options: LifecycleKpiPipelineOptions = {}) {
    const meterName = options.meterName ?? '@lssm/lib.lifecycle-kpi';
    this.assessmentCounter = createCounter(
      'lifecycle_assessments_total',
      'Total lifecycle assessments',
      meterName,
    );
    this.confidenceHistogram = createHistogram(
      'lifecycle_assessment_confidence',
      'Lifecycle assessment confidence distribution',
      meterName,
    );
    this.stageUpDownCounter = createUpDownCounter(
      'lifecycle_stage_tenants',
      'Current tenants per lifecycle stage',
      meterName,
    );
    this.emitter = options.emitter ?? new EventEmitter();
    this.lowConfidenceThreshold = options.lowConfidenceThreshold ?? 0.4;
  }

  recordAssessment(assessment: LifecycleAssessment, tenantId?: string) {
    const stageLabel = getStageLabel(assessment.stage);
    const attributes = { stage: stageLabel, tenantId };
    this.assessmentCounter.add(1, attributes);
    this.confidenceHistogram.record(assessment.confidence, attributes);

    this.ensureStageCounters(assessment.stage, tenantId);
    this.emitter.emit('event', {
      type: 'assessment.recorded',
      payload: { tenantId, stage: assessment.stage },
    } satisfies LifecyclePipelineEvent);

    if (assessment.confidence < this.lowConfidenceThreshold) {
      this.emitter.emit('event', {
        type: 'confidence.low',
        payload: { tenantId, confidence: assessment.confidence },
      } satisfies LifecyclePipelineEvent);
    }
  }

  on(listener: (event: LifecyclePipelineEvent) => void) {
    this.emitter.on('event', listener);
  }

  private ensureStageCounters(stage: LifecycleStage, tenantId?: string) {
    if (!tenantId) return;
    const previous = this.currentStageByTenant.get(tenantId);
    if (previous === stage) return;

    if (previous !== undefined) {
      this.stageUpDownCounter.add(-1, {
        stage: getStageLabel(previous),
        tenantId,
      });
    }
    this.stageUpDownCounter.add(1, { stage: getStageLabel(stage), tenantId });
    this.currentStageByTenant.set(tenantId, stage);
    this.emitter.emit('event', {
      type: 'stage.changed',
      payload: { tenantId, previousStage: previous, nextStage: stage },
    } satisfies LifecyclePipelineEvent);
  }
}

