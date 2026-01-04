import { describe, expect, it } from 'bun:test';
import { generateMigrationSpec } from './migration';
import type { MigrationSpecData } from '../types/spec-types';

describe('generateMigrationSpec', () => {
  const baseData: MigrationSpecData = {
    name: 'test.migration',
    version: '1',
    description: 'Test migration',
    owners: ['team-a'],
    tags: ['test'],
    stability: 'stable',
    title: 'Test Migration',
    domain: 'test-domain',
    dependencies: [],
    up: [],
    down: [],
  };

  it('generates a migration spec', () => {
    const code = generateMigrationSpec(baseData);
    expect(code).toContain("import type { MigrationSpec } from '@contractspec/lib.contracts/migrations'");
    expect(code).toContain('export const Test_migrationMigration: MigrationSpec = {');
    expect(code).toContain('up: [');
  });

  it('renders schema steps', () => {
    const data: MigrationSpecData = {
      ...baseData,
      up: [{ kind: 'schema', sql: 'CREATE TABLE foo;' }],
    };
    const code = generateMigrationSpec(data);
    expect(code).toContain("kind: 'schema'");
    expect(code).toContain("sql: `CREATE TABLE foo;`");
  });

  it('renders data steps', () => {
    const data: MigrationSpecData = {
      ...baseData,
      up: [{ kind: 'data', script: 'updateUsers()' }],
    };
    const code = generateMigrationSpec(data);
    expect(code).toContain("kind: 'data'");
    expect(code).toContain("script: `updateUsers()`");
  });

  it('renders validation steps', () => {
    const data: MigrationSpecData = {
      ...baseData,
      up: [{ kind: 'validation', assertion: 'count > 0' }],
    };
    const code = generateMigrationSpec(data);
    expect(code).toContain("kind: 'validation'");
    expect(code).toContain("assertion: `count > 0`");
  });

  it('renders dependencies', () => {
    const data: MigrationSpecData = {
      ...baseData,
      dependencies: ['mig.v1', 'mig.v2'],
    };
    const code = generateMigrationSpec(data);
    expect(code).toContain("dependencies: ['mig.v1', 'mig.v2']");
  });
});
