/**
 * Git pack source — GitHub API fetching and local installation.
 */
import { mkdirSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';
import {
  type Lockfile,
  type LockfileSourceEntry,
  getLockedSource,
  setLockedSource,
  computeIntegrity,
} from '../core/lockfile.js';
import {
  type GitSourceRef,
  parseGitSourceRef,
  gitSourceKey,
} from './git-ref.js';

const GITHUB_API = 'https://api.github.com';

function githubHeaders(token?: string): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'agentpacks',
  };
  if (token) h.Authorization = `token ${token}`;
  return h;
}

/**
 * Resolve git ref to a commit SHA using GitHub API.
 */
export async function resolveGitRef(
  parsed: GitSourceRef,
  token?: string
): Promise<string> {
  const base = `${GITHUB_API}/repos/${parsed.owner}/${parsed.repo}/git/ref`;
  const res = await fetch(`${base}/heads/${parsed.ref}`, {
    headers: githubHeaders(token),
  });

  if (!res.ok) {
    // Try as a tag
    const tagRes = await fetch(`${base}/tags/${parsed.ref}`, {
      headers: githubHeaders(token),
    });
    if (!tagRes.ok) {
      throw new Error(
        `Could not resolve ref "${parsed.ref}" for ${parsed.owner}/${parsed.repo}: ${res.status}`
      );
    }
    const tagData = (await tagRes.json()) as { object: { sha: string } };
    return tagData.object.sha;
  }

  const data = (await res.json()) as { object: { sha: string } };
  return data.object.sha;
}

/**
 * Fetch a directory listing from GitHub Contents API.
 */
export async function fetchGitDirectory(
  parsed: GitSourceRef,
  sha: string,
  subpath: string,
  token?: string
): Promise<{ name: string; type: string; download_url: string | null }[]> {
  const path = parsed.path ? `${parsed.path}/${subpath}` : subpath;
  const url = `${GITHUB_API}/repos/${parsed.owner}/${parsed.repo}/contents/${path}?ref=${sha}`;
  const res = await fetch(url, { headers: githubHeaders(token) });
  if (!res.ok) return [];
  return (await res.json()) as {
    name: string;
    type: string;
    download_url: string | null;
  }[];
}

/**
 * Fetch a single file content from a GitHub download URL.
 */
export async function fetchGitFile(
  downloadUrl: string,
  token?: string
): Promise<string> {
  const headers: Record<string, string> = { 'User-Agent': 'agentpacks' };
  if (token) headers.Authorization = `token ${token}`;
  const res = await fetch(downloadUrl, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${downloadUrl}: ${res.status}`);
  }
  return res.text();
}

/**
 * Recursively fetch and write a remote directory to local disk.
 */
async function fetchAndWriteSubdir(
  parsed: GitSourceRef,
  sha: string,
  remotePath: string,
  localDir: string,
  installed: string[],
  token?: string
): Promise<void> {
  mkdirSync(localDir, { recursive: true });
  const entries = await fetchGitDirectory(parsed, sha, remotePath, token);

  for (const entry of entries) {
    if (entry.type === 'file' && entry.download_url) {
      const content = await fetchGitFile(entry.download_url, token);
      const filepath = join(localDir, entry.name);
      writeFileSync(filepath, content);
      installed.push(filepath);
    } else if (entry.type === 'dir') {
      await fetchAndWriteSubdir(
        parsed,
        sha,
        `${remotePath}/${entry.name}`,
        join(localDir, entry.name),
        installed,
        token
      );
    }
  }
}

/**
 * Install a git-based pack source into .agentpacks/.curated/.
 */
export async function installGitSource(
  projectRoot: string,
  source: string,
  lockfile: Lockfile,
  options: { update?: boolean; frozen?: boolean; token?: string } = {}
): Promise<{ installed: string[]; warnings: string[] }> {
  const parsed = parseGitSourceRef(source);
  const sourceKey = gitSourceKey(parsed);
  const installed: string[] = [];
  const warnings: string[] = [];

  // Resolve ref (use locked ref if available and not updating)
  let resolvedSha: string;
  const locked = getLockedSource(lockfile, sourceKey);

  if (options.frozen && !locked) {
    throw new Error(
      `Frozen mode: no lockfile entry for source "${sourceKey}".`
    );
  }

  if (locked && !options.update) {
    resolvedSha = locked.resolvedRef;
  } else {
    resolvedSha = await resolveGitRef(parsed, options.token);
  }

  // Fetch pack listing from the remote
  const basePath = parsed.path || 'packs';
  const entries = await fetchGitDirectory(
    parsed,
    resolvedSha,
    basePath,
    options.token
  );

  const curatedDir = resolve(projectRoot, '.agentpacks', '.curated');
  mkdirSync(curatedDir, { recursive: true });

  const newLockEntry: LockfileSourceEntry = {
    requestedRef: parsed.ref,
    resolvedRef: resolvedSha,
    resolvedAt: new Date().toISOString(),
    skills: {},
    packs: {},
  };

  // Each directory entry is potentially a pack
  const packDirs = entries.filter((e) => e.type === 'dir');

  for (const packEntry of packDirs) {
    const packName = packEntry.name;
    const packOutDir = resolve(curatedDir, packName);
    const packFiles = await fetchGitDirectory(
      parsed,
      resolvedSha,
      `${basePath}/${packName}`,
      options.token
    );

    mkdirSync(packOutDir, { recursive: true });

    for (const file of packFiles) {
      if (file.type === 'file' && file.download_url) {
        const content = await fetchGitFile(file.download_url, options.token);
        writeFileSync(join(packOutDir, file.name), content);
        installed.push(join(packOutDir, file.name));
        if (newLockEntry.packs) {
          newLockEntry.packs[packName] = {
            integrity: computeIntegrity(content),
          };
        }
      } else if (file.type === 'dir') {
        await fetchAndWriteSubdir(
          parsed,
          resolvedSha,
          `${basePath}/${packName}/${file.name}`,
          join(packOutDir, file.name),
          installed,
          options.token
        );
      }
    }
  }

  // Handle case where source points directly to a single pack
  if (packDirs.length === 0) {
    const fileEntries = entries.filter((e) => e.type === 'file');
    if (fileEntries.length > 0) {
      const packName = parsed.path.split('/').pop() ?? parsed.repo;
      const packOutDir = resolve(curatedDir, packName);
      mkdirSync(packOutDir, { recursive: true });

      for (const file of entries) {
        if (file.type === 'file' && file.download_url) {
          const content = await fetchGitFile(file.download_url, options.token);
          writeFileSync(join(packOutDir, file.name), content);
          installed.push(join(packOutDir, file.name));
        } else if (file.type === 'dir') {
          await fetchAndWriteSubdir(
            parsed,
            resolvedSha,
            `${basePath}/${file.name}`,
            join(packOutDir, file.name),
            installed,
            options.token
          );
        }
      }
    }
  }

  setLockedSource(lockfile, sourceKey, newLockEntry);
  return { installed, warnings };
}
