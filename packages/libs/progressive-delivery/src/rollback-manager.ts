import type { CanaryStage, RollbackAction } from './types';

export interface RollbackManagerOptions {
  rollback(stage: CanaryStage, reason: string): Promise<void> | void;
  onRollback?: (action: RollbackAction) => void;
}

export class RollbackManager {
  constructor(private readonly options: RollbackManagerOptions) {}

  async execute(stage: CanaryStage, reason: string) {
    await this.options.rollback(stage, reason);
    const action: RollbackAction = {
      reason,
      stage,
      triggeredAt: new Date(),
    };
    this.options.onRollback?.(action);
    return action;
  }
}
