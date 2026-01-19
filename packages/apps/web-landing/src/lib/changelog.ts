import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const MONOREPO_ROOT = path.resolve(process.cwd(), '../../..');

export interface ChangelogEntry {
  version: string;
  date: string;
  isBreaking: boolean;
  packages: {
    name: string;
    changes: string[];
  }[];
}

interface RawDetail {
  version: string;
  date: string;
  packageName: string;
  isBreaking: boolean;
  changes: string[];
}

// Recursive file search to avoid finding node_modules
function findChangelogs(dir: string, fileList: string[] = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (
        file !== 'node_modules' &&
        file !== '.git' &&
        file !== '.next' &&
        file !== 'dist'
      ) {
        findChangelogs(filePath, fileList);
      }
    } else {
      if (file === 'CHANGELOG.md') {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

export async function getAggregatedChangelog(): Promise<ChangelogEntry[]> {
  const packagesDir = path.join(MONOREPO_ROOT, 'packages');

  if (!fs.existsSync(packagesDir)) {
    return [];
  }

  const files = findChangelogs(packagesDir);

  const allDetails: RawDetail[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const packageName = getPackageName(file);
    const parsed = parseChangelog(content, file, packageName);
    allDetails.push(...parsed);
  }

  // Aggregate
  const map = new Map<string, ChangelogEntry>();

  for (const d of allDetails) {
    const key = d.version;
    let entry = map.get(key);
    if (!entry) {
      entry = {
        version: d.version,
        date: d.date,
        isBreaking: d.isBreaking,
        packages: [],
      };
      map.set(key, entry);
    }
    // Keep most recent date if conflict
    if (d.date > entry.date) entry.date = d.date;
    if (d.isBreaking) entry.isBreaking = true;

    entry.packages.push({
      name: d.packageName,
      changes: d.changes,
    });
  }

  const result = Array.from(map.values());
  // Sort desc
  return result.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function getPackageName(changelogPath: string): string {
  const dir = path.dirname(changelogPath);
  const pkgPath = path.join(dir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      return pkg.name;
    } catch {
      // ignore
    }
  }
  return path.basename(dir);
}

function parseChangelog(
  content: string,
  filePath: string,
  packageName: string
): RawDetail[] {
  const results: RawDetail[] = [];
  const lines = content.split('\n');

  let currentVersion: string | null = null;
  let currentChanges: string[] = [];
  let isBreaking = false;

  // Regex: ## 1.2.3 or ## [1.2.3]
  const versionRegex = /^## \[?(\d+\.\d+\.\d+)\]?/;

  const flush = () => {
    if (currentVersion && currentChanges.length > 0) {
      const valid = filterChanges(currentChanges);
      if (valid.length > 0) {
        const date = getDateForVersion(filePath, currentVersion);
        results.push({
          version: currentVersion,
          date,
          packageName,
          isBreaking,
          changes: valid,
        });
      }
    }
  };

  for (const line of lines) {
    const match = line.match(versionRegex);
    if (match) {
      flush();
      currentVersion = match[1];
      currentChanges = [];
      isBreaking = false;
    } else if (currentVersion) {
      const trimmed = line.trim();
      if (trimmed.startsWith('-')) {
        currentChanges.push(trimmed);
      }
      if (trimmed.toLowerCase().includes('breaking change')) {
        isBreaking = true;
      }
    }
  }
  flush();

  return results;
}

function filterChanges(changes: string[]): string[] {
  return changes.filter((c) => {
    const lower = c.toLowerCase();
    return !lower.includes('updated dependencies') && c.trim().length > 0;
  });
}

function getDateForVersion(filePath: string, version: string): string {
  try {
    const res = spawnSync(
      'git',
      ['log', '-S', `## ${version}`, '-1', '--format=%as', '--', filePath],
      {
        cwd: MONOREPO_ROOT,
        encoding: 'utf-8',
      }
    );
    if (res.stdout && res.stdout.trim()) {
      return res.stdout.trim();
    }
  } catch {
    // ignore
  }
  return '2025-01-01'; // fallback
}
