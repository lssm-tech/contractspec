import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { parseMcp, mergeMcpConfigs } from '../../src/features/mcp.js';

const TEST_DIR = join(import.meta.dirname, '..', '__fixtures__', 'mcp-test');

beforeAll(() => {
  mkdirSync(TEST_DIR, { recursive: true });

  writeFileSync(
    join(TEST_DIR, 'mcp.json'),
    JSON.stringify({
      mcpServers: {
        context7: {
          type: 'remote',
          url: 'https://mcp.context7.com/mcp',
          description: 'Context7 docs',
        },
        filesystem: {
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-filesystem'],
          env: { ROOT_DIR: '.' },
        },
      },
    })
  );
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('parseMcp', () => {
  test('parses MCP servers from mcp.json', () => {
    const mcp = parseMcp(TEST_DIR, 'test-pack');
    expect(mcp).not.toBeNull();
    expect(mcp!.packName).toBe('test-pack');
  });

  test('parses remote MCP server', () => {
    const mcp = parseMcp(TEST_DIR, 'test-pack')!;
    expect(mcp.servers['context7']).toBeDefined();
    expect(mcp.servers['context7']!.url).toBe('https://mcp.context7.com/mcp');
  });

  test('parses local MCP server with command and args', () => {
    const mcp = parseMcp(TEST_DIR, 'test-pack')!;
    const fs = mcp.servers['filesystem']!;
    expect(fs.command).toBe('npx');
    expect(fs.args).toEqual(['-y', '@modelcontextprotocol/server-filesystem']);
    expect(fs.env).toEqual({ ROOT_DIR: '.' });
  });

  test('returns null when no mcp.json', () => {
    const mcp = parseMcp('/nonexistent/path', 'test-pack');
    expect(mcp).toBeNull();
  });
});

describe('mergeMcpConfigs', () => {
  test('merges servers from multiple configs', () => {
    const config1 = parseMcp(TEST_DIR, 'pack-a')!;
    const config2 = {
      packName: 'pack-b',
      sourcePath: '/fake',
      servers: {
        github: {
          command: 'gh',
          args: ['mcp'],
        },
      },
    };
    const { servers, warnings } = mergeMcpConfigs([config1, config2]);
    expect(Object.keys(servers)).toHaveLength(3);
    expect(servers['github']).toBeDefined();
    expect(warnings).toHaveLength(0);
  });

  test('first config wins on name collision', () => {
    const config1 = parseMcp(TEST_DIR, 'pack-a')!;
    const config2 = {
      packName: 'pack-b',
      sourcePath: '/fake',
      servers: {
        context7: { url: 'https://other.url' },
      },
    };
    const { servers, warnings } = mergeMcpConfigs([config1, config2]);
    expect(servers['context7']!.url).toBe('https://mcp.context7.com/mcp');
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('context7');
  });
});
