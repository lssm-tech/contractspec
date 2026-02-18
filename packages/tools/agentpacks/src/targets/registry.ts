import type { BaseTarget } from './base-target.js';
import { OpenCodeTarget } from './opencode.js';
import { CursorTarget } from './cursor.js';
import { ClaudeCodeTarget } from './claude-code.js';
import { CodexCliTarget } from './codex-cli.js';
import { GeminiCliTarget } from './gemini-cli.js';
import { CopilotTarget } from './copilot.js';
import { AgentsMdTarget } from './agents-md.js';

/**
 * Registry of all available target generators.
 */
const TARGETS: BaseTarget[] = [
  new OpenCodeTarget(),
  new CursorTarget(),
  new ClaudeCodeTarget(),
  new CodexCliTarget(),
  new GeminiCliTarget(),
  new CopilotTarget(),
  new AgentsMdTarget(),
];

const targetMap = new Map<string, BaseTarget>(TARGETS.map((t) => [t.id, t]));

/**
 * Get a target by its identifier.
 */
export function getTarget(id: string): BaseTarget | undefined {
  return targetMap.get(id);
}

/**
 * Get all registered targets.
 */
export function getAllTargets(): BaseTarget[] {
  return [...TARGETS];
}

/**
 * Get targets by their identifiers. Returns targets in the given order.
 */
export function getTargets(ids: string[]): BaseTarget[] {
  return ids
    .map((id) => targetMap.get(id))
    .filter((t): t is BaseTarget => t !== undefined);
}

/**
 * List all available target identifiers.
 */
export function listTargetIds(): string[] {
  return TARGETS.map((t) => t.id);
}
