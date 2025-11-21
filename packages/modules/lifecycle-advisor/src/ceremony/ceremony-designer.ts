import type { LifecycleRecommendation } from '@lssm/lib.lifecycle';
import { LifecycleStage } from '@lssm/lib.lifecycle';
import playbooks from '../data/stage-playbooks.json' assert { type: 'json' };

type CeremonyConfig = NonNullable<LifecycleRecommendation['ceremony']>;

type PlaybookCeremonyEntry = {
  stage: LifecycleStage;
  ceremony?: CeremonyConfig;
};

const CEREMONY_MAP = new Map<LifecycleStage, CeremonyConfig | undefined>(
  (playbooks as PlaybookCeremonyEntry[]).map((entry) => [entry.stage, entry.ceremony]),
);

export class LifecycleCeremonyDesigner {
  private readonly ceremonies: Map<LifecycleStage, CeremonyConfig | undefined>;

  constructor(overrides?: PlaybookCeremonyEntry[]) {
    this.ceremonies =
      overrides?.length
        ? new Map(overrides.map((entry) => [entry.stage, entry.ceremony]))
        : CEREMONY_MAP;
  }

  design(stage: LifecycleStage): CeremonyConfig | undefined {
    return this.ceremonies.get(stage);
  }
}

