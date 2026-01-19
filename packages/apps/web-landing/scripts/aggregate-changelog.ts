
import { Glob } from 'bun';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const MONOREPO_ROOT = path.resolve(__dirname, '../../../../..');
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/changelog.json');

// Ensure output dir exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

interface ChangelogEntry {
  version: string;
  date: string;
  packageName: string;
  isBreaking: boolean;
  changes: string[];
}

interface AggregatedChange {
  version: string;
  date: string;
  isBreaking: boolean;
  packages: {
    name: string;
    changes: string[];
  }[];
}

async function main() {
  console.log('🔍 Scanning for CHANGELOG.md files...');
  
  const glob = new Glob('packages/**/CHANGELOG.md');
  const allEntries: ChangelogEntry[] = [];
  let fileCount = 0;

  // Scan from MONOREPO_ROOT
  // Note: Bun.Glob scan returns paths relative to cwd.
  for await (const file of glob.scan({ cwd: MONOREPO_ROOT, onlyFiles: true })) {
    if (file.includes('node_modules')) continue;
    
    fileCount++;
    const fullPath = path.join(MONOREPO_ROOT, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const packageName = getPackageName(fullPath);

    const entries = await parseChangelog(content, fullPath, packageName);
    allEntries.push(...entries);
  }

  console.log(`Found ${fileCount} changelogs.`);

  // Aggregate by version
  const aggregated = aggregateEntries(allEntries);

  // Sort by date desc
  aggregated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Write to JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(aggregated, null, 2));
  console.log(`✅ Wrote ${aggregated.length} version entries to ${OUTPUT_FILE}`);
}

function getPackageName(changelogPath: string): string {
  const packageJsonPath = path.join(path.dirname(changelogPath), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      return pkg.name;
    } catch (e) {}
  }
  return path.basename(path.dirname(changelogPath));
}

async function parseChangelog(content: string, filePath: string, packageName: string): Promise<ChangelogEntry[]> {
  const entries: ChangelogEntry[] = [];
  const lines = content.split('\n');
  
  let currentVersion: string | null = null;
  let currentChanges: string[] = [];
  let isBreaking = false;

  const versionRegex = /^## \[?(\d+\.\d+\.\d+)\]?/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const versionMatch = line.match(versionRegex);

    if (versionMatch) {
      if (currentVersion) {
        const validChanges = filterChanges(currentChanges);
        if (validChanges.length > 0) {
           const date = getDateForVersion(filePath, currentVersion);
           entries.push({
             version: currentVersion,
             date,
             packageName,
             isBreaking,
             changes: validChanges
           });
        }
      }

      currentVersion = versionMatch[1];
      currentChanges = [];
      isBreaking = false;
    } else if (currentVersion) {
      if (line.trim().startsWith('-')) {
        currentChanges.push(line.trim());
      }
      
      if (line.toLowerCase().includes('breaking change') || line.toLowerCase().includes('major changes')) {
        isBreaking = true;
      }
    }
  }

  if (currentVersion) {
    const validChanges = filterChanges(currentChanges);
    if (validChanges.length > 0) {
      const date = getDateForVersion(filePath, currentVersion);
      entries.push({
        version: currentVersion,
        date,
        packageName,
        isBreaking,
        changes: validChanges
      });
    }
  }

  return entries;
}

function filterChanges(changes: string[]): string[] {
  return changes.filter(c => {
    const lower = c.toLowerCase();
    if (lower.includes('updated dependencies')) return false;
    if (c.trim().length === 0) return false;
    return true;
  });
}

function getDateForVersion(filePath: string, version: string): string {
  try {
    // git log -S "## 1.2.3" -1 --format=%as -- <file>
    const result = spawnSync('git', ['log', '-S', `## ${version}`, '-1', '--format=%as', '--', filePath], { 
      cwd: MONOREPO_ROOT, 
      encoding: 'utf-8' 
    });
    
    if (result.stdout && result.stdout.trim()) {
      return result.stdout.trim();
    }
  } catch (e) {
    // ignore
  }
  return '2025-01-01'; 
}

function aggregateEntries(entries: ChangelogEntry[]): AggregatedChange[] {
  // Key by version only to group broad monorepo releases?
  // Or Key by date+version?
  // Given "Analyse all changelogs", a unified timeline is best.
  // Grouping by Date (Month/Year) might be better for UI, but data should be granular.
  // Let's group by "Version" string. If different packages have same version, we group them.
  // This helps if we increment versions in lockstep. 
  // If versions are independent, "1.0.0" of Package A might be old, "1.0.0" of Package B might be new.
  // But usually in monorepos, versions might align or be unrelated.
  // Safer to Group by Date+Version?
  // Let's try grouping by `Version` first, but if dates differ significantly, it might be weird.
  // Logic: Map<Version, Entry>.
  // Actually, filtering by "Updated dependencies" removes most automated bumps.
  // The meaningful changes usually have manually bumped versions or automated ones.
  // Let's stick to key = version for now, but take the *latest* date seen for that version.
  
  const versionMap = new Map<string, AggregatedChange>();

  for (const entry of entries) {
    // Use simple version as key
    const key = entry.version;
    
    if (!versionMap.has(key)) {
      versionMap.set(key, {
        version: entry.version,
        date: entry.date,
        isBreaking: entry.isBreaking,
        packages: []
      });
    }
    
    const agg = versionMap.get(key)!;
    
    // Update date to latest if needed (or earliest? latest makes sense for "Release date")
    if (entry.date > agg.date) agg.date = entry.date;
    if (entry.isBreaking) agg.isBreaking = true;
    
    agg.packages.push({
      name: entry.packageName,
      changes: entry.changes
    });
  }

  return Array.from(versionMap.values());
}

main().catch(console.error);
