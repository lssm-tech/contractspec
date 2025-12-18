import { describe, it, expect } from 'bun:test';
import { StageScorer } from '../scoring/stage-scorer';
import { LifecycleStage } from '@lssm/lib.lifecycle';

describe('StageScorer', () => {
  it('prioritizes MVP/Early Traction when activation metrics are healthy', () => {
    const scorer = new StageScorer();
    const scores = scorer.score({
      metrics: {
        activeUsers: 34,
        weeklyActiveUsers: 29,
        retentionRate: 0.38,
        monthlyRecurringRevenue: 1800,
      },
      signals: [
        {
          id: 'metric:activation',
          kind: 'metric',
          source: 'analytics',
          name: 'activation_rate',
          value: 0.45,
          weight: 1,
          confidence: 0.9,
          capturedAt: new Date().toISOString(),
        },
      ],
    });

    expect(scores[0]?.stage).toBe(LifecycleStage.MvpEarlyTraction);
    expect(scores[0]?.confidence).toBeGreaterThan(0.5);
  });

  it('favor Exploration when usage is tiny and qualitative signals dominate', () => {
    const scorer = new StageScorer();
    const scores = scorer.score({
      metrics: { activeUsers: 2, customerCount: 1, teamSize: 2 },
      signals: [
        {
          id: 'qualitative:interviews',
          kind: 'qualitative',
          source: 'questionnaire',
          name: 'interview_volume',
          value: 20,
          weight: 1,
          confidence: 0.7,
          capturedAt: new Date().toISOString(),
        },
      ],
    });

    expect(scores[0]?.stage).toBe(LifecycleStage.Exploration);
  });
});


