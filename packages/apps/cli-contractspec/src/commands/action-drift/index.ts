import { Command } from 'commander';
import type {
  ContractVerificationStatus,
  DriftReportInputs,
  ReportData,
} from '@contractspec/bundle.workspace';
import {
  DriftActionService,
  PrActionService,
} from '@contractspec/bundle.workspace';
import fs from 'node:fs';
import chalk from 'chalk';

const driftService = new DriftActionService();
const prService = new PrActionService(); // Reusing detectDrift

export const actionDriftCommand = new Command('action-drift')
  .description('Internal commands for the ContractSpec Drift Action')
  .usage('<command> [options]');

function fail(message: string) {
  console.error(chalk.red(`::error::${message}`));
  process.exit(1);
}

function getEnv(name: string, required = false): string {
  const val = process.env[name] || '';
  if (required && !val) {
    fail(`Missing required environment variable: ${name}`);
  }
  return val;
}

// check-drift
actionDriftCommand
  .command('check-drift')
  .description('Detect drift from git status (reusing PrActionService logic)')
  .action(async () => {
    const statusPath = '.contractspec-ci/drift-status.txt';
    const output = '.contractspec-ci/drift-files.txt';

    if (!fs.existsSync(statusPath)) {
      fs.writeFileSync(output, '');
      console.log('DRIFT_STATUS=pass');
      console.log('DRIFT_DETECTED=false');
      return;
    }

    const lines = fs.readFileSync(statusPath, 'utf8').split('\n');
    const result = prService.detectDrift(lines);

    fs.writeFileSync(output, result.files.join('\n'));

    if (result.status === 'fail') {
      const envFile = process.env.GITHUB_ENV;
      if (envFile) {
        fs.appendFileSync(envFile, `DRIFT_STATUS=${result.status}\n`);
        fs.appendFileSync(
          envFile,
          `DRIFT_DETECTED=${result.status === 'fail'}\n`
        );
      }
      console.log(chalk.red(`Drift detected in ${result.files.length} files.`));
    } else {
      const envFile = process.env.GITHUB_ENV;
      if (envFile) {
        fs.appendFileSync(envFile, `DRIFT_STATUS=pass\n`);
        fs.appendFileSync(envFile, `DRIFT_DETECTED=false\n`);
      }
      console.log(chalk.green('No drift detected.'));
    }
  });

// build-report-data
actionDriftCommand
  .command('build-report-data')
  .description('Build drift report data')
  .action(async () => {
    // Inputs
    const contractsPath = '.contractspec-ci/contracts.json';
    let contractsJson: ContractVerificationStatus[] = [];
    try {
      contractsJson = fs.existsSync(contractsPath)
        ? JSON.parse(fs.readFileSync(contractsPath, 'utf8')).contracts || [] // Handle different structure if needed, but python code expected .contracts
        : [];
      // Python code: contracts_data = contracts_result.get("contracts", [])
      // The python code for action-drift expected `contracts` wrapper key.
      // `action-pr get-contract-status` returns { contracts: [...] }
    } catch {
      contractsJson = [];
    }

    // Existing report data?
    const reportDataPath = '.contractspec-ci/report-data.json';
    let existingReportData: ReportData | undefined;
    if (fs.existsSync(reportDataPath)) {
      try {
        existingReportData = JSON.parse(
          fs.readFileSync(reportDataPath, 'utf8')
        );
      } catch {
        //
      }
    }

    const driftStatus = getEnv('DRIFT_STATUS') || 'skipped';
    const driftFilesPath = '.contractspec-ci/drift-files.txt';
    const driftFiles = fs.existsSync(driftFilesPath)
      ? fs.readFileSync(driftFilesPath, 'utf8').split('\n').filter(Boolean)
      : [];

    const inputs: DriftReportInputs = {
      contractsJson,
      driftStatus,
      driftFiles,
      reportDataExists: !!existingReportData,
      existingReportData,
    };

    const reportData = driftService.buildReportData(inputs);
    fs.writeFileSync(
      '.contractspec-ci/report-data.json',
      JSON.stringify(reportData, null, 2)
    );
    console.log(chalk.green('Drift report data built.'));
  });

// finalize
actionDriftCommand
  .command('finalize')
  .description('Finalize drift results')
  .action(async () => {
    const dataPath = '.contractspec-ci/report-data.json';
    const onDrift = getEnv('ON_DRIFT') || 'fail';

    if (!fs.existsSync(dataPath)) {
      console.log('No report data found. Skipping finalization.');
      return;
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8')) as ReportData;
    const result = driftService.finalizeResults(data, onDrift);

    const envFile = process.env.GITHUB_OUTPUT;
    if (envFile) {
      fs.appendFileSync(envFile, `drift_detected=${result.driftDetected}\n`);
    }

    if (result.shouldFail) {
      fail('ContractSpec drift detected.');
    } else {
      console.log(chalk.green('Finalization complete. checks passed.'));
    }
  });
