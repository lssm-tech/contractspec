import { readFileSync } from 'fs';
import { basename } from 'path';
import { listFiles } from '../utils/filesystem.js';
import { parseFrontmatter } from '../utils/frontmatter.js';

/**
 * Agent/subagent frontmatter data.
 */
export interface AgentFrontmatter {
  name?: string;
  targets?: string[] | '*';
  description?: string;
  /** Per-target overrides */
  claudecode?: { model?: string; [key: string]: unknown };
  copilot?: { tools?: string[]; [key: string]: unknown };
  opencode?: {
    mode?: string;
    model?: string;
    temperature?: number;
    tools?: Record<string, boolean>;
    permission?: Record<string, Record<string, string>>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * A parsed agent with metadata and content.
 */
export interface ParsedAgent {
  name: string;
  sourcePath: string;
  packName: string;
  meta: AgentFrontmatter;
  content: string;
}

/**
 * Parse all agents from a pack's agents/ directory.
 */
export function parseAgents(
  agentsDir: string,
  packName: string
): ParsedAgent[] {
  const files = listFiles(agentsDir, { extension: '.md' });
  return files.map((filepath) => parseAgentFile(filepath, packName));
}

/**
 * Parse a single agent file.
 */
export function parseAgentFile(
  filepath: string,
  packName: string
): ParsedAgent {
  const raw = readFileSync(filepath, 'utf-8');
  const { data, content } = parseFrontmatter<AgentFrontmatter>(raw);

  return {
    name: data.name ?? basename(filepath, '.md'),
    sourcePath: filepath,
    packName,
    meta: data,
    content,
  };
}

/**
 * Check if an agent targets a specific tool.
 */
export function agentMatchesTarget(
  agent: ParsedAgent,
  targetId: string
): boolean {
  const { targets } = agent.meta;
  if (!targets || targets === '*') return true;
  if (Array.isArray(targets) && targets.includes('*')) return true;
  return Array.isArray(targets) && targets.includes(targetId);
}
