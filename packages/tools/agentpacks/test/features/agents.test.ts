import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import {
  parseAgents,
  parseAgentFile,
  agentMatchesTarget,
} from '../../src/features/agents.js';

const TEST_DIR = join(import.meta.dirname, '..', '__fixtures__', 'agents-test');

beforeAll(() => {
  mkdirSync(TEST_DIR, { recursive: true });

  writeFileSync(
    join(TEST_DIR, 'code-reviewer.md'),
    [
      '---',
      'name: code-reviewer',
      'description: "Reviews code for quality"',
      'targets:',
      '  - "*"',
      '---',
      '',
      'You are a code review agent. Analyze code for quality issues.',
    ].join('\n')
  );

  writeFileSync(
    join(TEST_DIR, 'security-scanner.md'),
    [
      '---',
      'description: "Scans for security vulnerabilities"',
      'targets:',
      '  - opencode',
      '---',
      '',
      'Scan code for security issues and report findings.',
    ].join('\n')
  );

  writeFileSync(
    join(TEST_DIR, 'documenter.md'),
    'Generate documentation for the codebase.\n'
  );
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('parseAgents', () => {
  test('parses all agent files', () => {
    const agents = parseAgents(TEST_DIR, 'test-pack');
    expect(agents).toHaveLength(3);
  });

  test('parses agent names from frontmatter or filename', () => {
    const agents = parseAgents(TEST_DIR, 'test-pack');
    const reviewer = agents.find((a) => a.name === 'code-reviewer')!;
    expect(reviewer).toBeDefined();
    expect(reviewer.meta.description).toBe('Reviews code for quality');
  });

  test('falls back to filename for name', () => {
    const agents = parseAgents(TEST_DIR, 'test-pack');
    const doc = agents.find((a) => a.name === 'documenter')!;
    expect(doc).toBeDefined();
  });
});

describe('parseAgentFile', () => {
  test('parses a single agent file', () => {
    const agent = parseAgentFile(join(TEST_DIR, 'code-reviewer.md'), 'p');
    expect(agent.name).toBe('code-reviewer');
    expect(agent.content).toContain('code review agent');
  });
});

describe('agentMatchesTarget', () => {
  test('matches wildcard targets', () => {
    const agents = parseAgents(TEST_DIR, 'test-pack');
    const reviewer = agents.find((a) => a.name === 'code-reviewer')!;
    expect(agentMatchesTarget(reviewer, 'cursor')).toBe(true);
  });

  test('matches specific targets', () => {
    const agents = parseAgents(TEST_DIR, 'test-pack');
    const scanner = agents.find((a) => a.name === 'security-scanner')!;
    expect(agentMatchesTarget(scanner, 'opencode')).toBe(true);
    expect(agentMatchesTarget(scanner, 'cursor')).toBe(false);
  });

  test('matches when no targets specified', () => {
    const agents = parseAgents(TEST_DIR, 'test-pack');
    const doc = agents.find((a) => a.name === 'documenter')!;
    expect(agentMatchesTarget(doc, 'opencode')).toBe(true);
  });
});
