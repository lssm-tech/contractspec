import {
  describe,
  expect,
  it,
  mock,
  spyOn,
  beforeEach,
  afterEach,
} from 'bun:test';
import { runImpactCommand } from '../impact';
import { runDiffCommand } from '../diff';
import { runCiCommand } from '../ci';
import { runVibeRunCommand } from '../vibe/run';

// Mock dependencies
const mockImpactResult = {
  hasBreaking: true,
  hasNonBreaking: true,
  summary: { breaking: 1, nonBreaking: 1, added: 1, removed: 0, info: 0 },
  deltas: [
    {
      rule: 'rule-1',
      specKey: 'spec-1',
      description: 'Breaking change',
      severity: 'breaking',
      path: 'path/to/spec',
    },
    {
      rule: 'rule-2',
      specKey: 'spec-2',
      description: 'Non-breaking change',
      severity: 'non_breaking',
      path: 'path/to/spec',
    },
  ],
  addedSpecs: [{ key: 'new-spec', version: '1.0', type: 'operation' }],
  removedSpecs: [],
  timestamp: '2025-01-01T00:00:00Z',
};

const mockDiffResult = {
  spec1: 'file1.ts',
  spec2: 'file2.ts',
  differences: [
    {
      type: 'breaking',
      path: 'field',
      description: 'removed',
      oldValue: 'a',
      newValue: undefined,
    },
  ],
};

const mockCiResult = {
  success: false,
  totalErrors: 1,
  totalWarnings: 0,
  totalNotes: 0,
  durationMs: 100,
  timestamp: '2025-01-01T00:00:00Z',
  commitSha: 'commit-sha',
  branch: 'main',
  issues: [
    {
      ruleId: 'rule-1',
      severity: 'error',
      message: 'Error',
      category: 'doctor',
      file: 'file.ts',
      line: 1,
    },
  ],
  categories: [],
};

const mockWorkflowResult = {
  success: true,
  stepsExecuted: ['step-1'],
  steps: [
    {
      id: 'step-1',
      name: 'Step 1',
      status: 'pass' as const,
      command: 'echo hello',
      artifactsTouched: ['file.ts'],
    },
  ],
  artifactsTouched: [],
  error: undefined,
};

// Mock workspace bundle
mock.module('@contractspec/bundle.workspace', () => ({
  createConsoleLoggerAdapter: () => ({}),
  createNodeFsAdapter: () => ({
    exists: () => true,
    readFile: () => 'content',
  }),
  createNodeGitAdapter: () => ({}),
  createNodeAdapters: () => ({
    fs: { exists: () => true, readFile: () => 'content' },
    git: {},
    logger: {
      debug: (_msg: unknown) => {
        /* noop */
      },
      info: (_msg: unknown) => {
        /* noop */
      },
      warn: (_msg: unknown) => {
        /* noop */
      },
      error: (_msg: unknown) => {
        /* noop */
      },
      createProgress: () => ({
        start: (_msg: unknown) => {
          /* noop */
        },
        stop: (_msg: unknown) => {
          /* noop */
        },
        fail: (_msg: unknown) => {
          /* noop */
        },
      }),
    },
  }),
  findWorkspaceRoot: () => '/root',
  impact: {
    detectImpact: async () => mockImpactResult,
    formatJson: (result: { hasBreaking: boolean; summary: unknown }) =>
      JSON.stringify({
        schemaVersion: '1.0',
        breaking: result.hasBreaking,
        changes: [],
        summary: result.summary, // simplistic mock implementation just to verifying plumbing,
        // OR we should rely on the *actual* formatter if we want to test the output structure correctness?
        // The actual formatter is in the bundle.
      }),
  },
  compareSpecs: async () => mockDiffResult,
  runCIChecks: async () => mockCiResult,
  formatters: {
    formatAsJson: (_result: unknown) =>
      JSON.stringify({ schemaVersion: '1.0', mocked: true }), // We want to test the actual formatter?
  },
  diffText: () => ({ output: 'diff output' }),
}));

// We actually want to import the formatters to test them, but they are in the bundle.
// If we mock the bundle, we mock the formatters.
// To test the *actual* output structure, we should NOT mock the formatters,
// OR we should verify that correct data is passed to the formatters.
// BUT the commands import formatters from the bundle.

// Better approach: Mock the *services* (detectImpact, runCIChecks) but let the *formatters* run if possible suitable.
// However `impact` service exports both `detectImpact` and `formatJson` on the same object.
// `formatters` export `formatAsJson`.

// If I mock the whole module, I mock the formatters too.
// I should implement the mock formatters to return what I expect the real ones to return?
// Or I should copy the formatter logic into the mock?
// Or I should change the mock to import the real formatters if possible?
// bun mock module replaces the whole module.

// Let's implement the mock formatters to match the schema we defined, verifying that the *command* calls them and outputs the result.
// AND separately we have unit tests for the formatters (json.test.ts).
// So here we verify that the command *uses* the formatter output.

// Note: Vibe workflow logic is now in @contractspec/bundle.workspace.
// The vibe run test uses dependency injection to inject mocks.

describe('CLI Commands JSON Output', () => {
  let consoleLogSpy: ReturnType<typeof spyOn>;
  let consoleErrorSpy: ReturnType<typeof spyOn>;
  let processExitSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    consoleLogSpy = spyOn(console, 'log').mockImplementation(
      (_msg: unknown) => {
        /* noop */
      }
    );
    consoleErrorSpy = spyOn(console, 'error').mockImplementation(
      (_msg: unknown) => {
        /* noop */
      }
    );
    processExitSpy = spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`Exit ${code}`);
    });
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  it('impact --format json', async () => {
    await runImpactCommand({ format: 'json' });
    const output = consoleLogSpy.mock.calls[0][0];
    const json = JSON.parse(output);
    expect(json.schemaVersion).toBe('1.0');
  });

  it('diff --json (semantic)', async () => {
    await runDiffCommand('file1.ts', 'file2.ts', {
      json: true,
      semantic: true,
    });
    const output = consoleLogSpy.mock.calls[0][0];
    const json = JSON.parse(output);
    expect(json.schemaVersion).toBe('1.0');
    expect(json.mode).toBe('semantic');
    expect(json.differences).toBeArray();
  });

  it('diff --json (text)', async () => {
    await runDiffCommand('file1.ts', 'file2.ts', { json: true });
    const output = consoleLogSpy.mock.calls[0][0];
    const json = JSON.parse(output);
    expect(json.schemaVersion).toBe('1.0');
    expect(json.mode).toBe('text');
    expect(json.diff).toBeDefined();
  });

  it('ci --format json (failure exit)', async () => {
    try {
      await runCiCommand({ format: 'json' });
    } catch (e) {
      expect((e as Error).message).toBe('Exit 1');
    }
    const output = consoleLogSpy.mock.calls[0][0];
    const json = JSON.parse(output);
    expect(json.schemaVersion).toBe('1.0');
  });

  it('vibe run --json', async () => {
    // Use dependency injection instead of global mock to avoid polluting engine.test.ts
    const mockDeps = {
      runWorkflow: async () => mockWorkflowResult,
      loadWorkflows: async () => [
        {
          id: 'test-workflow',
          name: 'Test',
          description: 'Test workflow',
          steps: [],
        },
      ],
      getWorkflow: async () => ({
        id: 'test-workflow',
        name: 'Test',
        description: 'Test workflow',
        steps: [],
      }),
      loadVibeConfig: async () => ({
        canonicalRoot: 'contracts',
        workRoot: '.contractspec/work',
        generatedRoot: 'src/generated',
        alwaysInjectFiles: [],
        contextExportAllowlist: [],
      }),
      findWorkspaceRoot: () => '/root',
    };

    await runVibeRunCommand(
      'test-workflow',
      { json: true, track: 'product' },
      mockDeps
    );
    const output = consoleLogSpy.mock.calls[0][0];
    const json = JSON.parse(output);
    expect(json.schemaVersion).toBe('1.0');
    expect(json.steps[0].name).toBe('step-1');
    expect(json.result.status).toBe('pass');
  });
});
