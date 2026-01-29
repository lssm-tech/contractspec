import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect, describe } from 'bun:test';

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const distPath = path.join(packageRoot, 'dist', 'report.js');
const fixturePath = path.join(packageRoot, 'fixtures', 'report-data.json');
const fixtureWithContractsPath = path.join(
  packageRoot,
  'fixtures',
  'report-data-with-contracts.json'
);
const fixtureEmptyContractsPath = path.join(
  packageRoot,
  'fixtures',
  'report-data-empty-contracts.json'
);
const fixtureSingleContractPath = path.join(
  packageRoot,
  'fixtures',
  'report-data-single-contract.json'
);
const fixtureEdgeCasesPath = path.join(
  packageRoot,
  'fixtures',
  'report-data-edge-cases.json'
);

function runReport(dataPath: string): { report: string; summary: string } {
  if (!fs.existsSync(distPath)) {
    throw new Error('dist/report.js not found; run bun run build first.');
  }

  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'contractspec-report-')
  );
  const outputPath = path.join(tempDir, 'report.md');
  const summaryPath = path.join(tempDir, 'summary.md');

  const result = spawnSync(
    'node',
    [
      distPath,
      '--data',
      dataPath,
      '--output',
      outputPath,
      '--summary',
      summaryPath,
    ],
    { cwd: packageRoot, encoding: 'utf8' }
  );

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`Report exited with ${result.status}: ${result.stderr}`);
  }

  return {
    report: fs.readFileSync(outputPath, 'utf8'),
    summary: fs.readFileSync(summaryPath, 'utf8'),
  };
}

describe('report generator', () => {
  test('writes summary without contracts', () => {
    const { report, summary } = runReport(fixturePath);

    expect(report).toContain('## ContractSpec Report');
    expect(report).toContain('### 4) Drift results');
    expect(report).not.toContain('Overall verification status');

    expect(summary).toContain('## ContractSpec Report');
  });

  test('renders verification table when contracts are present', () => {
    const { report } = runReport(fixtureWithContractsPath);

    expect(report).toContain('### Overall verification status');
    expect(report).toContain(
      '| Contract / Endpoint / Event | Last verified commit | Time since verified | Surfaces covered | Drift debt |'
    );
    expect(report).toContain('| user.create |');
    expect(report).toContain('abc1234');
    expect(report).toContain('| order.updated |');
    expect(report).toContain('Never');
    expect(report).toContain('| 3 |');
    // Existing sections still present
    expect(report).toContain('### 1) What changed');
  });

  test('skips table for empty contracts array', () => {
    const { report } = runReport(fixtureEmptyContractsPath);
    expect(report).not.toContain('Overall verification status');
    expect(report).toContain('### 1) What changed');
  });

  test('renders table for single contract', () => {
    const { report } = runReport(fixtureSingleContractPath);
    expect(report).toContain('### Overall verification status');
    expect(report).toContain('| payment.process |');
    expect(report).toContain('def5678');
    expect(report).toContain('| 1 |');
  });

  test('renders em-dash when lastVerifiedSha missing', () => {
    const { report } = runReport(fixtureWithContractsPath);
    // order.updated has no lastVerifiedSha
    expect(report).toContain('\u2014');
  });

  test('renders "Never" when lastVerifiedDate missing', () => {
    const { report } = runReport(fixtureWithContractsPath);
    // order.updated has no lastVerifiedDate
    expect(report).toContain('Never');
  });

  test('handles contract with empty surfaces array', () => {
    const { report } = runReport(fixtureEdgeCasesPath);
    // org.team:member/create has empty surfaces
    expect(report).toContain('| org.team:member/create |');
  });

  test('handles contract with many surfaces (comma-separated)', () => {
    const { report } = runReport(fixtureEdgeCasesPath);
    expect(report).toContain(
      'API, runtime validation, UI form, docs/examples, permissions'
    );
  });

  test('handles zero drift mismatches', () => {
    const { report } = runReport(fixtureWithContractsPath);
    expect(report).toContain('| 0 |');
  });

  test('handles large drift mismatch counts', () => {
    const { report } = runReport(fixtureEdgeCasesPath);
    expect(report).toContain('| 999 |');
  });

  test('handles contract names with dots, colons, slashes', () => {
    const { report } = runReport(fixtureEdgeCasesPath);
    expect(report).toContain('org.team:member/create');
    expect(report).toContain('billing.invoice.v2');
  });
});

describe('report generator - backward compatibility', () => {
  test('preserves all 5 existing sections when contracts present', () => {
    const { report } = runReport(fixtureWithContractsPath);
    expect(report).toContain('### 1) What changed');
    expect(report).toContain('### 2) Risk classification');
    expect(report).toContain('### 3) Validation results');
    expect(report).toContain('### 4) Drift results');
    expect(report).toContain('### 5) Next steps');
  });

  test('keeps section order unchanged', () => {
    const { report } = runReport(fixtureWithContractsPath);
    const idx1 = report.indexOf('### Overall verification status');
    const idx2 = report.indexOf('### 1) What changed');
    const idx3 = report.indexOf('### 2) Risk classification');
    const idx4 = report.indexOf('### 3) Validation results');
    const idx5 = report.indexOf('### 4) Drift results');
    const idx6 = report.indexOf('### 5) Next steps');
    expect(idx1).toBeLessThan(idx2);
    expect(idx2).toBeLessThan(idx3);
    expect(idx3).toBeLessThan(idx4);
    expect(idx4).toBeLessThan(idx5);
    expect(idx5).toBeLessThan(idx6);
  });
});
