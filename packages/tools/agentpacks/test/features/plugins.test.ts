import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { parsePlugins, parsePluginFile } from '../../src/features/plugins.js';

const TEST_DIR = join(
  import.meta.dirname,
  '..',
  '__fixtures__',
  'plugins-test'
);

beforeAll(() => {
  const pluginsDir = join(TEST_DIR, 'plugins');
  mkdirSync(pluginsDir, { recursive: true });

  writeFileSync(
    join(pluginsDir, 'agentpacks-metrics.ts'),
    [
      'import { definePlugin } from "@opencode-ai/plugin";',
      '',
      'export default definePlugin({',
      '  name: "agentpacks-metrics",',
      '  hooks: {',
      '    "session.created": async () => {',
      '      console.log("session started");',
      '    },',
      '  },',
      '});',
    ].join('\n')
  );

  writeFileSync(
    join(pluginsDir, 'logger.js'),
    "module.exports = { name: 'logger' };\n"
  );
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('parsePlugins', () => {
  test('parses TS and JS plugin files', () => {
    const plugins = parsePlugins(TEST_DIR, 'test-pack');
    expect(plugins).toHaveLength(2);
  });

  test('detects correct extensions', () => {
    const plugins = parsePlugins(TEST_DIR, 'test-pack');
    const ts = plugins.find((p) => p.name === 'agentpacks-metrics')!;
    const js = plugins.find((p) => p.name === 'logger')!;
    expect(ts.extension).toBe('ts');
    expect(js.extension).toBe('js');
  });

  test('sets packName correctly', () => {
    const plugins = parsePlugins(TEST_DIR, 'my-pack');
    expect(plugins.every((p) => p.packName === 'my-pack')).toBe(true);
  });

  test('reads file content', () => {
    const plugins = parsePlugins(TEST_DIR, 'test-pack');
    const ts = plugins.find((p) => p.name === 'agentpacks-metrics')!;
    expect(ts.content).toContain('definePlugin');
  });

  test('returns empty for pack without plugins dir', () => {
    const plugins = parsePlugins('/nonexistent/path', 'test');
    expect(plugins).toEqual([]);
  });
});

describe('parsePluginFile', () => {
  test('parses a single plugin file', () => {
    const plugin = parsePluginFile(
      join(TEST_DIR, 'plugins', 'agentpacks-metrics.ts'),
      'test'
    );
    expect(plugin.name).toBe('agentpacks-metrics');
    expect(plugin.extension).toBe('ts');
  });
});
