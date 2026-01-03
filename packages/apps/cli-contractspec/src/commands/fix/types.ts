import type { fix } from '@contractspec/bundle.workspace';

export interface FixCommandOptions {
  target?: string;
  fromCi?: string;
  strategy?: fix.FixStrategyType;
  ai?: boolean;
  dryRun?: boolean;
  yes?: boolean;
}
