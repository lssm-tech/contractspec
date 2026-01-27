import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test, expect } from 'bun:test';

const packageRoot = process.cwd();
const distPath = path.join(packageRoot, 'dist', 'report.js');
const fixturePath = path.join(packageRoot, 'fixtures', 'report-data.json');

test('report generator writes summary', () => {
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
      fixturePath,
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

  expect(result.status).toBe(0);

  const report = fs.readFileSync(outputPath, 'utf8');
  expect(report).toContain('## ContractSpec Report');
  expect(report).toContain('### 4) Drift results');

  const summary = fs.readFileSync(summaryPath, 'utf8');
  expect(summary).toContain('## ContractSpec Report');
});
