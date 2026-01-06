
import { describe, it, expect, mock, beforeEach } from 'bun:test';
import { runCIChecks } from './ci-check-service';
import type { FsAdapter } from '../../ports/fs';
import type { LoggerAdapter } from '../../ports/logger';

// Mock dependencies
const mockAnalyzeIntegrity = mock(() => Promise.resolve({ issues: [] }));
const mockAnalyzeDeps = mock(() => Promise.resolve({ cycles: [], missing: [] }));
const mockRunDoctor = mock(() => Promise.resolve({ checks: [] }));
const mockValidateImplementationFiles = mock(() => Promise.resolve({ errors: [], warnings: [] } as { errors: string[], warnings: string[] }));
const mockLoadWorkspaceConfig = mock(() => Promise.resolve({ outputDir: 'dist' }));
const mockResolveAllImplementations = mock(() => Promise.resolve([]));
const mockDiscoverLayers = mock(() => Promise.resolve([]));
const mockValidateTestRefs = mock(() => Promise.resolve({ errors: [], missingTests: [] }));
const mockValidateSpecStructure = mock(() => ({ errors: [], warnings: [] } as { errors: string[], warnings: string[] }));

// Mock external modules
mock.module('../integrity', () => ({
  analyzeIntegrity: mockAnalyzeIntegrity
}));

mock.module('../deps', () => ({
  analyzeDeps: mockAnalyzeDeps
}));

mock.module('../doctor/doctor-service', () => ({
  runDoctor: mockRunDoctor
}));

mock.module('../validate/implementation-validator', () => ({
  validateImplementationFiles: mockValidateImplementationFiles
}));

mock.module('../config', () => ({
  loadWorkspaceConfig: mockLoadWorkspaceConfig
}));

mock.module('../implementation/resolver', () => ({
  resolveAllImplementations: mockResolveAllImplementations
}));

mock.module('../layer-discovery', () => ({
  discoverLayers: mockDiscoverLayers
}));

mock.module('../test-link', () => ({
  validateTestRefs: mockValidateTestRefs
}));

mock.module('@contractspec/module.workspace', () => ({
  isFeatureFile: (f: string) => f.endsWith('.feature.ts'),
  scanAllSpecsFromSource: () => [],
  validateSpecStructure: mockValidateSpecStructure
}));

describe('runCIChecks', () => {
  let mockFs: FsAdapter;
  let mockLogger: LoggerAdapter;

  beforeEach(() => {
    mockAnalyzeIntegrity.mockClear();
    mockAnalyzeDeps.mockClear();
    mockRunDoctor.mockClear();
    mockValidateImplementationFiles.mockClear();
    mockLoadWorkspaceConfig.mockClear();
    mockResolveAllImplementations.mockClear();
    mockDiscoverLayers.mockClear();
    mockValidateTestRefs.mockClear();
    // Validate spec structure is a function returning object, not a promise mock in my setup, 
    // but the mock itself is a fn so I can clear it possibly or just re-impl
    mockValidateSpecStructure.mockClear();

    mockFs = {
      glob: mock(() => Promise.resolve(['spec1.ts', 'spec2.ts'])),
      readFile: mock(() => Promise.resolve('content')),
      exists: mock(() => Promise.resolve(true)),
      writeFile: mock(() => Promise.resolve()),
      // add other methods as needed
    } as unknown as FsAdapter;

    mockLogger = {
      info: mock(),
      warn: mock(),
      error: mock(),
      debug: mock(),
    } as unknown as LoggerAdapter;
  });

  it('should run default checks (structure, integrity, deps, doctor)', async () => {
    const result = await runCIChecks({ fs: mockFs, logger: mockLogger }, {});

    expect(result.success).toBe(true);
    expect(mockValidateSpecStructure).toHaveBeenCalled();
    expect(mockAnalyzeIntegrity).toHaveBeenCalled();
    expect(mockAnalyzeDeps).toHaveBeenCalled();
    expect(mockRunDoctor).toHaveBeenCalled();
  });

  it('should run only requested checks', async () => {
    await runCIChecks(
      { fs: mockFs, logger: mockLogger },
      { checks: ['structure'] }
    );

    expect(mockValidateSpecStructure).toHaveBeenCalled();
    expect(mockAnalyzeIntegrity).not.toHaveBeenCalled();
  });

  it('should skip requested checks', async () => {
    await runCIChecks(
      { fs: mockFs, logger: mockLogger },
      { skip: ['integrity'] }
    );

    expect(mockValidateSpecStructure).toHaveBeenCalled();
    expect(mockAnalyzeIntegrity).not.toHaveBeenCalled();
  });

  it('should fail on warnings if failOnWarnings is true', async () => {
    mockValidateSpecStructure.mockImplementationOnce(() => ({
      errors: [],
      warnings: ['some warning']
    } as any));

    const result = await runCIChecks(
      { fs: mockFs, logger: mockLogger },
      { failOnWarnings: true }
    );

    expect(result.success).toBe(false);
    expect(result.totalWarnings).toBe(1);
  });
});
