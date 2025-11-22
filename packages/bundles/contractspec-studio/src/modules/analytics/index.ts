import type { Logger } from '@lssm/lib.logger';
import type { LifecycleAssessment } from '@lssm/lib.lifecycle';
import {
  prisma,
  Environment,
  DeploymentStatus,
} from '@lssm/lib.database-contractspec-studio';
import { LifecycleKpiPipeline } from '@lssm/lib.observability/pipeline/lifecycle-pipeline';
import { toInputJson } from '../../utils/prisma-json';
import { toPrismaLifecycleStage } from '../../utils/lifecycle-stage';

export type StudioAnalyticsEvent =
  | {
      type: 'lifecycle.assessment';
      projectId: string;
      organizationId: string;
      payload: { assessment: LifecycleAssessment };
    }
  | {
      type: 'spec.updated';
      projectId: string;
      organizationId: string;
      payload?: Record<string, unknown>;
    }
  | {
      type: 'deployment.triggered';
      projectId: string;
      organizationId: string;
      environment: string;
    };

export interface ProjectMetrics {
  projectId: string;
  specCount: number;
  overlayCount: number;
  integrationCount: number;
  deploymentCount: number;
  lastDeploymentAt?: Date | null;
  lastEventAt?: Date | null;
}

export interface StudioAnalyticsModuleOptions {
  logger?: Logger;
  pipeline?: LifecycleKpiPipeline;
  pipelineOptions?: ConstructorParameters<typeof LifecycleKpiPipeline>[0];
}

interface ProjectEventState {
  lastEventAt?: Date;
  lifecycleAssessments: number;
}

export class StudioAnalyticsModule {
  private readonly logger?: Logger;
  private readonly pipeline: LifecycleKpiPipeline;
  private readonly projectState = new Map<string, ProjectEventState>();

  constructor(options: StudioAnalyticsModuleOptions = {}) {
    this.logger = options.logger;
    this.pipeline =
      options.pipeline ?? new LifecycleKpiPipeline(options.pipelineOptions);
  }

  async trackEvent(event: StudioAnalyticsEvent): Promise<void> {
    this.logger?.debug?.('studio.analytics.event', { event });

    if (event.type === 'lifecycle.assessment') {
      this.pipeline.recordAssessment(
        event.payload.assessment,
        event.organizationId
      );
      this.bumpProjectState(event.projectId, (state) => ({
        ...state,
        lifecycleAssessments: state.lifecycleAssessments + 1,
      }));
      const stage = toPrismaLifecycleStage(event.payload.assessment.stage);
      const metricsPayload = event.payload.assessment.metrics ?? {};
      const signalsPayload = event.payload.assessment.signals ?? [];
      await prisma.organizationLifecycleProfile.upsert({
        where: { organizationId: event.organizationId },
        update: {
          detectedStage: stage,
          confidence: event.payload.assessment.confidence,
          metrics: toInputJson(metricsPayload),
          signals: toInputJson(signalsPayload),
          lastAssessment: new Date(),
        },
        create: {
          organizationId: event.organizationId,
          currentStage: stage,
          detectedStage: stage,
          confidence: event.payload.assessment.confidence,
          lastAssessment: new Date(),
          metrics: toInputJson(metricsPayload),
          signals: toInputJson(signalsPayload),
        },
      });
    }

    if (event.type === 'deployment.triggered') {
      await prisma.studioDeployment.create({
        data: {
          projectId: event.projectId,
          environment:
            this.resolveEnvironment(event.environment) ??
            Environment.DEVELOPMENT,
          status: DeploymentStatus.PENDING,
          version: `auto-${Date.now()}`,
        },
      });
    }

    this.bumpProjectState(event.projectId, (state) => ({
      ...state,
      lastEventAt: new Date(),
    }));
  }

  async getProjectMetrics(projectId: string): Promise<ProjectMetrics> {
    const [specCount, overlayCount, integrationCount, deploymentAggregates] =
      await prisma.$transaction([
        prisma.studioSpec.count({ where: { projectId } }),
        prisma.studioOverlay.count({ where: { projectId } }),
        prisma.studioIntegration.count({ where: { projectId } }),
        prisma.studioDeployment.aggregate({
          _count: { _all: true },
          _max: { deployedAt: true },
          where: { projectId },
        }),
      ]);

    const state = this.projectState.get(projectId);
    return {
      projectId,
      specCount,
      overlayCount,
      integrationCount,
      deploymentCount: deploymentAggregates._count._all ?? 0,
      lastDeploymentAt: deploymentAggregates._max.deployedAt,
      lastEventAt: state?.lastEventAt,
    };
  }

  private bumpProjectState(
    projectId: string,
    updater: (state: ProjectEventState) => ProjectEventState
  ) {
    const current =
      this.projectState.get(projectId) ?? {
        lifecycleAssessments: 0,
      };
    const next = updater(current);
    this.projectState.set(projectId, next);
  }

  private resolveEnvironment(
    value: string
  ): Environment | undefined {
    const key = value.toUpperCase() as keyof typeof Environment;
    return Environment[key];
  }
}

