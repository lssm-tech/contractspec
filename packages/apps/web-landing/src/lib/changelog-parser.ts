import fs from 'fs';
import path from 'path';
import { type ChangelogConfig, isLayerAllowed } from '@/lib/changelog-config';

const VERSION_HEADER_REGEX =
  /^##\s+\[?(\d+\.\d+\.\d+)\]?(?:\s*-\s*(\d{4}-\d{2}-\d{2}))?/;
const DATE_REGEX = /(\d{4}-\d{2}-\d{2})/;
const DEFAULT_DATE = '2025-01-01';

export interface ParsedPackageRelease {
  version: string;
  date: string;
  isBreaking: boolean;
  packageName: string;
  packageSlug: string;
  layer: string;
  changes: string[];
}

interface ChangelogFileMeta {
  filePath: string;
  packageName: string;
  packageSlug: string;
  layer: string;
}

function normalizeChangeLine(line: string): string | null {
  const trimmed = line.trim();
  if (!/^[-*]\s+/.test(trimmed)) {
    return null;
  }

  const normalized = trimmed.replace(/^[-*]\s+/, '').trim();
  if (!normalized) {
    return null;
  }

  const lower = normalized.toLowerCase();
  if (
    lower.includes('updated dependencies') ||
    lower.includes('version bump')
  ) {
    return null;
  }

  return normalized;
}

function resolvePackageName(changelogPath: string): string {
  const packageDir = path.dirname(changelogPath);
  const packageJsonPath = path.join(packageDir, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    return path.basename(packageDir);
  }

  try {
    const packageJsonRaw = fs.readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonRaw) as { name?: string };
    return packageJson.name ?? path.basename(packageDir);
  } catch {
    return path.basename(packageDir);
  }
}

function collectChangelogFiles(config: ChangelogConfig): ChangelogFileMeta[] {
  const files = fs.globSync(config.changelogGlob);

  return files
    .map((filePath) => {
      const relativePath = path.relative(config.monorepoRoot, filePath);
      const [packagesDir, layer, packageSlug] = relativePath.split(path.sep);

      if (packagesDir !== 'packages' || !layer || !packageSlug) {
        return null;
      }

      if (!isLayerAllowed(layer, config)) {
        return null;
      }

      return {
        filePath,
        packageName: resolvePackageName(filePath),
        packageSlug,
        layer,
      } satisfies ChangelogFileMeta;
    })
    .filter((entry): entry is ChangelogFileMeta => Boolean(entry));
}

function parseSingleFile(fileMeta: ChangelogFileMeta): ParsedPackageRelease[] {
  const content = fs.readFileSync(fileMeta.filePath, 'utf-8');
  const lines = content.split('\n');
  const releases: ParsedPackageRelease[] = [];

  let currentVersion: string | null = null;
  let currentDate: string | null = null;
  let currentIsBreaking = false;
  let currentChanges: string[] = [];

  const flush = () => {
    if (!currentVersion || currentChanges.length === 0) {
      return;
    }

    const uniqueChanges = Array.from(new Set(currentChanges));
    if (uniqueChanges.length === 0) {
      return;
    }

    releases.push({
      version: currentVersion,
      date: currentDate ?? DEFAULT_DATE,
      isBreaking: currentIsBreaking,
      packageName: fileMeta.packageName,
      packageSlug: fileMeta.packageSlug,
      layer: fileMeta.layer,
      changes: uniqueChanges,
    });
  };

  for (const line of lines) {
    const versionMatch = line.trim().match(VERSION_HEADER_REGEX);
    if (versionMatch) {
      flush();
      currentVersion = versionMatch[1];
      currentDate = versionMatch[2] ?? null;
      currentIsBreaking = false;
      currentChanges = [];
      continue;
    }

    if (!currentVersion) {
      continue;
    }

    if (!currentDate) {
      const dateMatch = line.match(DATE_REGEX);
      if (dateMatch) {
        currentDate = dateMatch[1];
      }
    }

    const normalizedChange = normalizeChangeLine(line);
    if (normalizedChange) {
      currentChanges.push(normalizedChange);
      if (normalizedChange.toLowerCase().includes('breaking change')) {
        currentIsBreaking = true;
      }
    }
  }

  flush();
  return releases;
}

export function parseChangelogReleases(
  config: ChangelogConfig
): ParsedPackageRelease[] {
  const files = collectChangelogFiles(config);

  const releases: ParsedPackageRelease[] = [];
  for (const file of files) {
    releases.push(...parseSingleFile(file));
  }

  return releases;
}
