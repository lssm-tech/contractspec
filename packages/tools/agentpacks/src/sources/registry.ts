/**
 * Registry pack source — fetch, extract, and install packs from the
 * agentpacks registry into the local curated cache.
 */
import { existsSync, mkdirSync, readdirSync, rmSync } from 'fs';
import { resolve, join } from 'path';
import {
  type Lockfile,
  type LockfileSourceEntry,
  getLockedSource,
  setLockedSource,
} from '../core/lockfile.js';
import { parseRegistrySourceRef, registrySourceKey } from './registry-ref.js';
import {
  createRegistryClient,
  type RegistryClientConfig,
} from '../utils/registry-client.js';
import { extractTarball, computeTarballIntegrity } from '../utils/tarball.js';
import { loadCredentials } from '../utils/credentials.js';

/**
 * Install a registry-sourced pack into `.agentpacks/.curated/<packName>/`.
 * 1. Parse the registry ref  (`registry:name[@version]`)
 * 2. Resolve version (locked → API)
 * 3. Download tarball
 * 4. Verify integrity
 * 5. Extract to curated cache
 * 6. Update lockfile
 */
export async function installRegistrySource(
  projectRoot: string,
  source: string,
  lockfile: Lockfile,
  options: {
    update?: boolean;
    frozen?: boolean;
    registryUrl?: string;
  } = {}
): Promise<{ installed: string[]; warnings: string[] }> {
  const parsed = parseRegistrySourceRef(source);
  const sourceKey = registrySourceKey(parsed);
  const installed: string[] = [];
  const warnings: string[] = [];

  const locked = getLockedSource(lockfile, sourceKey);

  if (options.frozen && !locked) {
    throw new Error(
      `Frozen mode: no lockfile entry for source "${sourceKey}".`
    );
  }

  // Determine target version
  let targetVersion = parsed.version;

  if (locked && !options.update) {
    targetVersion = locked.resolvedRef;
  } else if (targetVersion === 'latest') {
    // Resolve "latest" to an actual version via the registry API
    const clientCfg = buildClientConfig(options.registryUrl);
    const client = createRegistryClient(clientCfg);
    const info = await client.info(parsed.packName);
    targetVersion = info.latestVersion;
  }

  // Download the tarball
  const clientCfg = buildClientConfig(options.registryUrl);
  const client = createRegistryClient(clientCfg);
  const { data } = await client.download(parsed.packName, targetVersion);

  // Verify integrity if we have a locked hash
  const localIntegrity = computeTarballIntegrity(data);
  if (locked && !options.update && locked.skills?.['__integrity']) {
    const expectedIntegrity = locked.skills['__integrity'].integrity;
    if (expectedIntegrity && localIntegrity !== expectedIntegrity) {
      throw new Error(
        `Integrity mismatch for ${parsed.packName}@${targetVersion}. ` +
          `Expected ${expectedIntegrity}, got ${localIntegrity}.`
      );
    }
  }

  // Extract into curated cache
  const curatedDir = resolve(projectRoot, '.agentpacks', '.curated');
  const packOutDir = resolve(curatedDir, parsed.packName);

  // Clean existing installation
  if (existsSync(packOutDir)) {
    rmSync(packOutDir, { recursive: true, force: true });
  }
  mkdirSync(packOutDir, { recursive: true });

  await extractTarball(data, packOutDir);

  // Collect installed files
  collectFiles(packOutDir, installed);

  // Update lockfile
  const newEntry: LockfileSourceEntry = {
    requestedRef: parsed.version,
    resolvedRef: targetVersion,
    resolvedAt: new Date().toISOString(),
    skills: {
      __integrity: { integrity: localIntegrity },
    },
    packs: {
      [parsed.packName]: { integrity: localIntegrity },
    },
  };

  setLockedSource(lockfile, sourceKey, newEntry);
  return { installed, warnings };
}

/**
 * Build a RegistryClientConfig, loading credentials if available.
 */
function buildClientConfig(
  registryUrl?: string
): Partial<RegistryClientConfig> {
  const cfg: Partial<RegistryClientConfig> = {};

  if (registryUrl) {
    cfg.registryUrl = registryUrl;
  }

  try {
    const creds = loadCredentials();
    if (creds?.token) {
      cfg.authToken = creds.token;
    }
  } catch {
    // Credentials file missing or malformed — continue unauthenticated
  }

  return cfg;
}

/**
 * Recursively collect all file paths in a directory.
 */
function collectFiles(dir: string, out: string[]): void {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full, out);
    } else {
      out.push(full);
    }
  }
}
