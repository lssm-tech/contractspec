import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const actionPath = join(import.meta.dir, '..', 'action.yml');
const actionYaml = readFileSync(actionPath, 'utf8');

describe('action.drift metadata', () => {
  it('declares the composite action contract', () => {
    expect(actionYaml).toContain("name: 'ContractSpec Drift'");
    expect(actionYaml).toContain("using: 'composite'");
    expect(actionYaml).toContain('drift-detected:');
    expect(actionYaml).toContain('generate-command:');
  });

  it('includes the drift detection and reporting steps', () => {
    expect(actionYaml).toContain('action-drift check-drift');
    expect(actionYaml).toContain('action-drift build-report-data');
    expect(actionYaml).toContain('action-pr generate-report');
  });
});
