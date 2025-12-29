/**
 * Spec Creation Service
 *
 * Unifies manual and AI-assisted spec creation.
 */

import { AIGenerator } from './ai-generator';
import * as templates from './templates';
import type { WorkspaceConfig } from '@contractspec/module.workspace';

export class SpecCreatorService {
  public readonly ai: AIGenerator;
  public readonly templates = templates;

  constructor(config: WorkspaceConfig) {
    this.ai = new AIGenerator(config);
  }
}

export * from './ai-generator';
export * from './templates';

export function createSpecCreator(config: WorkspaceConfig): SpecCreatorService {
  return new SpecCreatorService(config);
}
