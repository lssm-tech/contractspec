import { describe, expect, it, mock, beforeEach } from 'bun:test';
import { listSpecs, groupSpecsByType } from './list';
import type { SpecScanResult } from '@contractspec/module.workspace';
import type { FsAdapter } from '../ports/fs';

const mockScanSpecSource = mock(
  (content: string) =>
    ({
      specType: content.includes('operation') ? 'operation' : 'event',
      key: 'test',
    }) as unknown as SpecScanResult
);

describe('List Service', () => {
  const mockFs = {
    glob: mock(() => Promise.resolve(['spec1.ts', 'spec2.ts'])),
    readFile: mock((path: string) =>
      Promise.resolve(path.includes('1') ? 'operation' : 'other')
    ),
  };

  beforeEach(() => {
    mockFs.glob.mockClear();
    mockFs.readFile.mockClear();
    mockScanSpecSource.mockClear();
  });

  describe('listSpecs', () => {
    it('should list all specs', async () => {
      const results = await listSpecs({
        fs: mockFs as unknown as FsAdapter,
        scan: mockScanSpecSource,
      });
      expect(results).toHaveLength(2);
      expect(mockFs.glob).toHaveBeenCalled();
    });

    it('should filter by type', async () => {
      const results = await listSpecs(
        { fs: mockFs as unknown as FsAdapter, scan: mockScanSpecSource },
        { type: 'operation' }
      );

      expect(results).toHaveLength(1);
      expect(results[0]?.specType).toBe('operation');
    });
  });

  describe('groupSpecsByType', () => {
    it('should group correctly', () => {
      const specs = [
        { specType: 'operation', key: 'a' },
        { specType: 'operation', key: 'b' },
        { specType: 'event', key: 'c' },
      ] as SpecScanResult[];

      const groups = groupSpecsByType(specs);

      expect(groups.size).toBe(2);
      expect(groups.get('operation')).toHaveLength(2);
      expect(groups.get('event')).toHaveLength(1);
    });
  });
});
