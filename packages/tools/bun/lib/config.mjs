import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { glob } from 'glob';

const DEFAULT_ENTRY = [
  'src/**/*.ts',
  'src/**/*.tsx',
  '!src/**/*.test.ts',
  '!src/**/*.test.tsx',
  '!src/**/*.spec.ts',
  '!src/**/__tests__/**',
  '!src/**/*.stories.ts',
  '!src/**/*.stories.tsx',
  '!src/**/*.cy.ts',
  '!src/**/*.cy.tsx',
  '!cypress/**',
];

const NODE_BUILTIN_IMPORT =
  /from\s+["']node:[^"']+["']|require\(["']node:[^"']+["']\)|from\s+["'](?:fs|path|crypto|stream|os|url|util|http|https|zlib|events|child_process|net|tls|worker_threads)(?:\/[^"']*)?["']/;

const CONFIG_CANDIDATES = [
  'tsdown.config.ts',
  'tsdown.config.mjs',
  'tsdown.config.js',
  'tsdown.config.cjs',
  'bun.config.ts',
  'bun.config.mjs',
  'bun.config.js',
  'bun.config.cjs',
];

export function resolveConfigPath(cwd) {
  for (const fileName of CONFIG_CANDIDATES) {
    const configPath = path.join(cwd, fileName);
    if (existsSync(configPath)) {
      return configPath;
    }
  }

  return null;
}

export async function loadUserConfig(cwd) {
  const configPath = resolveConfigPath(cwd);

  if (!configPath) {
    return {
      configPath: null,
      config: {},
    };
  }

  const configModule = await import(pathToFileURL(configPath).href);
  let loadedConfig = configModule.default ?? {};
  if (typeof loadedConfig === 'function') {
    loadedConfig = await loadedConfig({});
  }

  return {
    configPath,
    config: loadedConfig ?? {},
  };
}

export async function resolveEntries(cwd, configEntry) {
  const entryPatterns =
    Array.isArray(configEntry) && configEntry.length > 0
      ? configEntry
      : DEFAULT_ENTRY;
  const includes = entryPatterns.filter((pattern) => !pattern.startsWith('!'));
  const excludes = entryPatterns
    .filter((pattern) => pattern.startsWith('!'))
    .map((pattern) => pattern.slice(1));

  const entries = new Set();
  for (const includePattern of includes) {
    const matches = await glob(includePattern, {
      cwd,
      nodir: true,
      ignore: excludes,
      windowsPathsNoEscape: true,
    });
    for (const match of matches) {
      entries.add(match.replaceAll('\\', '/'));
    }
  }

  return Array.from(entries).sort();
}

function inferTargetsFromKind(kind) {
  if (kind === 'frontend-react') {
    return { node: false, browser: true };
  }

  if (kind === 'backend-node' || kind === 'backend-bun') {
    return { node: true, browser: false };
  }

  return { node: true, browser: true };
}

async function hasNodeOnlySignals(cwd) {
  const srcRoot = path.join(cwd, 'src');
  const sourceFiles = await glob('src/**/*.{ts,tsx,js,jsx,mjs,cjs}', {
    cwd,
    nodir: true,
    windowsPathsNoEscape: true,
  });

  if (!existsSync(srcRoot) || sourceFiles.length === 0) {
    return false;
  }

  for (const sourceFile of sourceFiles) {
    const absolutePath = path.join(cwd, sourceFile);
    const content = await readFile(absolutePath, 'utf8');
    if (NODE_BUILTIN_IMPORT.test(content)) {
      return true;
    }
  }

  return false;
}

export async function normalizeBuildConfig(cwd, config) {
  const kind =
    typeof config.kind === 'string'
      ? config.kind
      : config.platform === 'browser'
        ? 'frontend-react'
        : config.platform === 'node'
          ? 'backend-node'
          : 'shared';
  const targets = {
    ...inferTargetsFromKind(kind),
    ...(config.targets ?? {}),
  };

  if (
    kind === 'shared' &&
    targets.browser !== false &&
    (await hasNodeOnlySignals(cwd))
  ) {
    targets.browser = false;
    targets.node = true;
  }

  if (!targets.node && !targets.browser) {
    targets.node = true;
  }

  return {
    kind,
    targets,
    external: Array.isArray(config.external) ? config.external : [],
    tsconfigForTypes:
      config.tsconfigTypes ??
      (existsSync(path.join(cwd, 'tsconfig.build.json'))
        ? 'tsconfig.build.json'
        : 'tsconfig.json'),
    entry:
      Array.isArray(config.entry) && config.entry.length > 0
        ? config.entry
        : DEFAULT_ENTRY,
  };
}

export function selectEntriesForTarget(entries, target) {
  if (target === 'node') {
    return entries.filter(
      (entry) => !entry.includes('.browser.') && !entry.includes('.web.')
    );
  }

  if (target === 'browser') {
    return entries.filter(
      (entry) => !entry.includes('.node.') && !entry.includes('.bun.')
    );
  }

  return entries.filter((entry) => !entry.includes('.native.'));
}

export function inferBuildRoot(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return '.';
  }

  const directories = entries.map((entry) => {
    const normalized = entry.replaceAll('\\', '/');
    const parts = normalized.split('/');
    parts.pop();
    return parts;
  });

  let shared = directories[0] ?? [];
  for (const directory of directories.slice(1)) {
    let cursor = 0;
    const max = Math.min(shared.length, directory.length);
    while (cursor < max && shared[cursor] === directory[cursor]) {
      cursor += 1;
    }
    shared = shared.slice(0, cursor);
    if (shared.length === 0) {
      break;
    }
  }

  return shared.length > 0 ? shared.join('/') : '.';
}
