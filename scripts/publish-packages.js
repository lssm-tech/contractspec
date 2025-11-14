#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const repoRoot = process.cwd();

const packages = [
  { name: "@lssm/lib.utils-typescript", dir: "packages/libs/utils-typescript" },
  { name: "@lssm/lib.logger", dir: "packages/libs/logger" },
  { name: "@lssm/lib.schema", dir: "packages/libs/schema" },
  { name: "@lssm/lib.contracts", dir: "packages/libs/contracts" },
  { name: "@lssm/lib.graphql-core", dir: "packages/libs/graphql-core" },
  { name: "@lssm/lib.graphql-prisma", dir: "packages/libs/graphql-prisma" },
  { name: "@lssm/lib.graphql-federation", dir: "packages/libs/graphql-federation" },
  { name: "@lssm/lib.error", dir: "packages/libs/error" },
  { name: "@lssm/lib.exporter", dir: "packages/libs/exporter" },
  { name: "@lssm/lib.ui-kit", dir: "packages/libs/ui-kit" },
  { name: "@lssm/lib.ui-kit-web", dir: "packages/libs/ui-kit-web" },
  { name: "@lssm/lib.design-system", dir: "packages/libs/design-system" },
  { name: "@lssm/lib.accessibility", dir: "packages/libs/accessibility" },
  { name: "@lssm/lib.presentation-runtime-core", dir: "packages/libs/presentation-runtime-core" },
  { name: "@lssm/lib.presentation-runtime-react", dir: "packages/libs/presentation-runtime-react" },
  { name: "@lssm/lib.presentation-runtime-react-native", dir: "packages/libs/presentation-runtime-react-native" },
  { name: "@lssm/lib.bus", dir: "packages/libs/bus" },
  { name: "@lssm/lib.database", dir: "packages/libs/database" },
  { name: "@lssm/lib.databases", dir: "packages/libs/databases" },
];

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

const localVersions = new Map(
  packages.map(({ name, dir }) => {
    const manifest = readJson(path.join(repoRoot, dir, "package.json"));
    return [name, manifest.version];
  }),
);

const workspacePrefix = "workspace:";

const resolveSpecifier = (rawValue, depName) => {
  if (typeof rawValue !== "string" || !rawValue.startsWith(workspacePrefix)) {
    return rawValue;
  }

  const linkedVersion = localVersions.get(depName);
  if (!linkedVersion) {
    console.warn(
      `[publish] ${depName} referenced via "${rawValue}" but no local version is available; leaving specifier untouched.`,
    );
    return rawValue;
  }

  const hint = rawValue.slice(workspacePrefix.length);

  if (hint === "" || hint === "*" || hint === linkedVersion) {
    return linkedVersion;
  }

  if (hint === "^" || hint === "~") {
    return `${hint}${linkedVersion}`;
  }

  if (/^[~^]/.test(hint)) {
    return `${hint[0]}${linkedVersion}`;
  }

  const op = ["<=", ">=", "<", ">"].find((candidate) => hint.startsWith(candidate));
  if (op) {
    return `${op}${linkedVersion}`;
  }

  if (/^\d/.test(hint)) {
    return linkedVersion;
  }

  return linkedVersion;
};

const updateWorkspaceSpecifiers = (manifest) => {
  let changed = false;
  for (const field of ["dependencies", "devDependencies", "optionalDependencies"]) {
    const block = manifest[field];
    if (!block) continue;
    for (const dep of Object.keys(block)) {
      const replacement = resolveSpecifier(block[dep], dep);
      if (replacement !== block[dep]) {
        block[dep] = replacement;
        changed = true;
      }
    }
  }
  return changed;
};

const dryRun = process.env.DRY_RUN === "true" || process.env.DRY_RUN === "1";

const publishPackage = ({ name, dir }) => {
  const pkgDir = path.join(repoRoot, dir);
  const manifestPath = path.join(pkgDir, "package.json");
  const original = fs.readFileSync(manifestPath, "utf8");
  const manifest = JSON.parse(original);
  const version = manifest.version;

  try {
    updateWorkspaceSpecifiers(manifest);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

    console.log(`\n[publish] ${name}@${version}`);

    if (!dryRun) {
      let publishedVersions = [];
      try {
        const raw = execSync(`npm view ${name} versions --json`, {
          stdio: ["ignore", "pipe", "pipe"],
        })
          .toString()
          .trim();
        if (raw) {
          publishedVersions = JSON.parse(raw);
        }
      } catch {
        console.log(`[publish] No registry versions found for ${name}; treating as first release.`);
      }

      const alreadyPublished = Array.isArray(publishedVersions)
        ? publishedVersions.includes(version)
        : publishedVersions === version;

      if (alreadyPublished) {
        console.log(`[publish] Skipping ${name}@${version} (already published).`);
        return;
      }

      execSync("npm publish --access public --ignore-scripts", {
        cwd: pkgDir,
        stdio: "inherit",
      });
    } else {
      console.log(`[publish] DRY_RUN=true → skipping npm publish for ${name}@${version}`);
    }
  } finally {
    fs.writeFileSync(manifestPath, original);
  }
};

for (const pkg of packages) {
  publishPackage(pkg);
}

