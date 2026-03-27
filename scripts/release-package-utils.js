#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

export const CLI_SMOKE_PACKAGE_NAMES = [
  "contractspec",
  "@contractspec/app.cli-contractspec",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function findPackageJsonFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (
      entry.name === "node_modules" ||
      entry.name === ".turbo" ||
      entry.name === ".next"
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      findPackageJsonFiles(fullPath, files);
    } else if (entry.name === "package.json") {
      files.push(fullPath);
    }
  }

  return files;
}

export function parsePackageNames(value) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
}

export function getPackageNameSelection(options = {}) {
  if (Array.isArray(options.packageNames) && options.packageNames.length > 0) {
    return {
      packageNames: options.packageNames,
      packageNamesSpecified: true,
    };
  }

  if (options.packageNamesSpecified) {
    return {
      packageNames: Array.isArray(options.packageNames) ? options.packageNames : [],
      packageNamesSpecified: true,
    };
  }

  if (
    Object.prototype.hasOwnProperty.call(
      process.env,
      "CONTRACTSPEC_RELEASE_PACKAGE_NAMES",
    )
  ) {
    return {
      packageNames: parsePackageNames(process.env.CONTRACTSPEC_RELEASE_PACKAGE_NAMES),
      packageNamesSpecified: true,
    };
  }

  return {
    packageNames: [],
    packageNamesSpecified: false,
  };
}

export function getPreparationPackageNames(requestedPackageNames) {
  const requestedSet = new Set(requestedPackageNames);
  const needsCliSmoke = CLI_SMOKE_PACKAGE_NAMES.some((name) =>
    requestedSet.has(name),
  );

  if (!needsCliSmoke) {
    return requestedPackageNames;
  }

  const preparationPackageNames = [...requestedPackageNames];
  for (const packageName of CLI_SMOKE_PACKAGE_NAMES) {
    if (requestedSet.has(packageName)) {
      continue;
    }
    preparationPackageNames.push(packageName);
  }

  return preparationPackageNames;
}

export function discoverPublishablePackages(repoRoot = process.cwd(), options = {}) {
  const packages = [];
  const log = options.log ?? console.log;
  const warn = options.warn ?? console.warn;

  const rootManifestPath = path.join(repoRoot, "package.json");
  try {
    const rootManifest = readJson(rootManifestPath);
    if (
      rootManifest.name &&
      rootManifest.version &&
      rootManifest.private !== true &&
      rootManifest.scripts?.["publish:pkg"]
    ) {
      packages.push({
        name: rootManifest.name,
        dir: ".",
        version: rootManifest.version,
        hasBuildScript: Boolean(rootManifest.scripts?.build),
      });
      log(
        `[discover] Including root package: ${rootManifest.name}@${rootManifest.version}`,
      );
    }
  } catch (error) {
    warn(
      `[discover] Error reading root package.json: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const packagesRoot = path.join(repoRoot, "packages");
  const packageJsonFiles = findPackageJsonFiles(packagesRoot);

  for (const fullPath of packageJsonFiles) {
    const pkgDir = path.relative(repoRoot, path.dirname(fullPath));

    try {
      const manifest = readJson(fullPath);
      if (manifest.private === true) {
        log(`[discover] Skipping private package: ${manifest.name || pkgDir}`);
        continue;
      }
      if (!manifest.name) {
        log(`[discover] Skipping package without name: ${pkgDir}`);
        continue;
      }

      packages.push({
        name: manifest.name,
        dir: pkgDir,
        version: manifest.version,
        hasBuildScript: Boolean(manifest.scripts?.build),
      });
    } catch (error) {
      warn(
        `[discover] Error reading ${fullPath}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  log(`\n[discover] Found ${packages.length} publishable packages:\n`);
  packages.forEach((pkg) => {
    log(`  - ${pkg.name}@${pkg.version} (${pkg.dir})`);
  });
  log("");

  return packages;
}
