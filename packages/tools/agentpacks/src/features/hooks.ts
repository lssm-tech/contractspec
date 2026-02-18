import { join } from 'path';
import { readJsonOrNull } from '../utils/filesystem.js';

/**
 * A single hook entry.
 */
export interface HookEntry {
  type?: 'command' | 'prompt';
  command?: string;
  matcher?: string;
  [key: string]: unknown;
}

/**
 * Hook events grouped by lifecycle event name.
 */
export type HookEvents = Record<string, HookEntry[]>;

/**
 * Parsed hooks with shared and per-target overrides.
 */
export interface ParsedHooks {
  packName: string;
  sourcePath: string;
  version?: number;
  /** Shared hooks (all targets) */
  shared: HookEvents;
  /** Per-target hook overrides */
  targetOverrides: Record<string, HookEvents>;
}

/**
 * Raw hooks.json structure.
 */
interface RawHooksJson {
  version?: number;
  hooks?: HookEvents;
  cursor?: { hooks?: HookEvents };
  claudecode?: { hooks?: HookEvents };
  opencode?: { hooks?: HookEvents };
  [key: string]: unknown;
}

/** Known per-target override keys in hooks.json */
const TARGET_OVERRIDE_KEYS = ['cursor', 'claudecode', 'opencode'] as const;

/**
 * Parse hooks from a pack's hooks/ directory.
 */
export function parseHooks(
  packDir: string,
  packName: string
): ParsedHooks | null {
  const hooksPath = join(packDir, 'hooks', 'hooks.json');
  const raw = readJsonOrNull<RawHooksJson>(hooksPath);
  if (!raw) return null;

  const shared: HookEvents = raw.hooks ?? {};
  const targetOverrides: Record<string, HookEvents> = {};

  for (const key of TARGET_OVERRIDE_KEYS) {
    const override = raw[key];
    if (
      override &&
      typeof override === 'object' &&
      'hooks' in override &&
      override.hooks
    ) {
      targetOverrides[key] = override.hooks;
    }
  }

  return {
    packName,
    sourcePath: hooksPath,
    version: raw.version,
    shared,
    targetOverrides,
  };
}

/**
 * Resolve hooks for a specific target by merging shared + target overrides.
 */
export function resolveHooksForTarget(
  hooks: ParsedHooks,
  targetId: string
): HookEvents {
  const merged: HookEvents = {};

  // Start with shared hooks
  for (const [event, entries] of Object.entries(hooks.shared)) {
    merged[event] = [...entries];
  }

  // Merge target-specific overrides
  const overrides = hooks.targetOverrides[targetId];
  if (overrides) {
    for (const [event, entries] of Object.entries(overrides)) {
      merged[event] = [...(merged[event] ?? []), ...entries];
    }
  }

  return merged;
}
