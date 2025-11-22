import type { LifecycleRecommendation } from '@contractspec/lib.lifecycle';
import { LifecycleStage } from '@contractspec/lib.lifecycle';
import stagePlaybooks from '../data/stage-playbooks';

type CeremonyConfig = NonNullable<LifecycleRecommendation['ceremony']>;

interface PlaybookCeremonyEntry {
  stage: LifecycleStage;
  ceremony?: CeremonyConfig;
}

const CEREMONY_MAP = new Map<LifecycleStage, CeremonyConfig | undefined>(
  (stagePlaybooks as PlaybookCeremonyEntry[]).map((entry) => [
    entry.stage,
    entry.ceremony,
  ])
);

export class LifecycleCeremonyDesigner {
  private readonly ceremonies: Map<LifecycleStage, CeremonyConfig | undefined>;

  constructor(overrides?: PlaybookCeremonyEntry[]) {
    this.ceremonies = overrides?.length
      ? new Map(overrides.map((entry) => [entry.stage, entry.ceremony]))
      : CEREMONY_MAP;
  }

  design(stage: LifecycleStage): CeremonyConfig | undefined {
    return this.ceremonies.get(stage);
  }
}



