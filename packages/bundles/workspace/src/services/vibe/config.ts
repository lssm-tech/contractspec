/**
 * Vibe configuration loader.
 *
 * Loads vibe configuration from .contractspec/vibe/config.* files.
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import yaml from 'js-yaml';
import { findWorkspaceRoot } from '../../adapters/workspace';
import type { VibeConfig } from './types';
import { DEFAULT_VIBE_CONFIG } from './types';

export { DEFAULT_VIBE_CONFIG };

/**
 * Load vibe configuration from workspace.
 * Merges defaults with any user-provided config.
 */
export async function loadVibeConfig(cwd?: string): Promise<VibeConfig> {
  const workingDir = cwd ?? process.cwd();
  const root = findWorkspaceRoot(workingDir) ?? workingDir;

  const possiblePaths = [
    join(root, '.contractspec', 'vibe', 'config.json'),
    join(root, '.contractspec', 'vibe', 'config.yaml'),
    join(root, '.contractspec', 'vibe', 'config.yml'),
  ];

  let localConfig: Partial<VibeConfig> = {};

  for (const p of possiblePaths) {
    if (existsSync(p)) {
      try {
        const content = await readFile(p, 'utf-8');
        if (p.endsWith('.json')) {
          localConfig = JSON.parse(content);
        } else {
          localConfig = yaml.load(content) as Partial<VibeConfig>;
        }
        break;
      } catch (e) {
        console.warn(`Warning: Failed to parse ${p}`, e);
      }
    }
  }

  return { ...DEFAULT_VIBE_CONFIG, ...localConfig };
}
