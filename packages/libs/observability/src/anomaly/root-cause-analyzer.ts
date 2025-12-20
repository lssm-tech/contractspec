import type { AnomalySignal } from './anomaly-detector';

export interface DeploymentEvent {
  id: string;
  operation: string;
  deployedAt: Date;
  stage?: string;
  status: 'in_progress' | 'completed' | 'rolled_back';
}

export interface RootCauseAnalysis {
  signal: AnomalySignal;
  culprit?: DeploymentEvent;
  notes: string[];
}

export class RootCauseAnalyzer {
  constructor(private readonly lookbackMs: number = 15 * 60 * 1000) {}

  analyze(
    signal: AnomalySignal,
    deployments: DeploymentEvent[]
  ): RootCauseAnalysis {
    const windowStart = new Date(
      signal.point.timestamp.getTime() - this.lookbackMs
    );
    const candidates = deployments
      .filter((deployment) => deployment.deployedAt >= windowStart)
      .sort((a, b) => b.deployedAt.getTime() - a.deployedAt.getTime());

    const notes: string[] = [];
    let culprit: DeploymentEvent | undefined;

    if (candidates.length > 0) {
      culprit = candidates[0];
      if (culprit) {
        notes.push(
          `Closest deployment ${culprit.id} (${culprit.operation}) at ${culprit.deployedAt.toISOString()}`
        );
      }
    } else {
      notes.push('No deployments found within lookback window.');
    }

    if (signal.type === 'latency_regression') {
      notes.push(
        'Verify recent schema changes and external dependency latency.'
      );
    }

    if (signal.type === 'error_rate_spike') {
      notes.push('Check SLO monitor for correlated incidents.');
    }

    return { signal, culprit, notes };
  }
}
