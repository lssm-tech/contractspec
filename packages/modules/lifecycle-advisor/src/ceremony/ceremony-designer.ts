import type { LifecycleRecommendation } from '@contractspec/lib.lifecycle';
import { LifecycleStage } from '@contractspec/lib.lifecycle';
import stagePlaybooks, {
  getLocalizedStagePlaybooks,
} from '../data/stage-playbooks';

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

  /**
   * Return ceremony config for a stage.
   * When `locale` is provided, ceremony title and copy are translated.
   */
  design(stage: LifecycleStage, locale?: string): CeremonyConfig | undefined {
    if (locale) {
      const localized = getLocalizedStagePlaybooks(locale);
      const entry = localized.find((p) => p.stage === stage);
      return entry?.ceremony;
    }
    return this.ceremonies.get(stage);
  }
}
