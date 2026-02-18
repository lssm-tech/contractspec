import { z } from 'zod';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { parse as parseJsonc } from 'jsonc-parser';

/**
 * All supported target identifiers.
 */
export const TARGET_IDS = [
  'opencode',
  'cursor',
  'claudecode',
  'codexcli',
  'geminicli',
  'copilot',
  'agentsmd',
  'cline',
  'kilo',
  'roo',
  'qwencode',
  'kiro',
  'factorydroid',
  'antigravity',
  'junie',
  'augmentcode',
  'windsurf',
  'warp',
  'replit',
  'zed',
] as const;

export type TargetId = (typeof TARGET_IDS)[number];

/**
 * All supported feature types.
 */
export const FEATURE_IDS = [
  'rules',
  'commands',
  'agents',
  'skills',
  'hooks',
  'plugins',
  'mcp',
  'ignore',
] as const;

export type FeatureId = (typeof FEATURE_IDS)[number];

/**
 * Repository mode.
 */
export const REPO_MODES = ['repo', 'monorepo', 'metarepo'] as const;
export type RepoMode = (typeof REPO_MODES)[number];

/**
 * Pack manifest schema (pack.json).
 */
export const PackManifestSchema = z.object({
  name: z.string().min(1),
  version: z.string().default('1.0.0'),
  description: z.string().default(''),
  author: z
    .union([
      z.string(),
      z.object({ name: z.string(), email: z.string().optional() }),
    ])
    .optional(),
  tags: z.array(z.string()).default([]),
  dependencies: z.array(z.string()).default([]),
  conflicts: z.array(z.string()).default([]),
  targets: z.union([z.literal('*'), z.array(z.string())]).default('*'),
  features: z.union([z.literal('*'), z.array(z.string())]).default('*'),
});

export type PackManifest = z.infer<typeof PackManifestSchema>;

/**
 * Features can be a flat array or per-target object.
 */
const FeaturesSchema = z.union([
  z.literal('*'),
  z.array(z.string()),
  z.record(z.string(), z.union([z.literal('*'), z.array(z.string())])),
]);

/**
 * Workspace configuration schema (agentpacks.jsonc).
 */
export const WorkspaceConfigSchema = z.object({
  $schema: z.string().optional(),
  packs: z.array(z.string()).default(['./packs/default']),
  disabled: z.array(z.string()).default([]),
  targets: z.union([z.literal('*'), z.array(z.string())]).default('*'),
  features: FeaturesSchema.default('*'),
  mode: z.enum(REPO_MODES).default('repo'),
  baseDirs: z.array(z.string()).default(['.']),
  global: z.boolean().default(false),
  delete: z.boolean().default(true),
  verbose: z.boolean().default(false),
  silent: z.boolean().default(false),
  overrides: z.record(z.string(), z.record(z.string(), z.string())).default({}),
  sources: z
    .array(
      z.object({
        source: z.string(),
        packs: z.array(z.string()).optional(),
        skills: z.array(z.string()).optional(),
      })
    )
    .default([]),
});

export type WorkspaceConfig = z.infer<typeof WorkspaceConfigSchema>;

/**
 * Configuration file names in order of precedence.
 */
const CONFIG_FILES = ['agentpacks.local.jsonc', 'agentpacks.jsonc'] as const;

/**
 * Load workspace configuration from the project root.
 */
export function loadWorkspaceConfig(projectRoot: string): WorkspaceConfig {
  for (const filename of CONFIG_FILES) {
    const filepath = resolve(projectRoot, filename);
    if (existsSync(filepath)) {
      const raw = readFileSync(filepath, 'utf-8');
      const parsed = parseJsonc(raw);
      return WorkspaceConfigSchema.parse(parsed);
    }
  }

  return WorkspaceConfigSchema.parse({});
}

/**
 * Load pack manifest from a pack directory.
 */
export function loadPackManifest(packDir: string): PackManifest {
  const filepath = resolve(packDir, 'pack.json');
  if (!existsSync(filepath)) {
    const dirName = packDir.split('/').pop() ?? 'unknown';
    return PackManifestSchema.parse({ name: dirName });
  }

  const raw = readFileSync(filepath, 'utf-8');
  const parsed = JSON.parse(raw) as unknown;
  return PackManifestSchema.parse(parsed);
}

/**
 * Resolve which features to generate for a given target.
 */
export function resolveFeatures(
  config: WorkspaceConfig,
  targetId: string
): FeatureId[] {
  const { features } = config;

  if (features === '*') {
    return [...FEATURE_IDS];
  }

  if (Array.isArray(features)) {
    if (features.includes('*')) return [...FEATURE_IDS];
    return features.filter((f): f is FeatureId =>
      (FEATURE_IDS as readonly string[]).includes(f)
    );
  }

  // Per-target object
  const targetFeatures = features[targetId];
  if (!targetFeatures) return [];

  if (targetFeatures === '*') return [...FEATURE_IDS];
  if (Array.isArray(targetFeatures) && targetFeatures.includes('*'))
    return [...FEATURE_IDS];
  return (targetFeatures as string[]).filter((f): f is FeatureId =>
    (FEATURE_IDS as readonly string[]).includes(f)
  );
}

/**
 * Resolve which targets to generate for.
 */
export function resolveTargets(config: WorkspaceConfig): string[] {
  if (config.targets === '*') return [...TARGET_IDS];
  return config.targets;
}
