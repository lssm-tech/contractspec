import { describe, it, expect, mock, beforeEach, type Mock } from 'bun:test';
import { RuleSyncService } from './rulesync';
import type { FsAdapter } from '../ports/fs';
import type { LoggerAdapter } from '../ports/logger';
import type { RuleSyncConfig } from '@contractspec/lib.contracts-spec';

describe('RuleSyncService', () => {
  let fs: {
    join: Mock<FsAdapter['join']>;
    exists: Mock<FsAdapter['exists']>;
    readFile: Mock<FsAdapter['readFile']>;
    writeFile: Mock<FsAdapter['writeFile']>;
  };
  let logger: {
    info: Mock<LoggerAdapter['info']>;
    error: Mock<LoggerAdapter['error']>;
    debug: Mock<LoggerAdapter['debug']>;
  };
  let service: RuleSyncService;

  beforeEach(() => {
    fs = {
      join: mock((...args: string[]) => args.join('/')),
      exists: mock(),
      readFile: mock(),
      writeFile: mock(),
    };

    logger = {
      info: mock(),
      error: mock(),
      debug: mock(),
    };

    service = new RuleSyncService(
      fs as unknown as FsAdapter,
      logger as unknown as LoggerAdapter
    );
  });

  it('should skip sync if disabled', async () => {
    const config: RuleSyncConfig = {
      enabled: false,
      rulesDir: './rules',
      rules: ['**/*.md'],
      targets: ['cursor'],
      autoSync: true,
      ejectMode: false,
    };

    const result = await service.sync({ config, cwd: '/test' });

    expect(result.success).toBe(true);
    expect(result.files).toHaveLength(0);
    expect(result.logs?.[0]).toContain('disabled');
  });

  it('should return error if rules directory does not exist', async () => {
    const config: RuleSyncConfig = {
      enabled: true,
      rulesDir: './rules',
      rules: ['**/*.md'],
      targets: ['cursor'],
      autoSync: true,
      ejectMode: false,
    };

    fs.exists.mockImplementation(() => Promise.resolve(false));

    const result = await service.sync({ config, cwd: '/test' });

    expect(result.success).toBe(false);
    expect(result.errors?.[0]).toContain('Rules directory not found');
  });

  it('should sync to targets if enabled', async () => {
    const config: RuleSyncConfig = {
      enabled: true,
      rulesDir: './rules',
      rules: ['**/*.md'],
      targets: ['cursor', 'windsurf'],
      autoSync: true,
      ejectMode: false,
    };

    fs.exists.mockImplementation(() => Promise.resolve(true));

    const result = await service.sync({ config, cwd: '/test' });

    expect(result.success).toBe(true);
    expect(result.files).toContain('/test/.cursorrules');
    expect(result.files).toContain('/test/.windsurfrules');
  });

  it('should generate valid rulesync config', async () => {
    const config: RuleSyncConfig = {
      enabled: true,
      rulesDir: './rules',
      rules: ['test.rule.md'],
      targets: ['cursor'],
      autoSync: true,
      ejectMode: false,
    };

    const rsConfigStr = await service.generateConfig({ config, cwd: '/test' });
    const rsConfig = JSON.parse(rsConfigStr);

    expect(rsConfig.rules).toContain('./rules/test.rule.md');
    expect(rsConfig.targets).toContain('cursor');
  });
});
