import { readFileSync, existsSync } from 'fs';
import { basename, join } from 'path';
import { listDirs } from '../utils/filesystem.js';
import {
  parseFrontmatter,
  serializeFrontmatter,
} from '../utils/frontmatter.js';

const SKILL_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SKILL_NAME_MAX_LENGTH = 64;

/**
 * Skill frontmatter data.
 */
export interface SkillFrontmatter {
  name?: string;
  description?: string;
  'allowed-tools'?: string[];
  compatibility?: unknown;
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
 * Build output frontmatter for a SKILL.md file.
 * Preserves all metadata while ensuring `name` exists.
 */
export function buildSkillFrontmatter(
  skill: ParsedSkill
): Record<string, unknown> {
  return {
    ...skill.meta,
    name: skill.name,
  };
}

/**
 * Serialize a parsed skill back to SKILL.md format.
 */
export function serializeSkill(skill: ParsedSkill): string {
  return serializeFrontmatter(buildSkillFrontmatter(skill), skill.content);
}

/**
 * Normalize imported SKILL.md content to AgentSkills-compatible minimum metadata.
 */
export function normalizeImportedSkillMarkdown(
  source: string,
  skillName: string
): { content: string; addedDescription: boolean } {
  const { data, content } = parseFrontmatter<SkillFrontmatter>(source);
  const normalized: Record<string, unknown> = {
    ...data,
    name: skillName,
  };

  let addedDescription = false;
  const description = normalized.description;
  if (typeof description !== 'string' || description.trim().length === 0) {
    normalized.description = `Imported skill: ${skillName}`;
    addedDescription = true;
  }

  return {
    content: serializeFrontmatter(normalized, content),
    addedDescription,
  };
}

/**
 * Validate AgentSkills frontmatter requirements for a parsed skill.
 */
export function validateAgentSkillsFrontmatter(skill: ParsedSkill): string[] {
  const errors: string[] = [];
  const dirName = basename(skill.sourceDir);

  const declaredName = skill.meta.name;
  if (typeof declaredName !== 'string' || declaredName.trim().length === 0) {
    errors.push('Missing required frontmatter field "name".');
  } else {
    if (declaredName.length > SKILL_NAME_MAX_LENGTH) {
      errors.push(
        `Invalid "name": must be at most ${SKILL_NAME_MAX_LENGTH} characters.`
      );
    }

    if (!SKILL_NAME_PATTERN.test(declaredName)) {
      errors.push(
        'Invalid "name": use lowercase letters, numbers, and single hyphens only.'
      );
    }

    if (declaredName !== dirName) {
      errors.push(
        `Invalid "name": must match containing directory "${dirName}".`
      );
    }
  }

  const description = skill.meta.description;
  if (typeof description !== 'string' || description.trim().length === 0) {
    errors.push('Missing required frontmatter field "description".');
  }

  const allowedTools = skill.meta['allowed-tools'];
  if (
    allowedTools !== undefined &&
    (!Array.isArray(allowedTools) ||
      allowedTools.some(
        (tool) => typeof tool !== 'string' || tool.length === 0
      ))
  ) {
    errors.push(
      'Invalid "allowed-tools": expected an array of non-empty strings.'
    );
  }

  return errors;
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
