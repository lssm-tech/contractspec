import type {
  LifecycleAssessment,
  LifecycleAssessmentInput,
  LifecycleRecommendation,
  LifecycleStage,
} from '@lssm/lib.lifecycle';
import { ProductPhase, CompanyPhase, CapitalPhase } from '@lssm/lib.lifecycle';
import {
  LifecycleOrchestrator,
  StageSignalCollector,
  StageScorer,
  LifecycleMilestonePlanner,
  type StageSignalCollectorOptions,
} from '@lssm/module.lifecycle-core';
import {
  LifecycleRecommendationEngine,
  ContractSpecLibraryRecommender,
  LifecycleCeremonyDesigner,
} from '@lssm/module.lifecycle-advisor';
import {
  LifecycleKpiPipeline,
  type LifecyclePipelineEvent,
} from '@lssm/lib.observability';
import { LifecycleEventBridge } from '../events/lifecycle-events';

export interface LifecycleAssessmentRequest extends LifecycleAssessmentInput {
  tenantId?: string;
  completedMilestones?: string[];
}

export interface LifecycleAssessmentResponse {
  assessment: LifecycleAssessment;
  recommendation: LifecycleRecommendation;
  libraries: ReturnType<ContractSpecLibraryRecommender['recommend']>;
  ceremony?: ReturnType<LifecycleCeremonyDesigner['design']>;
}

export interface LifecycleAssessmentServiceOptions {
  collector: StageSignalCollectorOptions;
  pipeline?: LifecycleKpiPipeline;
  recommendationEngine?: LifecycleRecommendationEngine;
  libraryRecommender?: ContractSpecLibraryRecommender;
  ceremonyDesigner?: LifecycleCeremonyDesigner;
  eventBridge?: LifecycleEventBridge;
  onPipelineEvent?: (event: LifecyclePipelineEvent) => void;
}

export class LifecycleAssessmentService {
  private readonly orchestrator: LifecycleOrchestrator;
  private readonly recommendationEngine: LifecycleRecommendationEngine;
  private readonly libraryRecommender: ContractSpecLibraryRecommender;
  private readonly ceremonyDesigner: LifecycleCeremonyDesigner;
  private readonly pipeline: LifecycleKpiPipeline;
  private readonly eventBridge?: LifecycleEventBridge;

  constructor(options: LifecycleAssessmentServiceOptions) {
    const collector = new StageSignalCollector(options.collector);
    const scorer = new StageScorer();
    const milestonePlanner = new LifecycleMilestonePlanner();
    this.orchestrator = new LifecycleOrchestrator({
      collector,
      scorer,
      milestonePlanner,
    });
    this.recommendationEngine =
      options.recommendationEngine ?? new LifecycleRecommendationEngine();
    this.libraryRecommender =
      options.libraryRecommender ?? new ContractSpecLibraryRecommender();
    this.ceremonyDesigner =
      options.ceremonyDesigner ?? new LifecycleCeremonyDesigner();
    this.pipeline = options.pipeline ?? new LifecycleKpiPipeline();
    this.eventBridge = options.eventBridge;
    if (options.onPipelineEvent) {
      this.pipeline.on(options.onPipelineEvent);
    }
    if (this.eventBridge) {
      this.pipeline.on((event) => this.eventBridge?.forward(event));
    }
  }

  async runAssessment(
    request: LifecycleAssessmentRequest
  ): Promise<LifecycleAssessmentResponse> {
    const assessment = await this.orchestrator.run(request);
    const upcoming = this.orchestrator.getUpcomingMilestones(
      assessment.stage,
      request.completedMilestones
    );
    this.pipeline.recordAssessment(assessment, request.tenantId);

    const recommendation = this.recommendationEngine.generate(assessment, {
      upcomingMilestones: upcoming,
    });

    const libraries = this.libraryRecommender.recommend(assessment.stage);
    const ceremony = this.ceremonyDesigner.design(assessment.stage);

    return {
      assessment,
      recommendation,
      libraries,
      ceremony,
    };
  }

  getStagePlaybook(stage: LifecycleStage) {
    const recommendation = this.recommendationEngine.generate(
      {
        stage,
        confidence: 1,
        axes: {
          product: ProductPhase.Mvp,
          company: CompanyPhase.TinyTeam,
          capital: CapitalPhase.Seed,
        },
        signals: [],
        gaps: [],
        focusAreas: [],
        scorecard: [],
        generatedAt: new Date().toISOString(),
      },
      { upcomingMilestones: this.orchestrator.getUpcomingMilestones(stage) }
    );

    return {
      recommendation,
      libraries: this.libraryRecommender.recommend(stage),
      ceremony: this.ceremonyDesigner.design(stage),
    };
  }
}
