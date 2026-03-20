import type { ExperimentRef } from '../experiments/spec';
import type { VisualizationRef } from '../features/types';
import type {
  VisualizationConfig,
  VisualizationMeta,
  VisualizationSource,
  VisualizationStates,
} from './types';

export type { VisualizationRef };

export interface VisualizationSpec {
  meta: VisualizationMeta;
  source: VisualizationSource;
  visualization: VisualizationConfig;
  states?: VisualizationStates;
  policy?: { flags?: string[]; pii?: string[] };
  experiments?: ExperimentRef[];
}

export function defineVisualization(spec: VisualizationSpec): VisualizationSpec {
  return spec;
}
