import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import {
  parseCommands,
  parseCommandFile,
  commandMatchesTarget,
} from '../../src/features/commands.js';

const TEST_DIR = join(
  import.meta.dirname,
  '..',
  '__fixtures__',
  'commands-test'
);

beforeAll(() => {
  mkdirSync(TEST_DIR, { recursive: true });

  writeFileSync(
    join(TEST_DIR, 'commit.md'),
    [
      '---',
      'description: "Create a conventional commit"',
      'targets:',
      '  - "*"',
      '---',
      '',
      'Create a conventional commit following the spec.',
    ].join('\n')
  );

  writeFileSync(
    join(TEST_DIR, 'lint.md'),
    [
      '---',
      'description: "Run linter"',
      'targets:',
      '  - opencode',
      '  - cursor',
      '---',
      '',
      'Run the project linter and fix issues.',
    ].join('\n')
  );

  writeFileSync(
    join(TEST_DIR, 'deploy.md'),
    'Deploy the application to production.\n'
  );
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('parseCommands', () => {
  test('parses all command files from directory', () => {
    const commands = parseCommands(TEST_DIR, 'test-pack');
    expect(commands).toHaveLength(3);
  });

  test('parses command names from filenames', () => {
    const commands = parseCommands(TEST_DIR, 'test-pack');
    const names = commands.map((c) => c.name).sort();
    expect(names).toEqual(['commit', 'deploy', 'lint']);
  });

  test('parses frontmatter metadata', () => {
    const commands = parseCommands(TEST_DIR, 'test-pack');
    const commit = commands.find((c) => c.name === 'commit')!;
    expect(commit.meta.description).toBe('Create a conventional commit');
  });

  test('parses content without frontmatter', () => {
    const commands = parseCommands(TEST_DIR, 'test-pack');
    const deploy = commands.find((c) => c.name === 'deploy')!;
    expect(deploy.content).toContain('Deploy the application');
  });

  test('sets packName correctly', () => {
    const commands = parseCommands(TEST_DIR, 'my-pack');
    expect(commands.every((c) => c.packName === 'my-pack')).toBe(true);
  });
});

describe('parseCommandFile', () => {
  test('parses a single command file', () => {
    const cmd = parseCommandFile(join(TEST_DIR, 'lint.md'), 'test');
    expect(cmd.name).toBe('lint');
    expect(cmd.meta.description).toBe('Run linter');
    expect(cmd.content).toContain('Run the project linter');
  });
});

describe('commandMatchesTarget', () => {
  test('matches wildcard targets', () => {
    const commands = parseCommands(TEST_DIR, 'test-pack');
    const commit = commands.find((c) => c.name === 'commit')!;
    expect(commandMatchesTarget(commit, 'opencode')).toBe(true);
    expect(commandMatchesTarget(commit, 'cursor')).toBe(true);
    expect(commandMatchesTarget(commit, 'claudecode')).toBe(true);
  });

  test('matches specific targets', () => {
    const commands = parseCommands(TEST_DIR, 'test-pack');
    const lint = commands.find((c) => c.name === 'lint')!;
    expect(commandMatchesTarget(lint, 'opencode')).toBe(true);
    expect(commandMatchesTarget(lint, 'cursor')).toBe(true);
    expect(commandMatchesTarget(lint, 'claudecode')).toBe(false);
  });

  test('matches when no targets specified (defaults to all)', () => {
    const commands = parseCommands(TEST_DIR, 'test-pack');
    const deploy = commands.find((c) => c.name === 'deploy')!;
    expect(commandMatchesTarget(deploy, 'opencode')).toBe(true);
  });
});
