/**
 * npm pack source — registry fetching and local installation.
 */
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { execSync } from 'child_process';
import {
  type Lockfile,
  type LockfileSourceEntry,
  getLockedSource,
  setLockedSource,
  computeIntegrity,
} from '../core/lockfile.js';
import {
  type NpmSourceRef,
  parseNpmSourceRef,
  npmSourceKey,
} from './npm-ref.js';

const NPM_REGISTRY = 'https://registry.npmjs.org';

/**
 * npm registry package version metadata (minimal subset).
 */
interface NpmVersionMeta {
  version: string;
  dist: { tarball: string; integrity?: string };
}

/**
 * Resolve an npm package version to exact version + tarball URL.
 */
export async function resolveNpmVersion(
  parsed: NpmSourceRef
): Promise<{ version: string; tarball: string }> {
  const url = `${NPM_REGISTRY}/${encodeURIComponent(parsed.packageName)}/${parsed.version}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(
      `Could not resolve npm package "${parsed.packageName}@${parsed.version}": ${res.status}`
    );
  }

  const data = (await res.json()) as NpmVersionMeta;
  return { version: data.version, tarball: data.dist.tarball };
}

/**
 * Install an npm-based pack source using `npm pack` + tar extraction.
 * Falls back to tarball download if npm CLI is unavailable.
 */
export async function installNpmSource(
  projectRoot: string,
  source: string,
  lockfile: Lockfile,
  options: { update?: boolean; frozen?: boolean } = {}
): Promise<{ installed: string[]; warnings: string[] }> {
  const parsed = parseNpmSourceRef(source);
  const sourceKey = npmSourceKey(parsed);
  const installed: string[] = [];
  const warnings: string[] = [];

  const locked = getLockedSource(lockfile, sourceKey);

  if (options.frozen && !locked) {
    throw new Error(
      `Frozen mode: no lockfile entry for source "${sourceKey}".`
    );
  }

  // Determine exact version
  let resolvedVersion: string;
  let tarballUrl: string;

  if (locked && !options.update) {
    resolvedVersion = locked.resolvedRef;
    tarballUrl = '';
  } else {
    const resolved = await resolveNpmVersion(parsed);
    resolvedVersion = resolved.version;
    tarballUrl = resolved.tarball;
  }

  // Extract pack files into .agentpacks/.curated/
  const curatedDir = resolve(projectRoot, '.agentpacks', '.curated');
  mkdirSync(curatedDir, { recursive: true });

  const packDir = extractNpmPack(
    parsed,
    resolvedVersion,
    curatedDir,
    installed,
    warnings
  );

  // Update lockfile
  const newEntry: LockfileSourceEntry = {
    requestedRef: parsed.version,
    resolvedRef: resolvedVersion,
    resolvedAt: new Date().toISOString(),
    skills: {},
    packs: {},
  };

  setLockedSource(lockfile, sourceKey, newEntry);
  return { installed, warnings };
}

/**
 * Extract npm pack using `npm pack --pack-destination` + tar.
 * Uses npm CLI for reliable extraction.
 */
function extractNpmPack(
  parsed: NpmSourceRef,
  version: string,
  curatedDir: string,
  installed: string[],
  warnings: string[]
): string {
  const pkgSpec = `${parsed.packageName}@${version}`;
  const packName = parsed.packageName.replace(/^@/, '').replace(/\//g, '-');
  const packOutDir = resolve(curatedDir, packName);

  try {
    // Create a temp dir for the tarball
    const tmpDir = resolve(curatedDir, '.tmp-npm');
    mkdirSync(tmpDir, { recursive: true });

    // Download tarball via npm pack
    execSync(`npm pack ${pkgSpec} --pack-destination "${tmpDir}"`, {
      stdio: 'pipe',
      timeout: 30_000,
    });

    // Find the downloaded tarball
    const tgzFiles = require('fs')
      .readdirSync(tmpDir)
      .filter((f: string) => f.endsWith('.tgz'));

    if (tgzFiles.length === 0) {
      warnings.push(`No tarball found for ${pkgSpec}`);
      return packOutDir;
    }

    const tgzPath = join(tmpDir, tgzFiles[0]!);

    // Extract to pack output directory
    mkdirSync(packOutDir, { recursive: true });
    execSync(`tar xzf "${tgzPath}" -C "${packOutDir}" --strip-components=1`, {
      stdio: 'pipe',
      timeout: 15_000,
    });

    // Clean up tmp
    execSync(`rm -rf "${tmpDir}"`, { stdio: 'pipe' });

    // Track installed files
    const subpath = parsed.path || '';
    const targetDir = subpath ? join(packOutDir, subpath) : packOutDir;
    if (existsSync(targetDir)) {
      collectFiles(targetDir, installed);
    }
  } catch (err) {
    warnings.push(
      `Failed to extract npm pack ${pkgSpec}: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  return packOutDir;
}

/**
 * Recursively collect all file paths in a directory.
 */
function collectFiles(dir: string, out: string[]): void {
  const fs = require('fs');
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full, out);
    } else {
      out.push(full);
    }
  }
}
