import { describe, it, expect } from 'vitest';
import { LifecycleRecommendationEngine } from '../recommendations/recommendation-engine';
import { ContractSpecLibraryRecommender } from '../recommendations/library-recommender';
import { LifecycleStage, ProductPhase, CompanyPhase, CapitalPhase } from '@lssm/lib.lifecycle';

const mockAssessment = {
  stage: LifecycleStage.GrowthScaleUp,
  confidence: 0.72,
  axes: {
    product: ProductPhase.V1,
    company: CompanyPhase.MultiTeam,
    capital: CapitalPhase.SeriesAorB,
  },
  signals: [],
  gaps: ['Reliability'],
  focusAreas: ['Systems'],
  scorecard: [],
  generatedAt: new Date().toISOString(),
};

describe('LifecycleRecommendationEngine', () => {
  it('returns actionable recommendations with upcoming milestones', () => {
    const engine = new LifecycleRecommendationEngine();
    const recommendation = engine.generate(mockAssessment, {
      upcomingMilestones: [
        {
          id: 'stage4-growth-loop',
          stage: LifecycleStage.GrowthScaleUp,
          category: 'growth',
          title: 'Codify a growth loop',
          description: 'Document owners and metrics',
          priority: 1,
        },
      ],
    });

    expect(recommendation.actions.length).toBeGreaterThan(0);
    expect(recommendation.upcomingMilestones?.[0]?.id).toBe('stage4-growth-loop');
  });
});

describe('ContractSpecLibraryRecommender', () => {
  it('suggests lifecycle-aware libraries for the current stage', () => {
    const recommender = new ContractSpecLibraryRecommender();
    const libraries = recommender.recommend(LifecycleStage.GrowthScaleUp);
    expect(libraries.some((lib) => lib.id.includes('lib.growth'))).toBe(true);
  });
});


