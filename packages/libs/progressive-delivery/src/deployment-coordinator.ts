import { CanaryController } from './canary-controller';
import { DeploymentEventBus } from './events';
import { RollbackManager } from './rollback-manager';
import { TrafficShifter } from './traffic-shifter';
import type { CanaryStage, DeploymentStrategy, TrafficSplit } from './types';

export interface DeploymentCoordinatorOptions {
  strategy: DeploymentStrategy;
  controller: CanaryController;
  trafficShifter: TrafficShifter;
  rollbackManager: RollbackManager;
  applyTrafficSplit: (stage: CanaryStage, split: TrafficSplit) => void | Promise<void>;
  eventBus?: DeploymentEventBus;
}

export interface DeploymentRunResult {
  status: 'completed' | 'rolled_back';
  failedStage?: CanaryStage;
  reasons?: string[];
}

export class DeploymentCoordinator {
  constructor(private readonly options: DeploymentCoordinatorOptions) {}

  async run(): Promise<DeploymentRunResult> {
    const stages = this.options.controller.getStageList();

    for (const stage of stages) {
      const split = this.options.trafficShifter.computeSplit(stage);
      await this.options.applyTrafficSplit(stage, split);

      const analysis = await this.options.controller.runStage(stage);
      if (analysis.status === 'fail') {
        const action = await this.options.rollbackManager.execute(
          stage,
          analysis.reasons.join(', ')
        );

        this.options.eventBus?.emit({
          type: 'rolled_back',
          timestamp: action.triggeredAt,
          payload: { stage, reasons: analysis.reasons },
        });

        return {
          status: 'rolled_back',
          failedStage: stage,
          reasons: analysis.reasons,
        };
      }
    }

    if (this.options.strategy.mode === 'blue-green') {
      this.options.eventBus?.emit({
        type: 'blue_green_swapped',
        timestamp: new Date(),
        payload: { strategy: this.options.strategy },
      });
    }

    this.options.eventBus?.emit({
      type: 'completed',
      timestamp: new Date(),
      payload: { strategy: this.options.strategy },
    });

    return { status: 'completed' };
  }
}
