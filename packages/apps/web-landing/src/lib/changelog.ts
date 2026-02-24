import fs from 'fs';
import path from 'path';

const MONOREPO_ROOT = path.resolve(process.cwd(), '../../..');
const CHANGELOG_GLOB = path.join(
  MONOREPO_ROOT,
  'packages',
  '*',
  '*',
  'CHANGELOG.md'
);

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

function findChangelogs(): string[] {
  return fs.globSync(CHANGELOG_GLOB);
}

export async function getAggregatedChangelog(): Promise<ChangelogEntry[]> {
  const files = findChangelogs();

  const allDetails: RawDetail[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const packageName = getPackageName(file);
    const parsed = parseChangelog(content, packageName);
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

function parseChangelog(content: string, packageName: string): RawDetail[] {
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
        const date = getDateForVersion(content, currentVersion);
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

function getDateForVersion(content: string, version: string): string {
  const lines = content.split('\n');
  const versionHeader = new RegExp(`^## \\[?${version}\\]?`);

  for (let index = 0; index < lines.length; index += 1) {
    if (!versionHeader.test(lines[index])) continue;

    const possibleDate = lines[index + 1]?.trim();
    if (!possibleDate) break;

    const dateMatch = possibleDate.match(/\d{4}-\d{2}-\d{2}/);
    if (dateMatch) return dateMatch[0];
  }

  return '2025-01-01';
}
