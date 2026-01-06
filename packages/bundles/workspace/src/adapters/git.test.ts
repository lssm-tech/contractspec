import { describe, expect, it, mock, beforeEach, afterEach } from 'bun:test';
import { createNodeGitAdapter } from './git';

describe('Git Adapter', () => {
  const mockExecSync = mock((_command: string) => '');
  const mockAccess = mock((_path: string) => Promise.resolve());

  beforeEach(() => {
    mockExecSync.mockClear();
    mockAccess.mockClear();

    // Patch globals/modules
    mock.module('node:child_process', () => ({
      execSync: mockExecSync,
    }));
    mock.module('node:fs/promises', () => ({
      access: mockAccess,
    }));

    // Reset implementations
    mockExecSync.mockImplementation(() => '');
  });

  afterEach(() => {
    mock.restore();
  });

  const adapter = createNodeGitAdapter('/test/cwd');

  describe('showFile', () => {
    it('should return file content', async () => {
      mockExecSync.mockReturnValue('content');
      const content = await adapter.showFile('HEAD', 'file.ts');
      expect(content).toBe('content');
      expect(mockExecSync).toHaveBeenCalledWith(
        'git show HEAD:file.ts',
        expect.objectContaining({ cwd: '/test/cwd' })
      );
    });

    it('should throw on error', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('git error');
      });
      expect(adapter.showFile('HEAD', 'file.ts')).rejects.toThrow('git error');
    });
  });

  describe('isGitRepo', () => {
    it('should return true if .git exists', async () => {
      mockAccess.mockResolvedValue(undefined);
      const isRepo = await adapter.isGitRepo();
      expect(isRepo).toBe(true);
    });

    it('should return false if .git missing', async () => {
      mockAccess.mockRejectedValue(new Error('ENOENT'));
      const isRepo = await adapter.isGitRepo();
      expect(isRepo).toBe(false);
    });
  });

  describe('clean', () => {
    it('should execute git clean', async () => {
      await adapter.clean({ force: true, directories: true });
      expect(mockExecSync).toHaveBeenCalledWith(
        'git clean -f -d',
        expect.objectContaining({ cwd: '/test/cwd' })
      );
    });

    it('should support dry run', async () => {
      await adapter.clean({ dryRun: true });
      expect(mockExecSync).toHaveBeenCalledWith(
        'git clean --dry-run',
        expect.objectContaining({ cwd: '/test/cwd' })
      );
    });
  });

  describe('log', () => {
    it('should return parsed log entries', async () => {
      const logOutput =
        'hash1|||msg1|||user1|||2025-01-01\n' +
        'hash2|||msg2|||user2|||2025-01-02';
      mockExecSync.mockReturnValue(logOutput);

      const entries = await adapter.log();

      expect(entries).toHaveLength(2);
      expect(entries[0]).toEqual({
        hash: 'hash1',
        message: 'msg1',
        author: 'user1',
        date: '2025-01-01',
      });
    });

    it('should handle empty log', async () => {
      mockExecSync.mockReturnValue('');
      const entries = await adapter.log();
      expect(entries).toHaveLength(0);
    });

    it('should return empty array on failure', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('git error');
      });
      const entries = await adapter.log();
      expect(entries).toEqual([]);
    });
  });
});
