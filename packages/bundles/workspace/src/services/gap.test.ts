/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, mock, beforeEach } from 'bun:test';
import { analyzeGap } from './gap';
import type { FsAdapter } from '../ports/fs';

describe('Gap Analysis Service', () => {
  const mockFs = {
    exists: mock(() => Promise.resolve(false)),
    glob: mock(() => Promise.resolve([] as string[])),
    readFile: mock(() => Promise.resolve('')),
    join: mock((...args: string[]) => args.join('/')),
  };

  const mockScan = mock(() => ({
    specType: 'operation',
    key: 'spec1',
    filePath: 'contracts/spec1.ts',
  }));

  beforeEach(() => {
    mockFs.exists.mockClear();
    mockFs.glob.mockClear();
    mockFs.readFile.mockClear();
  });

  it('should return empty result if contracts dir is missing', async () => {
    mockFs.exists.mockResolvedValue(false);

    const result = await analyzeGap(
      { fs: mockFs as unknown as FsAdapter, scan: mockScan },
      '/cwd'
    );

    expect(result.hasContracts).toBe(false);
    expect(result.totalSpecs).toBe(0);
  });

  it('should detect missing generated dir', async () => {
    mockFs.exists.mockImplementation((async (p: string) => {
      if (p.endsWith('contracts')) return true;
      return false;
    }) as any);
    mockFs.glob.mockResolvedValue(['contracts/spec1.ts']);

    const result = await analyzeGap(
      { fs: mockFs as unknown as FsAdapter, scan: mockScan },
      '/cwd'
    );

    expect(result.hasContracts).toBe(true);
    expect(result.hasGenerated).toBe(false);
    expect(result.missingDocs.length).toBe(1);
    expect(result.missingDocs[0]).toBe('spec1');
  });

  it('should detect missing docs', async () => {
    mockFs.exists.mockImplementation((async (p: string) => {
      if (p.endsWith('contracts')) return true;
      if (p.endsWith('generated')) return true;
      if (p.includes('spec1.md')) return false; // Missing doc
      return true; // contracts exists
    }) as any);
    mockFs.glob.mockResolvedValue(['contracts/spec1.ts']);

    const result = await analyzeGap(
      { fs: mockFs as unknown as FsAdapter, scan: mockScan },
      '/cwd'
    );

    expect(result.missingDocs[0]).toBe('spec1');
  });

  it('should detect missing registry files', async () => {
    mockFs.exists.mockImplementation((async (p: string) => {
      if (p.endsWith('index.ts') || p.endsWith('registry.ts')) return false;
      return true;
    }) as any);
    mockFs.glob.mockResolvedValue(['contracts/spec1.ts']);

    const result = await analyzeGap(
      { fs: mockFs as unknown as FsAdapter, scan: mockScan },
      '/cwd'
    );

    expect(result.missingIndex).toBe(true);
    expect(result.missingRegistry).toBe(true);
  });
});
