import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { parseSkills, skillMatchesTarget } from '../../src/features/skills.js';

const TEST_DIR = join(import.meta.dirname, '..', '__fixtures__', 'skills-test');

beforeAll(() => {
  // Skills are directory-based: skills/<name>/SKILL.md
  const migrationDir = join(TEST_DIR, 'migrate-component');
  mkdirSync(migrationDir, { recursive: true });
  writeFileSync(
    join(migrationDir, 'SKILL.md'),
    [
      '---',
      'name: migrate-component',
      'description: "Migrate a component to design system"',
      'targets:',
      '  - "*"',
      '---',
      '',
      'Follow these steps to migrate a raw HTML component.',
    ].join('\n')
  );

  const specDir = join(TEST_DIR, 'create-spec');
  mkdirSync(specDir, { recursive: true });
  writeFileSync(
    join(specDir, 'SKILL.md'),
    [
      '---',
      'description: "Create a new ContractSpec specification"',
      'targets:',
      '  - opencode',
      '---',
      '',
      'Create a new spec following the contract-first approach.',
    ].join('\n')
  );

  // Empty dir (no SKILL.md) — should be skipped
  mkdirSync(join(TEST_DIR, 'empty-skill'), { recursive: true });
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('parseSkills', () => {
  test('parses skill directories with SKILL.md', () => {
    const skills = parseSkills(TEST_DIR, 'test-pack');
    expect(skills).toHaveLength(2);
  });

  test('skips directories without SKILL.md', () => {
    const skills = parseSkills(TEST_DIR, 'test-pack');
    const names = skills.map((s) => s.name);
    expect(names).not.toContain('empty-skill');
  });

  test('parses skill name from frontmatter or directory name', () => {
    const skills = parseSkills(TEST_DIR, 'test-pack');
    const migrate = skills.find((s) => s.name === 'migrate-component')!;
    expect(migrate).toBeDefined();
    expect(migrate.meta.description).toBe(
      'Migrate a component to design system'
    );
  });

  test('includes sourceDir for each skill', () => {
    const skills = parseSkills(TEST_DIR, 'test-pack');
    for (const skill of skills) {
      expect(skill.sourceDir).toBeDefined();
    }
  });
});

describe('skillMatchesTarget', () => {
  test('matches wildcard targets', () => {
    const skills = parseSkills(TEST_DIR, 'test-pack');
    const migrate = skills.find((s) => s.name === 'migrate-component')!;
    expect(skillMatchesTarget(migrate, 'cursor')).toBe(true);
  });

  test('matches specific targets', () => {
    const skills = parseSkills(TEST_DIR, 'test-pack');
    const spec = skills.find((s) => s.name === 'create-spec')!;
    expect(skillMatchesTarget(spec, 'opencode')).toBe(true);
    expect(skillMatchesTarget(spec, 'cursor')).toBe(false);
  });
});
