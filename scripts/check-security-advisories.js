#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const severityOrder = {
  low: 1,
  moderate: 2,
  high: 3,
  critical: 4,
};

function parseArgs(argv) {
  const options = {
    allowlistPath:
      process.env.CONTRACTSPEC_ADVISORY_ALLOWLIST_PATH ??
      path.join('.github', 'security-advisory-allowlist.json'),
    threshold: process.env.CONTRACTSPEC_ADVISORY_THRESHOLD ?? 'high',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--allowlist' && argv[index + 1]) {
      options.allowlistPath = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === '--threshold' && argv[index + 1]) {
      options.threshold = argv[index + 1];
      index += 1;
    }
  }

  return options;
}

function readAllowlist(filePath) {
  if (!fs.existsSync(filePath)) {
    return { ignoredAdvisories: [] };
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function extractAuditJson(stdout) {
  const jsonStart = stdout.indexOf('{');
  if (jsonStart === -1) return null;
  return JSON.parse(stdout.slice(jsonStart));
}

function runAudit() {
  return spawnSync('bun', ['audit', '--json'], {
    encoding: 'utf8',
    stdio: 'pipe',
  });
}

export async function checkSecurityAdvisories(options = {}) {
  const threshold = options.threshold ?? 'high';
  const thresholdRank = severityOrder[threshold];
  if (!thresholdRank) {
    throw new Error(`Unsupported severity threshold: ${threshold}`);
  }

  const allowlistPath = path.resolve(options.allowlistPath);
  const allowlist = readAllowlist(allowlistPath);
  const ignoredIds = new Set(
    (allowlist.ignoredAdvisories ?? []).map((entry) => String(entry.id))
  );

  const result = runAudit();
  const stdout = result.stdout ?? '';
  const stderr = result.stderr ?? '';
  const advisoriesByPackage = extractAuditJson(stdout);

  if (!advisoriesByPackage) {
    throw new Error(
      `Unable to parse bun audit output.\n${stdout}\n${stderr}`.trim()
    );
  }

  const ignored = [];
  const actionable = [];

  for (const [packageName, advisories] of Object.entries(advisoriesByPackage)) {
    for (const advisory of advisories) {
      const advisorySeverity = advisory.severity ?? 'low';
      if ((severityOrder[advisorySeverity] ?? 0) < thresholdRank) {
        continue;
      }

      const entry = {
        packageName,
        id: String(advisory.id),
        severity: advisorySeverity,
        title: advisory.title,
        url: advisory.url,
      };

      if (ignoredIds.has(entry.id)) {
        ignored.push(entry);
      } else {
        actionable.push(entry);
      }
    }
  }

  if (ignored.length > 0) {
    console.log('[security:audit] Ignored advisories:');
    for (const entry of ignored) {
      console.log(
        `  - ${entry.packageName} ${entry.id} (${entry.severity}): ${entry.title}`
      );
    }
  }

  if (actionable.length > 0) {
    console.error('[security:audit] Blocking advisories detected:');
    for (const entry of actionable) {
      console.error(
        `  - ${entry.packageName} ${entry.id} (${entry.severity}): ${entry.title}`
      );
      if (entry.url) {
        console.error(`    ${entry.url}`);
      }
    }

    const combinedOutput = `${stdout}${stderr}`.trim();
    if (combinedOutput) {
      console.error('\n[security:audit] Raw audit output:');
      console.error(combinedOutput);
    }

    process.exitCode = 1;
    return;
  }

  console.log(
    `[security:audit] No ${threshold}+ advisories outside the allowlist.`
  );
}

const cliOptions = parseArgs(process.argv.slice(2));

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  checkSecurityAdvisories(cliOptions).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
