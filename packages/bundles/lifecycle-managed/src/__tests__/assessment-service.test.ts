import { describe, it, expect } from 'bun:test';
import { LifecycleAssessmentService } from '../services/assessment-service';
import { ProductPhase, CompanyPhase, CapitalPhase } from '@lssm/lib.lifecycle';

describe('LifecycleAssessmentService', () => {
  it('runs end-to-end assessment with recommendations and libraries', async () => {
    const service = new LifecycleAssessmentService({
      collector: {
        analyticsAdapter: {
          async fetch() {
            return {
              metrics: {
                activeUsers: 35,
                weeklyActiveUsers: 30,
                retentionRate: 0.4,
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
              answers: { interviews: 25 },
            };
          },
        },
      },
    });

    const result = await service.runAssessment({
      tenantId: 'test-tenant',
      completedMilestones: [],
    });

    expect(result.assessment.stage).toBeDefined();
    expect(result.recommendation.actions.length).toBeGreaterThan(0);
    expect(result.libraries.length).toBeGreaterThan(0);
  });
});










