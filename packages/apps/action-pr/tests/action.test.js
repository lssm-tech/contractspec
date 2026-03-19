import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const actionPath = join(import.meta.dir, '..', 'action.yml');
const actionYaml = readFileSync(actionPath, 'utf8');

describe('action.pr metadata', () => {
  it('declares the composite action contract', () => {
    expect(actionYaml).toContain("name: 'ContractSpec PR'");
    expect(actionYaml).toContain("using: 'composite'");
    expect(actionYaml).toContain('drift-detected:');
    expect(actionYaml).toContain('breaking-change-detected:');
  });

  it('includes the core PR verification steps', () => {
    expect(actionYaml).toContain('action-pr collect-changes');
    expect(actionYaml).toContain('impact --baseline');
    expect(actionYaml).toContain('action-pr build-report-data');
  });
});
