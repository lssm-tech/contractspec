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

function runReport(dataPath: string): { report: string; summary: string } {
  if (!fs.existsSync(distPath)) {
    throw new Error('dist/report.js not found; run bun run build first.');
  }

  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'contractspec-drift-report-')
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

describe('drift report generator', () => {
  test('writes summary', () => {
    const { report, summary } = runReport(fixturePath);

    expect(report).toContain('## ContractSpec Report');
    expect(report).toContain('### 4) Drift results');

    expect(summary).toContain('## ContractSpec Report');
  });
});

describe('drift report generator - verification table', () => {
  test('renders table when contracts present', () => {
    const { report } = runReport(fixtureWithContractsPath);
    expect(report).toContain('### Overall verification status');
    expect(report).toContain(
      '| Contract / Endpoint / Event | Last verified commit | Time since verified | Surfaces covered | Drift debt |'
    );
    expect(report).toContain('| user.create |');
    expect(report).toContain('| order.updated |');
  });

  test('skips table when contracts absent', () => {
    const { report } = runReport(fixturePath);
    expect(report).not.toContain('Overall verification status');
  });

  test('skips table when contracts empty', () => {
    const { report } = runReport(fixtureEmptyContractsPath);
    expect(report).not.toContain('Overall verification status');
  });

  test('handles missing optional fields', () => {
    const { report } = runReport(fixtureWithContractsPath);
    // order.updated has no lastVerifiedSha or lastVerifiedDate
    expect(report).toContain('\u2014');
    expect(report).toContain('Never');
  });

  test('renders all table columns', () => {
    const { report } = runReport(fixtureWithContractsPath);
    expect(report).toContain('abc1234');
    expect(report).toContain('API, runtime validation, permissions');
    expect(report).toContain('| 0 |');
    expect(report).toContain('| 3 |');
  });
});

describe('drift report generator - backward compatibility', () => {
  test('maintains existing sections', () => {
    const { report } = runReport(fixtureWithContractsPath);
    expect(report).toContain('### 1) What changed');
    expect(report).toContain('### 2) Risk classification');
    expect(report).toContain('### 3) Validation results');
    expect(report).toContain('### 4) Drift results');
    expect(report).toContain('### 5) Next steps');
  });
});
