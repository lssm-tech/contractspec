import { LifecycleStage } from '@lssm/lib.lifecycle';
import libraryMap from '../data/library-stage-map.json' assert { type: 'json' };

export interface LibraryRecommendation {
  id: string;
  type: 'library' | 'module' | 'bundle';
  description: string;
}

type LibraryStageEntry = {
  stage: LifecycleStage;
  items: LibraryRecommendation[];
};

const LIBRARY_MAP = new Map<LifecycleStage, LibraryRecommendation[]>(
  (libraryMap as LibraryStageEntry[]).map((entry) => [
    entry.stage,
    entry.items,
  ]),
);

export class ContractSpecLibraryRecommender {
  private readonly mapping: Map<LifecycleStage, LibraryRecommendation[]>;

  constructor(overrides?: LibraryStageEntry[]) {
    this.mapping =
      overrides?.length
        ? new Map(overrides.map((entry) => [entry.stage, entry.items]))
        : LIBRARY_MAP;
  }

  recommend(stage: LifecycleStage, limit = 4): LibraryRecommendation[] {
    const items = this.mapping.get(stage);
    if (!items?.length) return [];
    return items.slice(0, limit);
  }
}


