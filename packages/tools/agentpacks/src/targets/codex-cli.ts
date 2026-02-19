import { resolve, join } from 'path';
import type { FeatureId } from '../core/config.js';
import {
  BaseTarget,
  type GenerateOptions,
  type GenerateResult,
} from './base-target.js';
import { ruleMatchesTarget } from '../features/rules.js';
import { skillMatchesTarget } from '../features/skills.js';
import {
  writeGeneratedFile,
  removeIfExists,
  ensureDir,
} from '../utils/filesystem.js';

const TARGET_ID = 'codexcli';

/**
 * Codex CLI target generator.
 * Generates: .codex/memories/, .codex/skills/
 */
export class CodexCliTarget extends BaseTarget {
  readonly id = TARGET_ID;
  readonly name = 'Codex CLI';

  readonly supportedFeatures: FeatureId[] = ['rules', 'skills', 'mcp', 'hooks'];

  generate(options: GenerateOptions): GenerateResult {
    const { projectRoot, baseDir, features, enabledFeatures, deleteExisting } =
      options;
    const root = resolve(projectRoot, baseDir);
    const effective = this.getEffectiveFeatures(enabledFeatures);
    const filesWritten: string[] = [];
    const filesDeleted: string[] = [];
    const warnings: string[] = [];

    const codexDir = resolve(root, '.codex');

    if (effective.includes('rules')) {
      const memoriesDir = resolve(codexDir, 'memories');
      if (deleteExisting) {
        removeIfExists(memoriesDir);
        filesDeleted.push(memoriesDir);
      }
      ensureDir(memoriesDir);

      const rules = features.rules.filter((r) =>
        ruleMatchesTarget(r, TARGET_ID)
      );
      for (const rule of rules) {
        // Codex uses flat memories directory (no root/detail distinction)
        const filepath = join(memoriesDir, `${rule.name}.md`);
        writeGeneratedFile(filepath, rule.content);
        filesWritten.push(filepath);
      }
    }

    if (effective.includes('skills')) {
      const skillsDir = resolve(codexDir, 'skills');
      if (deleteExisting) {
        removeIfExists(skillsDir);
        filesDeleted.push(skillsDir);
      }
      ensureDir(skillsDir);

      const skills = features.skills.filter((s) =>
        skillMatchesTarget(s, TARGET_ID)
      );
      for (const skill of skills) {
        const skillSubDir = join(skillsDir, skill.name);
        ensureDir(skillSubDir);
        const filepath = join(skillSubDir, 'SKILL.md');
        writeGeneratedFile(filepath, skill.content);
        filesWritten.push(filepath);
      }
    }

    return this.createResult(filesWritten, filesDeleted, warnings);
  }
}
