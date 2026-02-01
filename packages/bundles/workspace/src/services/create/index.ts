/**
 * Spec Creation Service
 *
 * Unifies manual and AI-assisted spec creation.
 */

import { AIGenerator } from './ai-generator';
import * as templates from './templates';
import type { ResolvedContractsrcConfig } from '@contractspec/lib.contracts';

export class SpecCreatorService {
  public readonly ai: AIGenerator;
  public readonly templates = templates;

  constructor(config: ResolvedContractsrcConfig) {
    this.ai = new AIGenerator(config);
  }
}

export * from './ai-generator';
export * from './templates';

export function createSpecCreator(
  config: ResolvedContractsrcConfig
): SpecCreatorService {
  return new SpecCreatorService(config);
}
