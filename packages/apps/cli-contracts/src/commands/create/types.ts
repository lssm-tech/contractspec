import type { SpecType } from '../../types';

export interface CreateOptions {
  type?: SpecType;
  ai?: boolean;
  provider?: string;
  model?: string;
  outputDir?: string;
}


