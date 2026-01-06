import { describe, expect, it, mock, beforeEach, afterEach } from 'bun:test';
import { 
  getExtendedWorkspaceInfo, 
  findAllConfigFiles,
  mergeMonorepoConfigs 
} from './workspace-info';

const mockGetWorkspaceInfo = mock();

describe('Workspace Info Service', () => {
  const mockFs = {
    join: mock((...args: string[]) => args.join('/')),
    exists: mock(() => Promise.resolve(false)),
    readFile: mock(() => Promise.resolve('{}')),
    glob: mock(() => Promise.resolve([] as string[])),
  };

  beforeEach(() => {
    mockFs.exists.mockClear();
    mockFs.readFile.mockClear();
    mockFs.glob.mockClear();
    
    mockGetWorkspaceInfo.mockClear();
    mockGetWorkspaceInfo.mockReturnValue({
        workspaceRoot: '/root',
        packageRoot: '/root/pkg',
        packageManager: 'bun',
        isMonorepo: true,
    });

    mock.module('../adapters/workspace', () => ({
      getWorkspaceInfo: mockGetWorkspaceInfo,
    }));
  });

  afterEach(() => {
    mock.restore();
  });

  describe('getExtendedWorkspaceInfo', () => {
    it('should return base info', async () => {
      const info = await getExtendedWorkspaceInfo(mockFs as any);
      expect(info.workspaceRoot).toBe('/root');
      expect(mockGetWorkspaceInfo).toHaveBeenCalled();
    });

    it('should load monorepo config if available', async () => {
      mockFs.exists.mockImplementation(((path: string) => Promise.resolve(path.includes('contractsrc'))) as any);
      mockFs.readFile.mockResolvedValue(JSON.stringify({ packages: ['pkg/*'] }));
      
      const info = await getExtendedWorkspaceInfo(mockFs as any);
      
      expect(info.workspaceConfigPath).toBeDefined();
      expect(info.monorepoConfig).toEqual({
        packages: ['pkg/*'],
        excludePackages: undefined,
        recursive: undefined,
      });
    });
  });

  describe('findAllConfigFiles', () => {
    it('should find all configs', async () => {
      mockFs.exists.mockResolvedValue(true); // Root config exists
      mockFs.glob.mockResolvedValue(['pkg/a/.contractsrc.json']);
      
      const configs = await findAllConfigFiles(mockFs as any, '/root');
      
      expect(configs).toHaveLength(2);
      expect(configs).toContain('/root/.contractsrc.json');
      expect(configs).toContain('pkg/a/.contractsrc.json');
    });
  });

  describe('mergeMonorepoConfigs', () => {
    it('should merge configs with package priority', async () => {
      mockFs.exists.mockResolvedValue(true);
      mockFs.readFile.mockImplementation((async (path: string) => {
          if (path === 'workspace') return JSON.stringify({ a: 1, b: 1 });
          if (path === 'package') return JSON.stringify({ b: 2, c: 3 });
          return '{}';
      }) as any);

      const merged = await mergeMonorepoConfigs(mockFs as any, 'workspace', 'package');
      
      expect(merged).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should handle missing files', async () => {
        mockFs.exists.mockResolvedValue(false);
        const merged = await mergeMonorepoConfigs(mockFs as any, 'workspace', 'package');
        expect(merged).toEqual({});
    });
  });
});
