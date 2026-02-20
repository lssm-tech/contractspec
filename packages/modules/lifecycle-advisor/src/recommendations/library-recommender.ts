import { LifecycleStage } from '@contractspec/lib.lifecycle';
import libraryStageMap, {
  getLocalizedLibraryStageMap,
  type LibraryStageEntry,
} from '../data/library-stage-map';

export interface LibraryRecommendation {
  id: string;
  type: 'library' | 'module' | 'bundle';
  description: string;
}

const LIBRARY_MAP = new Map<LifecycleStage, LibraryRecommendation[]>(
  libraryStageMap.map((entry) => [entry.stage, entry.items])
);

export class ContractSpecLibraryRecommender {
  private readonly mapping: Map<LifecycleStage, LibraryRecommendation[]>;

  constructor(overrides?: LibraryStageEntry[]) {
    this.mapping = overrides?.length
      ? new Map(overrides.map((entry) => [entry.stage, entry.items]))
      : LIBRARY_MAP;
  }

  /**
   * Recommend libraries for a lifecycle stage.
   * When `locale` is provided, library descriptions are translated.
   */
  recommend(
    stage: LifecycleStage,
    limit = 4,
    locale?: string
  ): LibraryRecommendation[] {
    if (locale) {
      const localized = getLocalizedLibraryStageMap(locale);
      const entry = localized.find((e) => e.stage === stage);
      return entry?.items.slice(0, limit) ?? [];
    }
    const items = this.mapping.get(stage);
    if (!items?.length) return [];
    return items.slice(0, limit);
  }
}
