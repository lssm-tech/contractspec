#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import {
  discoverPublishablePackages,
  getPackageNameSelection,
  getPreparationPackageNames,
} from "./release-package-utils.js";
import { publishPackages } from "./publish-packages.js";

const repoRoot = process.cwd();

function parseArgs(argv) {
  const options = {
    dryRun: undefined,
    npmTag: undefined,
    releaseDir: undefined,
    manifestPath: undefined,
    packageNames: [],
    packageNamesSpecified: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (arg === "--tag" && argv[index + 1]) {
      options.npmTag = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--release-dir" && argv[index + 1]) {
      options.releaseDir = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--manifest" && argv[index + 1]) {
      options.manifestPath = argv[index + 1];
      index += 1;
      continue;
    }
    if ((arg === "--package" || arg === "--packages") && argv[index + 1]) {
      options.packageNamesSpecified = true;
      options.packageNames.push(
        ...argv[index + 1]
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean),
      );
      index += 1;
    }
  }

  return options;
}

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repoRoot,
    env: options.env ?? process.env,
    encoding: "utf8",
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error(`Command failed (${command} ${args.join(" ")})`);
  }
}

function buildReleaseTargets(options = {}) {
  const { packageNames, packageNamesSpecified } = getPackageNameSelection(options);

  if (packageNamesSpecified && packageNames.length === 0) {
    console.log("[release] Skip build: no npm publish targets were resolved.");
    return;
  }

  const packagesByName = new Map(
    discoverPublishablePackages(repoRoot, {
      log: () => {},
    }).map((pkg) => [pkg.name, pkg]),
  );
  const requestedPackageNames = packageNamesSpecified
    ? packageNames
    : Array.from(packagesByName.keys());
  const buildTargets = getPreparationPackageNames(requestedPackageNames).filter(
    (packageName) => packagesByName.get(packageName)?.hasBuildScript,
  );

  if (buildTargets.length === 0) {
    console.log("[release] Skip build: targets do not define a build script.");
    return;
  }

  console.log(
    `[release] Building ${buildTargets.length} publish target(s): ${buildTargets.join(", ")}`,
  );

  const args = ["turbo", "run", "build"];
  for (const packageName of buildTargets) {
    args.push(`--filter=${packageName}`);
  }

  runCommand("bun", args, {
    env: process.env,
  });
}

const cliOptions = parseArgs(process.argv.slice(2));

export async function releasePublish(options = {}) {
  runCommand("bun", ["run", "release:build"], {
    env: process.env,
  });
  buildReleaseTargets(options);
  return publishPackages(options);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  releasePublish(cliOptions).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
