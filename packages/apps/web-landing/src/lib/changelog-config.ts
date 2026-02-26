import path from 'path';

const DEFAULT_INCLUDE_LAYERS = [
  'apps',
  'apps-registry',
  'bundles',
  'integrations',
  'libs',
  'modules',
];
const DEFAULT_EXCLUDE_LAYERS = ['examples', 'tools'];
const DEFAULT_PAGE_SIZE = 20;

export interface ChangelogConfig {
  monorepoRoot: string;
  changelogGlob: string;
  includeLayers: string[];
  excludeLayers: string[];
  defaultPageSize: number;
}

function parseCsvValue(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parsePositiveInteger(
  value: string | undefined,
  fallback: number
): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export function resolveChangelogConfig(): ChangelogConfig {
  const monorepoRoot = path.resolve(process.cwd(), '../../..');

  const includeLayers = parseCsvValue(process.env.CHANGELOG_INCLUDE_LAYERS);
  const excludeLayers = parseCsvValue(process.env.CHANGELOG_EXCLUDE_LAYERS);

  return {
    monorepoRoot,
    changelogGlob: path.join(
      monorepoRoot,
      'packages',
      '*',
      '*',
      'CHANGELOG.md'
    ),
    includeLayers:
      includeLayers.length > 0 ? includeLayers : [...DEFAULT_INCLUDE_LAYERS],
    excludeLayers:
      excludeLayers.length > 0 ? excludeLayers : [...DEFAULT_EXCLUDE_LAYERS],
    defaultPageSize: parsePositiveInteger(
      process.env.CHANGELOG_DEFAULT_PAGE_SIZE,
      DEFAULT_PAGE_SIZE
    ),
  };
}

export function isLayerAllowed(
  layer: string,
  config: ChangelogConfig
): boolean {
  if (
    config.includeLayers.length > 0 &&
    !config.includeLayers.includes(layer)
  ) {
    return false;
  }

  return !config.excludeLayers.includes(layer);
}

export function changelogConfigToCacheKey(config: ChangelogConfig): string {
  return JSON.stringify({
    monorepoRoot: config.monorepoRoot,
    changelogGlob: config.changelogGlob,
    includeLayers: config.includeLayers,
    excludeLayers: config.excludeLayers,
    defaultPageSize: config.defaultPageSize,
  });
}
