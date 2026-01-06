import { describe, expect, it, mock, beforeEach, afterEach } from 'bun:test';
import { buildSpec } from './build';
import type { SpecScanResult } from '@contractspec/module.workspace';

// Mock module.workspace
const mockScanSpecSource = mock();
const mockInferSpecType = mock();
const mockGenerateHandler = mock(() => 'handler code');
const mockGenerateComponent = mock(() => 'component code');
const mockGenerateTest = mock(() => 'test code');

const mockWorkspace = {
  scanSpecSource: mockScanSpecSource,
  inferSpecTypeFromFilePath: mockInferSpecType,
  generateHandlerTemplate: mockGenerateHandler,
  generateComponentTemplate: mockGenerateComponent,
  generateTestTemplate: mockGenerateTest,
} as any;

describe('Build Service', () => {
  const mockFs = {
    readFile: mock(() => Promise.resolve('spec content')),
    writeFile: mock(() => Promise.resolve()),
    exists: mock(() => Promise.resolve(false)),
    mkdir: mock(() => Promise.resolve()),
    resolve: mock((...args: string[]) => args.join('/')),
    dirname: mock((p: string) => p.split('/').slice(0, -1).join('/')),
    join: mock((...args: string[]) => args.join('/')),
  };

  const mockLogger = {
    info: mock(),
    warn: mock(),
    error: mock(),
    debug: mock(),
    createProgress: mock(() => ({
      start: mock(),
      update: mock(),
      stop: mock(),
      succeed: mock(),
      fail: mock(),
      warn: mock(),
    })),
  };

  beforeEach(() => {
    mockFs.readFile.mockClear();
    mockFs.writeFile.mockClear();
    mockFs.exists.mockClear();
    mockFs.exists.mockImplementation(() => Promise.resolve(false));
    mockLogger.info.mockClear();
    mockLogger.error.mockClear();

    mockScanSpecSource.mockClear();
  });

  afterEach(() => {
    mock.restore();
  });

  const config = {
    version: '1',
    outputDir: 'src',
    contracts: {},
    ignore: [],
  } as any;

  it('should build handler for operation spec', async () => {
    mockInferSpecType.mockReturnValue('operation');
    mockScanSpecSource.mockReturnValue({ kind: 'command', key: 'my.cmd' } as SpecScanResult);
    
    const result = await buildSpec(
      'specs/my.cmd.ts',
      {
        fs: mockFs as any,
        logger: mockLogger as any,
        workspace: mockWorkspace,
      },
      config as any
    );

    // buildSpec returns BuildSpecResult which doesn't have success property directly
    expect(result.results).toHaveLength(1);
    expect(result.results[0]?.target).toBe('handler');
    expect(result.results[0]?.success).toBe(true);
    expect(mockFs.writeFile).toHaveBeenCalled();
    expect(mockGenerateHandler).toHaveBeenCalledWith('my.cmd', 'command');
  });

  it('should build component for presentation spec', async () => {
    mockInferSpecType.mockReturnValue('presentation');
    mockScanSpecSource.mockReturnValue({ key: 'my.component', description: 'desc' } as SpecScanResult);

    const result = await buildSpec(
      'specs/my.component.ts',
      {
        fs: mockFs as any,
        logger: mockLogger as any,
        workspace: mockWorkspace,
      },
      config as any
    );

    expect(result.results).toHaveLength(1);
    expect(result.results[0]?.target).toBe('component');
    expect(mockGenerateComponent).toHaveBeenCalledWith('my.component', 'desc');
  });

  it('should skip existing files unless overwrite is true', async () => {
    mockInferSpecType.mockReturnValue('operation');
    mockScanSpecSource.mockReturnValue({ kind: 'command', key: 'my.cmd' } as SpecScanResult);
    mockFs.exists.mockResolvedValueOnce(true);

    const result = await buildSpec(
      'specs/my.cmd.ts',
      {
        fs: mockFs as any,
        logger: mockLogger as any,
        workspace: mockWorkspace,
      },
      config as any
    );

    expect(result.results[0]?.skipped).toBe(true);
    expect(mockFs.writeFile).not.toHaveBeenCalled();
  });

  it('should generate tests when requested', async () => {
    mockInferSpecType.mockReturnValue('operation');
    mockScanSpecSource.mockReturnValue({ kind: 'command', key: 'my.cmd' } as SpecScanResult);

    const result = await buildSpec(
      'specs/my.cmd.ts',
      {
        fs: mockFs as any,
        logger: mockLogger as any,
        workspace: mockWorkspace,
      },
      config as any,
      { targets: ['handler', 'test'] }
    );

    expect(result.results).toHaveLength(2);
    expect(mockGenerateTest).toHaveBeenCalled();
  });

  it('should skip overwrite if file exists', async () => {
    mockFs.exists.mockResolvedValue(true);
    mockInferSpecType.mockReturnValue('operation');
    mockScanSpecSource.mockReturnValue({ kind: 'command', key: 'my.cmd' } as SpecScanResult);

    const result = await buildSpec(
      'specs/my.cmd.ts',
      {
        fs: mockFs as any,
        logger: mockLogger as any,
        workspace: mockWorkspace,
      },
      config as any
    );

    expect(result.results[0]?.skipped).toBe(true);
    expect(mockFs.writeFile).not.toHaveBeenCalled();
  });

  it('should overwrite existing files if overwrite is true', async () => {
    mockInferSpecType.mockReturnValue('operation');
    mockScanSpecSource.mockReturnValue({ kind: 'command', key: 'my.cmd' } as SpecScanResult);
    mockFs.exists.mockResolvedValueOnce(true);

    const result = await buildSpec(
      'specs/my.cmd.ts',
      {
        fs: mockFs as any,
        logger: mockLogger as any,
        workspace: mockWorkspace,
      },
      config,
      { overwrite: true }
    );

    expect(result.results[0]?.success).toBe(true);
    expect(result.results[0]?.skipped).toBeUndefined();
    expect(mockFs.writeFile).toHaveBeenCalled();
  });

  it('should respect dryRun', async () => {
    mockInferSpecType.mockReturnValue('operation');
    mockScanSpecSource.mockReturnValue({ kind: 'command', key: 'my.cmd' } as SpecScanResult);

    const result = await buildSpec(
      'specs/my.cmd.ts',
      {
        fs: mockFs as any,
        logger: mockLogger as any,
        workspace: mockWorkspace,
      },
      config,
      { dryRun: true }
    );

    expect(result.results[0]?.success).toBe(true);
    expect(mockFs.writeFile).not.toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    mockInferSpecType.mockReturnValue('operation');
    mockScanSpecSource.mockImplementation(() => {
        throw new Error('Scan failed');
    });

    // scanSpecSource exception bubbles up if it happens before the loop
    expect(buildSpec(
        'specs/my.cmd.ts',
        { fs: mockFs as any, logger: mockLogger, workspace: mockWorkspace },
        config
    )).rejects.toThrow('Scan failed');
  });
  
  it('should handle build errors for specific targets', async () => {
      mockInferSpecType.mockReturnValue('operation');
      mockScanSpecSource.mockReturnValue({ kind: 'command', key: 'my.cmd' } as SpecScanResult);
      mockFs.writeFile.mockRejectedValue(new Error('Write failed'));
      
      const result = await buildSpec(
        'specs/my.cmd.ts',
        { fs: mockFs as any, logger: mockLogger, workspace: mockWorkspace },
        config,
        { targets: ['handler'] }
      );
      
      expect(result.results[0]?.success).toBe(false);
      expect(result.results[0]?.error).toBe('Write failed');
  });
});
