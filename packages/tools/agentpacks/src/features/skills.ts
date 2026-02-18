import { readFileSync, existsSync } from 'fs';
import { basename, join } from 'path';
import { listDirs } from '../utils/filesystem.js';
import { parseFrontmatter } from '../utils/frontmatter.js';

/**
 * Skill frontmatter data.
 */
export interface SkillFrontmatter {
  name?: string;
  description?: string;
  targets?: string[] | '*';
  /** Per-target overrides */
  claudecode?: { 'allowed-tools'?: string[]; [key: string]: unknown };
  codexcli?: { 'short-description'?: string; [key: string]: unknown };
  [key: string]: unknown;
}

/**
 * A parsed skill with metadata, content, and associated files.
 */
export interface ParsedSkill {
  name: string;
  sourcePath: string;
  sourceDir: string;
  packName: string;
  meta: SkillFrontmatter;
  content: string;
}

/**
 * Parse all skills from a pack's skills/ directory.
 * Each skill is a subdirectory containing a SKILL.md file.
 */
export function parseSkills(
  skillsDir: string,
  packName: string
): ParsedSkill[] {
  const dirs = listDirs(skillsDir);
  const skills: ParsedSkill[] = [];

  for (const dir of dirs) {
    const skillMd = join(dir, 'SKILL.md');
    if (existsSync(skillMd)) {
      skills.push(parseSkillFile(skillMd, dir, packName));
    }
  }

  return skills;
}

/**
 * Parse a single SKILL.md file.
 */
export function parseSkillFile(
  filepath: string,
  skillDir: string,
  packName: string
): ParsedSkill {
  const raw = readFileSync(filepath, 'utf-8');
  const { data, content } = parseFrontmatter<SkillFrontmatter>(raw);

  return {
    name: data.name ?? basename(skillDir),
    sourcePath: filepath,
    sourceDir: skillDir,
    packName,
    meta: data,
    content,
  };
}

/**
 * Check if a skill targets a specific tool.
 */
export function skillMatchesTarget(
  skill: ParsedSkill,
  targetId: string
): boolean {
  const { targets } = skill.meta;
  if (!targets || targets === '*') return true;
  if (Array.isArray(targets) && targets.includes('*')) return true;
  return Array.isArray(targets) && targets.includes(targetId);
}
