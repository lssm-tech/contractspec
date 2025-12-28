import type { FormatterType } from '@contractspec/lib.contracts';
import type { SpecType } from '../../types';

export interface CreateOptions {
  type?: SpecType;
  ai?: boolean;
  provider?: string;
  model?: string;
  outputDir?: string;
  /** Skip formatting generated files */
  noFormat?: boolean;
  /** Override formatter type */
  formatter?: FormatterType;
}
