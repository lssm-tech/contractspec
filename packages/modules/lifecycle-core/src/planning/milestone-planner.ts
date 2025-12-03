import type { LifecycleMilestone, LifecycleStage } from '@lssm/lib.lifecycle';
import catalog from '../data/milestones-catalog.json' assert { type: 'json' };

export class LifecycleMilestonePlanner {
  private readonly milestones: LifecycleMilestone[];

  constructor(customCatalog?: LifecycleMilestone[]) {
    this.milestones = customCatalog ?? (catalog as LifecycleMilestone[]);
  }

  getUpcoming(
    stage: LifecycleStage,
    completedIds: string[] = [],
    limit = 5
  ): LifecycleMilestone[] {
    const completedSet = new Set(completedIds);
    return this.milestones
      .filter(
        (milestone) =>
          milestone.stage === stage && !completedSet.has(milestone.id)
      )
      .sort((a, b) => a.priority - b.priority)
      .slice(0, limit);
  }
}

