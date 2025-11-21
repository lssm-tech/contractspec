import { CanaryAnalyzer, type AnalysisResult } from './canary-analyzer';
import { DeploymentEventBus } from './events';
import type {
  CanaryStage,
  DeploymentStrategy,
  MetricsProvider,
} from './types';

const DEFAULT_STAGES: CanaryStage[] = [
  { percentage: 1, minDurationMs: 5 * 60 * 1000, label: '1%' },
  { percentage: 10, minDurationMs: 5 * 60 * 1000, label: '10%' },
  { percentage: 50, minDurationMs: 10 * 60 * 1000, label: '50%' },
  { percentage: 100, minDurationMs: 15 * 60 * 1000, label: '100%' },
];

export interface CanaryControllerOptions {
  strategy: DeploymentStrategy;
  analyzer: CanaryAnalyzer;
  metricsProvider: MetricsProvider;
  eventBus?: DeploymentEventBus;
}

export class CanaryController {
  private readonly stages: CanaryStage[];

  constructor(private readonly options: CanaryControllerOptions) {
    this.stages =
      options.strategy.stages && options.strategy.stages.length > 0
        ? options.strategy.stages
        : DEFAULT_STAGES;
  }

  getStageList() {
    return [...this.stages];
  }

  async runStage(stage: CanaryStage): Promise<AnalysisResult> {
    this.options.eventBus?.emit({
      type: 'stage_started',
      timestamp: new Date(),
      payload: { stage },
    });

    const metrics = await this.options.metricsProvider(stage, stage.minDurationMs);
    const analysis = this.options.analyzer.evaluate(stage, metrics);

    this.options.eventBus?.emit({
      type: analysis.status === 'pass' ? 'stage_passed' : 'stage_failed',
      timestamp: new Date(),
      payload: { stage, metrics, analysis },
    });

    return analysis;
  }
}

export function createDefaultCanaryController(
  strategy: DeploymentStrategy,
  metricsProvider: MetricsProvider,
  eventBus?: DeploymentEventBus
) {
  const analyzer = new CanaryAnalyzer(strategy.thresholds);
  return new CanaryController({
    strategy,
    analyzer,
    metricsProvider,
    eventBus,
  });
}
