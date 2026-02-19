#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const changesetDir = path.join(repoRoot, '.changeset');
const generatedChangesetPath = path.join(
  changesetDir,
  'auto-dependent-bumps.md'
);
const dependencyFields = [
  'dependencies',
  'peerDependencies',
  'optionalDependencies',
];

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const parseChangesetFrontmatter = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!match) {
    return [];
  }

  return match[1]
    .split('\n')
    .map((line) => line.trim())
    .map((line) =>
      line.match(/^['"]?([^'"\n]+)['"]?\s*:\s*(patch|minor|major)\s*$/)
    )
    .filter(Boolean)
    .map((parsed) => parsed[1]);
};

const getWorkspacePackageManifestPaths = () => {
  const rootManifest = readJson(path.join(repoRoot, 'package.json'));
  const workspacePatterns = rootManifest.workspaces?.packages;

  if (!Array.isArray(workspacePatterns)) {
    throw new Error('Expected root package.json to define workspaces.packages');
  }

  const manifestPaths = [];

  for (const pattern of workspacePatterns) {
    if (typeof pattern !== 'string') {
      continue;
    }

    if (pattern.endsWith('/*')) {
      const baseDir = path.join(repoRoot, pattern.slice(0, -2));
      if (!fs.existsSync(baseDir)) {
        continue;
      }

      const entries = fs.readdirSync(baseDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) {
          continue;
        }

        const manifestPath = path.join(baseDir, entry.name, 'package.json');
        if (fs.existsSync(manifestPath)) {
          manifestPaths.push(manifestPath);
        }
      }

      continue;
    }

    const manifestPath = path.join(repoRoot, pattern, 'package.json');
    if (fs.existsSync(manifestPath)) {
      manifestPaths.push(manifestPath);
    }
  }

  return manifestPaths;
};

const getWorkspacePackagesByName = () => {
  const packagesByName = new Map();

  for (const manifestPath of getWorkspacePackageManifestPaths()) {
    const manifest = readJson(manifestPath);
    if (!manifest.name) {
      continue;
    }

    packagesByName.set(manifest.name, manifest);
  }

  return packagesByName;
};

const getChangedPackageNames = () => {
  const entries = fs.readdirSync(changesetDir, { withFileTypes: true });
  const changedPackages = new Set();

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    if (!entry.name.endsWith('.md') || entry.name === 'README.md') {
      continue;
    }

    const changesetPath = path.join(changesetDir, entry.name);
    if (changesetPath === generatedChangesetPath) {
      continue;
    }

    const content = fs.readFileSync(changesetPath, 'utf8');
    const packageNames = parseChangesetFrontmatter(content);
    for (const packageName of packageNames) {
      changedPackages.add(packageName);
    }
  }

  return changedPackages;
};

const buildReverseDependencyGraph = (packagesByName) => {
  const reverseGraph = new Map(
    [...packagesByName.keys()].map((packageName) => [packageName, new Set()])
  );

  for (const [dependentName, manifest] of packagesByName) {
    for (const field of dependencyFields) {
      const dependencies = manifest[field];
      if (!dependencies || typeof dependencies !== 'object') {
        continue;
      }

      for (const dependencyName of Object.keys(dependencies)) {
        if (!packagesByName.has(dependencyName)) {
          continue;
        }

        reverseGraph.get(dependencyName)?.add(dependentName);
      }
    }
  }

  return reverseGraph;
};

const collectTransitiveDependents = (seedPackageNames, reverseGraph) => {
  const visited = new Set(seedPackageNames);
  const discoveredDependents = new Set();
  const queue = [...seedPackageNames];

  let index = 0;
  while (index < queue.length) {
    const current = queue[index];
    index += 1;

    const directDependents = reverseGraph.get(current);
    if (!directDependents) {
      continue;
    }

    for (const dependentName of directDependents) {
      if (visited.has(dependentName)) {
        continue;
      }

      visited.add(dependentName);
      discoveredDependents.add(dependentName);
      queue.push(dependentName);
    }
  }

  return discoveredDependents;
};

const writeGeneratedChangeset = (packageNames) => {
  const sortedPackages = [...packageNames].sort((a, b) => a.localeCompare(b));
  const releaseLines = sortedPackages
    .map((name) => `'${name}': patch`)
    .join('\n');
  const content = `---\n${releaseLines}\n---\n\nchore: auto-bump internal dependents\n`;
  fs.writeFileSync(generatedChangesetPath, content, 'utf8');
};

const main = () => {
  if (!fs.existsSync(changesetDir)) {
    console.log(
      '[changeset] No .changeset directory found, skipping dependent auto-bumps.'
    );
    return;
  }

  if (fs.existsSync(generatedChangesetPath)) {
    fs.unlinkSync(generatedChangesetPath);
  }

  const changedPackages = getChangedPackageNames();
  if (changedPackages.size === 0) {
    console.log(
      '[changeset] No changesets found, skipping dependent auto-bumps.'
    );
    return;
  }

  const packagesByName = getWorkspacePackagesByName();
  const seedPackageNames = [...changedPackages].filter((name) =>
    packagesByName.has(name)
  );
  if (seedPackageNames.length === 0) {
    console.log(
      '[changeset] No workspace package bumps detected in changesets.'
    );
    return;
  }

  const reverseGraph = buildReverseDependencyGraph(packagesByName);
  const transitiveDependents = collectTransitiveDependents(
    seedPackageNames,
    reverseGraph
  );

  const packagesToAutoBump = [...transitiveDependents].filter(
    (name) => !changedPackages.has(name)
  );

  if (packagesToAutoBump.length === 0) {
    console.log('[changeset] No dependent packages require auto-bumps.');
    return;
  }

  writeGeneratedChangeset(packagesToAutoBump);
  console.log(
    `[changeset] Added ${packagesToAutoBump.length} dependent patch bump(s) to .changeset/auto-dependent-bumps.md`
  );
  for (const packageName of packagesToAutoBump.sort((a, b) =>
    a.localeCompare(b)
  )) {
    console.log(`  - ${packageName}`);
  }
};

try {
  main();
} catch (error) {
  console.error('[changeset] Failed to prepare dependent auto-bumps.');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
