import {
  createLifecycleHandlers,
  LifecycleAssessmentService,
} from '@lssm/bundle.lifecycle-managed';
import { CapitalPhase, CompanyPhase, ProductPhase } from '@lssm/lib.lifecycle';

async function main() {
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

  console.log('Lifecycle assessment:');
  console.dir(response.body.assessment, { depth: null });
  console.log('\nTop recommendation:');
  console.dir(response.body.recommendation.actions[0], { depth: null });
  console.log('\nSuggested libraries:');
  console.dir(response.body.libraries, { depth: null });
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*

bun build --compile --minify-whitespace --minify-syntax --target bun --outfile server src/index.ts
 */
