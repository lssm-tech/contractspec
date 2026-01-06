import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import yaml from 'js-yaml';
import { findWorkspaceRoot } from '@contractspec/bundle.workspace';
import { loadConfig as loadBaseConfig } from '../../utils/config';

export interface VibeConfig {
  canonicalRoot: string;
  workRoot: string;
  generatedRoot: string;
  alwaysInjectFiles: string[];
  contextExportAllowlist: string[];
}

export const DEFAULT_VIBE_CONFIG: VibeConfig = {
  canonicalRoot: 'contracts',
  workRoot: '.contractspec/work',
  generatedRoot: 'src/generated',
  alwaysInjectFiles: [],
  contextExportAllowlist: [],
};

export async function loadVibeConfig(): Promise<VibeConfig> {
  const cwd = process.cwd();
  const root = findWorkspaceRoot(cwd) || cwd;
  
  // Try loading from .contractspec/vibe/config.json, .yaml, or .yml
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
              break; // Found one, stop looking
          } catch (e) {
              console.warn(`Warning: Failed to parse ${p}`, e);
          }
      }
  }

  // Also verify if there is any overlap with base config (optional, defined in plan)
  // For now we just merge defaults with local config
  const merged = { ...DEFAULT_VIBE_CONFIG, ...localConfig };
  
  return merged;
}
