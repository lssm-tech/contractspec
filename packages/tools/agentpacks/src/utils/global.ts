/**
 * Global (user-scope) configuration paths for agentpacks and target tools.
 */
import { homedir } from 'os';
import { join, resolve } from 'path';
import { existsSync } from 'fs';

/**
 * Root directory for global agentpacks config.
 */
export function globalConfigDir(): string {
  return resolve(
    process.env.AGENTPACKS_GLOBAL_DIR ?? join(homedir(), '.agentpacks')
  );
}

/**
 * Path to the global workspace config file.
 */
export function globalConfigFile(): string {
  return join(globalConfigDir(), 'agentpacks.jsonc');
}

/**
 * Check if global config exists.
 */
export function hasGlobalConfig(): boolean {
  return existsSync(globalConfigFile());
}

/**
 * User-scope config directories for each target tool.
 * When `global: true`, targets write to these instead of project-local dirs.
 */
export function globalTargetDir(
  targetId: string,
  platform: NodeJS.Platform = process.platform
): string {
  const home = homedir();

  switch (targetId) {
    case 'opencode':
      return join(xdgConfig(platform, home), 'opencode');
    case 'cursor':
      return join(home, '.cursor');
    case 'claudecode':
      return join(home, '.claude');
    case 'codexcli':
      return join(xdgConfig(platform, home), 'codex');
    case 'geminicli':
      return join(xdgConfig(platform, home), 'gemini');
    case 'copilot':
      return join(xdgConfig(platform, home), 'github-copilot');
    default:
      return join(xdgConfig(platform, home), targetId);
  }
}

/**
 * Resolve XDG_CONFIG_HOME or platform equivalent.
 */
function xdgConfig(platform: NodeJS.Platform, home: string): string {
  if (process.env.XDG_CONFIG_HOME) {
    return process.env.XDG_CONFIG_HOME;
  }
  if (platform === 'darwin') {
    return join(home, 'Library', 'Application Support');
  }
  if (platform === 'win32') {
    return process.env.APPDATA ?? join(home, 'AppData', 'Roaming');
  }
  return join(home, '.config');
}
