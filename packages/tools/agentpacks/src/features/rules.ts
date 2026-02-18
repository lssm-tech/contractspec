import { readFileSync } from 'fs';
import { basename } from 'path';
import { listFiles } from '../utils/filesystem.js';
import { parseFrontmatter } from '../utils/frontmatter.js';

/**
 * Rule frontmatter data (compatible with rulesync format).
 */
export interface RuleFrontmatter {
  root?: boolean;
  localRoot?: boolean;
  targets?: string[] | '*';
  description?: string;
  globs?: string[];
  /** Per-target overrides */
  cursor?: Record<string, unknown>;
  claudecode?: Record<string, unknown>;
  opencode?: Record<string, unknown>;
  copilot?: Record<string, unknown>;
  agentsmd?: Record<string, unknown>;
  antigravity?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * A parsed rule with metadata and content.
 */
export interface ParsedRule {
  /** Filename without extension */
  name: string;
  /** Source file path */
  sourcePath: string;
  /** Pack that owns this rule */
  packName: string;
  /** Frontmatter metadata */
  meta: RuleFrontmatter;
  /** Markdown body content */
  content: string;
}

/**
 * Parse all rules from a pack's rules/ directory.
 */
export function parseRules(rulesDir: string, packName: string): ParsedRule[] {
  const files = listFiles(rulesDir, { extension: '.md' });
  return files.map((filepath) => parseRuleFile(filepath, packName));
}

/**
 * Parse a single rule file.
 */
export function parseRuleFile(filepath: string, packName: string): ParsedRule {
  const raw = readFileSync(filepath, 'utf-8');
  const { data, content } = parseFrontmatter<RuleFrontmatter>(raw);

  return {
    name: basename(filepath, '.md'),
    sourcePath: filepath,
    packName,
    meta: data,
    content,
  };
}

/**
 * Check if a rule targets a specific tool.
 */
export function ruleMatchesTarget(rule: ParsedRule, targetId: string): boolean {
  const { targets } = rule.meta;
  if (!targets || targets === '*') return true;
  if (Array.isArray(targets) && targets.includes('*')) return true;
  return Array.isArray(targets) && targets.includes(targetId);
}

/**
 * Filter rules that have root: true.
 */
export function getRootRules(rules: ParsedRule[]): ParsedRule[] {
  return rules.filter((r) => r.meta.root === true);
}

/**
 * Filter rules that have root: false or undefined.
 */
export function getDetailRules(rules: ParsedRule[]): ParsedRule[] {
  return rules.filter((r) => r.meta.root !== true);
}
