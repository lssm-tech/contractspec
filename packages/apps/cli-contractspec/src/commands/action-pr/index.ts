import { Command } from 'commander';
import type {
  ContractVerificationStatus,
  ReportData,
  ReportInputs,
} from '@contractspec/bundle.workspace';
import {
  operationRegistry,
  PrActionService,
} from '@contractspec/bundle.workspace';
import fs from 'node:fs';
import chalk from 'chalk';

const service = new PrActionService();

export const actionPrCommand = new Command('action-pr')
  .description('Internal commands for the ContractSpec PR Action')
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

// collect-changes
actionPrCommand
  .command('collect-changes')
  .description('Filter changed files against contracts directory/glob')
  .action(async () => {
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
    console.log(
      chalk.green(`Collected ${filtered.length} changed contract files.`)
    );
  });

// check-drift
actionPrCommand
  .command('check-drift')
  .description('Detect drift from git status')
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
    const result = service.detectDrift(lines);

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

// get-contract-status
actionPrCommand
  .command('get-contract-status')
  .description('Retrieve verification status for contracts')
  .action(async () => {
    const output = '.contractspec-ci/contracts.json';
    try {
      console.log('Collecting contract verification status...');
      const result = await operationRegistry.execute(
        'report.getContractVerificationStatus',
        '1.0.0',
        { projectPath: process.cwd() },
        {}
      );
      fs.writeFileSync(output, JSON.stringify(result, null, 2));
      console.log(chalk.green('Contract verification status collected.'));
    } catch (err) {
      console.error(
        chalk.yellow(
          'Failed to get contract verification status (continuing with empty):'
        ),
        err
      );
      fs.writeFileSync(output, JSON.stringify({ contracts: [] }));
    }
  });

// build-report-data
actionPrCommand
  .command('build-report-data')
  .description('Aggregate analysis results into report data')
  .action(async () => {
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
        : [];
      if (!contractsJson) contractsJson = [];
    } catch {
      contractsJson = [];
    }

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
    console.log(chalk.green('Report data built.'));
  });

// generate-report
actionPrCommand
  .command('generate-report')
  .description('Render the markdown report')
  .action(async () => {
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
    const contentProvider = (filePath: string) => {
      if (fs.existsSync(filePath)) return fs.readFileSync(filePath, 'utf8');
      return '';
    };

    const markdown = service.generateReportMarkdown(data, contentProvider);
    fs.writeFileSync(outputPath, markdown);

    // Add to summary
    const summaryPath = process.env.GITHUB_STEP_SUMMARY;
    if (summaryPath) {
      fs.appendFileSync(summaryPath, markdown);
    }
    console.log(chalk.green(`Report generated at ${outputPath}`));
  });

// finalize
actionPrCommand
  .command('finalize')
  .description(
    'Determine final success/failure status and output GH action vars'
  )
  .action(async () => {
    const dataPath = '.contractspec-ci/report-data.json';
    const failOn = getEnv('FAIL_ON') || 'any';

    if (!fs.existsSync(dataPath)) {
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
      fail(`ContractSpec checks failed: ${reasons} (fail_on=${failOn}).`);
    } else {
      console.log(chalk.green('Finalization complete. Checks passed.'));
    }
  });
