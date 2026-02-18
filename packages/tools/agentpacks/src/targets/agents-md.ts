import { resolve } from 'path';
import type { FeatureId } from '../core/config.js';
import {
  BaseTarget,
  type GenerateOptions,
  type GenerateResult,
} from './base-target.js';
import { getRootRules } from '../features/rules.js';
import { writeGeneratedFile } from '../utils/filesystem.js';

/**
 * AGENTS.md target generator.
 * Generates a universal AGENTS.md file from root rules.
 * This is auto-included and consumed by OpenCode, Codex, and any AGENTS.md-aware tool.
 */
export class AgentsMdTarget extends BaseTarget {
  readonly id = 'agentsmd';
  readonly name = 'AGENTS.md';

  readonly supportedFeatures: FeatureId[] = ['rules'];

  generate(options: GenerateOptions): GenerateResult {
    const { projectRoot, baseDir, features } = options;
    const root = resolve(projectRoot, baseDir);
    const filesWritten: string[] = [];
    const warnings: string[] = [];

    const rootRules = getRootRules(features.rules);

    if (rootRules.length === 0) {
      warnings.push('No root rules found. AGENTS.md will not be generated.');
      return this.createResult(filesWritten, [], warnings);
    }

    const sections = rootRules.map((r) => r.content);
    const content = sections.join('\n\n');

    const filepath = resolve(root, 'AGENTS.md');
    writeGeneratedFile(filepath, content);
    filesWritten.push(filepath);

    return this.createResult(filesWritten, [], warnings);
  }
}
