import {
  createLifecycleHandlers,
  LifecycleAssessmentService,
} from '@contractspec/bundle.lifecycle-managed';
import {
  CapitalPhase,
  CompanyPhase,
  ProductPhase,
} from '@contractspec/lib.lifecycle';
import { Logger, LogLevel } from '@contractspec/lib.logger';
import type { LoggerConfig } from '@contractspec/lib.logger/types';

const logger = new Logger({
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  environment:
    (process.env.NODE_ENV as LoggerConfig['environment']) || 'development',
  enableColors: process.env.NODE_ENV !== 'production',
});

export async function runLifecycleCliDemo(): Promise<void> {
  const service = new LifecycleAssessmentService({
    collector: {
      analyticsAdapter: {
        async fetch() {
          return {
            metrics: {
              activeUsers: 32,
              weeklyActiveUsers: 27,
              retentionRate: 0.36,
              monthlyRecurringRevenue: 1800,
              customerCount: 22,
              teamSize: 6,
            },
          };
        },
      },
      questionnaireAdapter: {
        async fetch() {
          return {
            axes: {
              product: ProductPhase.Mvp,
              company: CompanyPhase.TinyTeam,
              capital: CapitalPhase.Seed,
            },
            answers: {
              interviewCount: 28,
              primaryPain: 'Manual onboarding takes 3 hours per customer.',
            },
          };
        },
      },
    },
  });

  const handlers = createLifecycleHandlers(service);

  const response = await handlers.runAssessment({
    body: {
      tenantId: 'demo-tenant',
      completedMilestones: ['stage0-problem-statement'],
    },
  });

  logger.info('Lifecycle assessment computed', {
    assessment: response.body.assessment,
    topRecommendation: response.body.recommendation.actions[0],
    libraries: response.body.libraries,
  });
}
