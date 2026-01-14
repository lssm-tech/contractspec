import { describe, it, expect, mock, beforeEach } from 'bun:test';
import {
  runDoctor,
  formatDoctorSummary,
  formatCheckResult,
} from './doctor-service';
import type { FsAdapter } from '../../ports/fs';
import type { LoggerAdapter } from '../../ports/logger';
import type { CheckResult } from './types';

// Mocks
const mockRunCliChecks = mock(() => Promise.resolve([] as CheckResult[]));
const mockRunConfigChecks = mock(() => Promise.resolve([]));
const mockRunMcpChecks = mock(() => Promise.resolve([]));
const mockRunDepsChecks = mock(() => Promise.resolve([]));
const mockRunWorkspaceChecks = mock(() => Promise.resolve([]));
const mockRunAiChecks = mock(() => Promise.resolve([]));
const mockRunLayerChecks = mock(() => Promise.resolve([]));
const mockIsMonorepo = mock(() => false);
const mockFindWorkspaceRoot = mock(() => '/root');
const mockFindPackageRoot = mock(() => '/root/pkg');
const mockGetPackageName = mock(() => 'pkg');

mock.module('./checks/index', () => ({
  runCliChecks: mockRunCliChecks,
  runConfigChecks: mockRunConfigChecks,
  runMcpChecks: mockRunMcpChecks,
  runDepsChecks: mockRunDepsChecks,
  runWorkspaceChecks: mockRunWorkspaceChecks,
  runAiChecks: mockRunAiChecks,
  runLayerChecks: mockRunLayerChecks,
}));

mock.module('../../adapters/workspace', () => ({
  findWorkspaceRoot: mockFindWorkspaceRoot,
  findPackageRoot: mockFindPackageRoot,
  isMonorepo: mockIsMonorepo,
  getPackageName: mockGetPackageName,
}));

describe('Doctor Service', () => {
  let mockFs: FsAdapter;
  let mockLogger: LoggerAdapter;

  beforeEach(() => {
    mockRunCliChecks.mockClear();
    mockRunConfigChecks.mockClear();
    mockRunMcpChecks.mockClear();
    mockRunDepsChecks.mockClear();
    mockRunWorkspaceChecks.mockClear();
    mockRunAiChecks.mockClear();
    mockRunLayerChecks.mockClear();
    mockIsMonorepo.mockClear();

    // Default mock implementation
    mockRunCliChecks.mockResolvedValue([] as CheckResult[]);
    mockRunConfigChecks.mockResolvedValue([]);

    mockFs = {} as FsAdapter;
    mockLogger = {
      info: mock(),
      warn: mock(),
      error: mock(),
    } as unknown as LoggerAdapter;
  });

  it('should run checks for all categories by default', async () => {
    const result = await runDoctor(
      { fs: mockFs, logger: mockLogger },
      { workspaceRoot: '/test' }
    );

    expect(result.checks).toEqual([]);
    expect(mockRunCliChecks).toHaveBeenCalled();
    expect(mockRunConfigChecks).toHaveBeenCalled();
    expect(mockRunMcpChecks).toHaveBeenCalled();
    expect(mockRunDepsChecks).toHaveBeenCalled();
    expect(mockRunWorkspaceChecks).toHaveBeenCalled();
    expect(mockRunAiChecks).toHaveBeenCalled();
    expect(mockRunLayerChecks).toHaveBeenCalled();
  });

  it('should run checks only for specified categories', async () => {
    await runDoctor(
      { fs: mockFs, logger: mockLogger },
      { categories: ['cli'], workspaceRoot: '/test' }
    );

    expect(mockRunCliChecks).toHaveBeenCalled();
    expect(mockRunConfigChecks).not.toHaveBeenCalled();
  });

  it('should skip AI checks if skipAi is true', async () => {
    await runDoctor(
      { fs: mockFs, logger: mockLogger },
      { skipAi: true, workspaceRoot: '/test' }
    );

    expect(mockRunAiChecks).not.toHaveBeenCalled();
  });

  it('should apply fixes automatically if autoFix is true', async () => {
    const mockFixApply = mock(() =>
      Promise.resolve({ success: true, message: 'Fixed it' })
    );
    const checkResult: CheckResult = {
      name: 'test check',
      status: 'fail',
      message: 'failed',
      category: 'cli',
      fix: { description: 'fix it', apply: mockFixApply },
    };
    mockRunCliChecks.mockResolvedValue([checkResult] as CheckResult[]);

    const result = await runDoctor(
      { fs: mockFs, logger: mockLogger },
      { autoFix: true, categories: ['cli'], workspaceRoot: '/test' }
    );

    expect(mockFixApply).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(result.checks[0]!.status).toBe('pass');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(result.checks[0]!.message).toContain('Fixed: Fixed it');
  });

  it('should prompt for fix if autoFix is false', async () => {
    const mockFixApply = mock(() =>
      Promise.resolve({ success: true, message: 'Fixed it' })
    );
    const checkResult: CheckResult = {
      name: 'test check',
      status: 'fail',
      message: 'failed',
      category: 'cli',
      fix: { description: 'fix it', apply: mockFixApply },
    };
    mockRunCliChecks.mockResolvedValue([checkResult] as CheckResult[]);

    const mockPromptConfirm = mock(() => Promise.resolve(true));

    const result = await runDoctor(
      { fs: mockFs, logger: mockLogger },
      { autoFix: false, categories: ['cli'], workspaceRoot: '/test' },
      { confirm: mockPromptConfirm, input: mock() }
    );

    expect(mockPromptConfirm).toHaveBeenCalled();
    expect(mockFixApply).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(result.checks[0]!.status).toBe('pass');
  });

  it('should NOT apply fix if prompt declines', async () => {
    const mockFixApply = mock(() =>
      Promise.resolve({ success: true, message: 'Fixed it' })
    );
    const checkResult: CheckResult = {
      name: 'test check',
      status: 'fail',
      message: 'failed',
      category: 'cli',
      fix: { description: 'fix it', apply: mockFixApply },
    };
    mockRunCliChecks.mockResolvedValue([checkResult] as CheckResult[]);

    const mockPromptConfirm = mock(() => Promise.resolve(false));

    const result = await runDoctor(
      { fs: mockFs, logger: mockLogger },
      { autoFix: false, categories: ['cli'], workspaceRoot: '/test' },
      { confirm: mockPromptConfirm, input: mock() }
    );

    expect(mockPromptConfirm).toHaveBeenCalled();
    expect(mockFixApply).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(result.checks[0]!.status).toBe('fail');
  });

  describe('formatDoctorSummary', () => {
    it('should format healthy summary', () => {
      const summary = formatDoctorSummary({
        checks: [],
        passed: 5,
        warnings: 0,
        failures: 0,
        skipped: 0,
        healthy: true,
      });
      expect(summary).toContain('✓ All checks passed!');
    });

    it('should format unhealthy summary', () => {
      const summary = formatDoctorSummary({
        checks: [],
        passed: 5,
        warnings: 0,
        failures: 1,
        skipped: 0,
        healthy: false,
      });
      expect(summary).toContain('✗ Some issues found');
    });
  });

  describe('formatCheckResult', () => {
    it('should format pass result', () => {
      const line = formatCheckResult({
        name: 'Check',
        status: 'pass',
        message: 'Ok',
        category: 'cli',
      });
      expect(line).toContain('✓ Check: Ok');
    });
    it('should format fail result', () => {
      const line = formatCheckResult({
        name: 'Check',
        status: 'fail',
        message: 'Bad',
        category: 'cli',
      });
      expect(line).toContain('✗ Check: Bad');
    });
    it('should format result with details and fix', () => {
      const line = formatCheckResult({
        name: 'Check',
        status: 'warn',
        message: 'Warn',
        category: 'cli',
        details: 'Details here',
        fix: { description: 'Do fix', apply: mock() },
      });
      expect(line).toContain('⚠ Check: Warn');
      expect(line).toContain('Details here');
      expect(line).toContain('Fix available: Do fix');
    });
  });
});
