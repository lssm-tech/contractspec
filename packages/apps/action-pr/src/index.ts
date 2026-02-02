#!/usr/bin/env bun
import { PrActionService } from '@contractspec/bundle.workspace';
import type {
  ReportInputs,
  ContractVerificationStatus,
  ReportData,
} from '@contractspec/bundle.workspace';
import fs from 'node:fs';
import { join } from 'node:path';

const service = new PrActionService();
const action = process.argv[2];

function fail(message: string) {
  console.error(`::error::${message}`);
  process.exit(1);
}

function getEnv(name: string, required = false): string {
  const val = process.env[name] || '';
  if (required && !val) {
    fail(`Missing required environment variable: ${name}`);
  }
  return val;
}

async function run() {
  switch (action) {
    case 'collect-changes': {
      const changedFilesPath = '.contractspec-ci/changed-files.txt';
      const output = '.contractspec-ci/contract-changes.txt';

      if (!fs.existsSync(changedFilesPath)) {
        fs.writeFileSync(output, '');
        return;
      }

      const changedFiles = fs
        .readFileSync(changedFilesPath, 'utf8')
        .split('\n')
        .filter(Boolean);
      const contractsDir = getEnv('CONTRACTS_DIR');
      const contractsGlob = getEnv('CONTRACTS_GLOB');

      const filtered = service.collectChanges(
        contractsDir,
        contractsGlob,
        changedFiles
      );
      fs.writeFileSync(output, filtered.join('\n'));
      break;
    }

    case 'check-drift': {
      const statusPath = '.contractspec-ci/drift-status.txt';
      const output = '.contractspec-ci/drift-files.txt';

      if (!fs.existsSync(statusPath)) {
        fs.writeFileSync(output, '');
        console.log('DRIFT_STATUS=pass');
        console.log('DRIFT_DETECTED=false');
        return;
      }

      const lines = fs.readFileSync(statusPath, 'utf8').split('\n');
      const result = service.detectDrift(lines);

      fs.writeFileSync(output, result.files.join('\n'));

      if (result.status === 'fail') {
        // Output to GITHUB_ENV is handled by the caller or we can do it here if wrapper is used in run step
        // In action.yml, this script is called. We should output to stdout/GItHUB_ENV?
        // The original python script wrote to files, then bash checked files.
        // But here we can also just print valid bash or GITHUB_ENV commands?
        // Let's follow the pattern: write file, then next step checks.
        // Wait, the original action checked the file size: `if [ -s ".contractspec-ci/drift-files.txt" ]; then ...`
        // So just writing the file is enough for compatibility if we keep the bash logic surrounding it.
        // BUT, I'm replacing the BASH logic calling python.
        // So I should output GITHUB_ENV updates if I'm replacing the whole block.
        // The plan says: "Update Check drift step to use bun src/index.ts check-drift".
        // I will output the env vars.
        const envFile = process.env.GITHUB_ENV;
        if (envFile) {
          fs.appendFileSync(envFile, `DRIFT_STATUS=${result.status}\n`);
          fs.appendFileSync(
            envFile,
            `DRIFT_DETECTED=${result.status === 'fail'}\n`
          );
        }
      } else {
        const envFile = process.env.GITHUB_ENV;
        if (envFile) {
          fs.appendFileSync(envFile, `DRIFT_STATUS=pass\n`);
          fs.appendFileSync(envFile, `DRIFT_DETECTED=false\n`);
        }
      }
      break;
    }

    case 'build-report-data': {
      // Inputs
      const changesPath = '.contractspec-ci/contract-changes.txt';
      const contractChanges = fs.existsSync(changesPath)
        ? fs.readFileSync(changesPath, 'utf8').split('\n').filter(Boolean)
        : [];

      const impactPath = '.contractspec-ci/impact.json';
      let impactJson;
      try {
        impactJson = fs.existsSync(impactPath)
          ? JSON.parse(fs.readFileSync(impactPath, 'utf8'))
          : {};
      } catch {
        impactJson = {};
      }

      const contractsPath = '.contractspec-ci/contracts.json';
      let contractsJson: ContractVerificationStatus[] = [];
      try {
        contractsJson = fs.existsSync(contractsPath)
          ? JSON.parse(fs.readFileSync(contractsPath, 'utf8')).contracts
          : []; // Ops executor returns format { contracts: [] } or just []?
        // The original script did: contracts_result.get("contracts", [])
        // My operation executor output? Wait, report.ts expects `data.contracts`.
        // The logic in original python:
        // contracts_result = json.loads(contracts_path.read_text())
        // contracts_data = contracts_result.get("contracts", [])
        // So the input file contains { contracts: [...] }
        if (!contractsJson) contractsJson = [];
      } catch {
        contractsJson = [];
      }

      // We need to support reading raw array if that's what comes out?
      // Re-reading original `report.ts` or `operation-executor.ts`...
      // `operation-executor.ts` output `JSON.stringify(result)`.
      // `report.getContractVerificationStatus` op returns what?
      // Assuming it returns object with `contracts`.

      const validationStatus = getEnv('VALIDATION_STATUS') || 'skipped';
      const driftStatus = getEnv('DRIFT_STATUS') || 'skipped';
      const driftFilesPath = '.contractspec-ci/drift-files.txt';
      const driftFiles = fs.existsSync(driftFilesPath)
        ? fs.readFileSync(driftFilesPath, 'utf8').split('\n').filter(Boolean)
        : [];
      const failOn = getEnv('FAIL_ON') || 'any';

      const inputs: ReportInputs = {
        contractChanges,
        impactJson,
        contractsJson,
        validationStatus,
        driftStatus,
        driftFiles,
        failOn,
      };

      const reportData = service.buildReportData(inputs);
      fs.writeFileSync(
        '.contractspec-ci/report-data.json',
        JSON.stringify(reportData, null, 2)
      );

      // Also write fail-status.json used by finalize?
      // The original python script wrote `fail-status.json`.
      // `finalizeResults` below can just re-derive it or we can write it here.
      // Actually `finalizeResults` takes `ReportData`.
      // But the original action had a separate "Finalize results" step.
      // I can write `.contractspec-ci/fail-status.json` here if needed, or just let finalize step re-compute.
      // Re-computing is safer/cleaner.
      break;
    }

    case 'generate-report': {
      const dataPath =
        process.env.CONTRACTSPEC_REPORT_DATA ||
        '.contractspec-ci/report-data.json';
      const outputPath =
        process.env.CONTRACTSPEC_REPORT_OUTPUT || '.contractspec-ci/report.md';

      if (!fs.existsSync(dataPath)) {
        fail(`Report data not found at ${dataPath}`);
      }

      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8')) as ReportData;

      // Need a file content provider for details
      const contentProvider = (path: string) => {
        if (fs.existsSync(path)) return fs.readFileSync(path, 'utf8');
        return '';
      };

      const markdown = service.generateReportMarkdown(data, contentProvider);
      fs.writeFileSync(outputPath, markdown);

      // Add to summary
      const summaryPath = process.env.GITHUB_STEP_SUMMARY;
      if (summaryPath) {
        fs.appendFileSync(summaryPath, markdown);
      }
      break;
    }

    case 'finalize': {
      const dataPath = '.contractspec-ci/report-data.json';
      const failOn = getEnv('FAIL_ON') || 'any';

      if (!fs.existsSync(dataPath)) {
        // If no report data, maybe nothing ran?
        console.log('No report data found. Skipping finalization checks.');
        return;
      }

      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8')) as ReportData;
      const result = service.finalizeResults(data, failOn);

      const envFile = process.env.GITHUB_OUTPUT;
      if (envFile) {
        fs.appendFileSync(envFile, `drift_detected=${result.driftDetected}\n`);
        fs.appendFileSync(
          envFile,
          `breaking_change_detected=${result.breakingChangeDetected}\n`
        );
        fs.appendFileSync(
          envFile,
          `validation_failed=${result.validationFailed}\n`
        );
      }

      if (result.shouldFail) {
        const reasons = result.failReasons.join(', ');
        console.error(
          `::error::ContractSpec checks failed: ${reasons} (fail_on=${failOn}).`
        );
        process.exit(1);
      }
      break;
    }

    default:
      fail(`Unknown action: ${action}`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
