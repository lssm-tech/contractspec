import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { installRegistrySource } from '../../src/sources/registry.js';
import type { Lockfile } from '../../src/core/lockfile.js';
import { createTarball } from '../../src/utils/tarball.js';

const TEST_DIR = join(
  import.meta.dirname,
  '..',
  '__fixtures__',
  'registry-source-test'
);

/**
 * Integration tests for the registry source resolver.
 * Mocks fetch to simulate registry API responses.
 */
describe('installRegistrySource', () => {
  const originalFetch = globalThis.fetch;
  let mockTarball: ArrayBuffer;

  beforeAll(async () => {
    // Create a mock pack and tarball from it
    const mockPackDir = join(TEST_DIR, 'mock-pack-source');
    mkdirSync(join(mockPackDir, 'rules'), { recursive: true });
    writeFileSync(
      join(mockPackDir, 'pack.json'),
      JSON.stringify({ name: 'test-pack', version: '1.0.0' })
    );
    writeFileSync(
      join(mockPackDir, 'rules', 'example.md'),
      '---\nroot: true\n---\n\nTest rule.\n'
    );
    mockTarball = await createTarball(mockPackDir);
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  test('downloads and extracts pack to curated cache', async () => {
    const projectRoot = join(TEST_DIR, 'project1');
    mkdirSync(projectRoot, { recursive: true });

    globalThis.fetch = async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.includes('/packs/my-pack') && !url.includes('/versions/')) {
        // Info endpoint
        return new Response(
          JSON.stringify({
            name: 'my-pack',
            latestVersion: '1.0.0',
            versions: [],
          }),
          { status: 200, headers: { 'content-type': 'application/json' } }
        );
      }
      if (url.includes('/download')) {
        // Download endpoint
        const headers = new Headers();
        headers.set('x-integrity', 'sha256-abc123');
        return new Response(mockTarball, { status: 200, headers });
      }
      return new Response('Not Found', { status: 404 });
    };

    const lockfile: Lockfile = { lockfileVersion: 1, sources: {} };
    const result = await installRegistrySource(
      projectRoot,
      'registry:my-pack',
      lockfile
    );

    expect(result.installed.length).toBeGreaterThan(0);
    expect(result.warnings).toHaveLength(0);

    // Pack should be in curated cache
    const curatedDir = join(projectRoot, '.agentpacks', '.curated', 'my-pack');
    expect(existsSync(curatedDir)).toBe(true);
    expect(existsSync(join(curatedDir, 'pack.json'))).toBe(true);
    expect(existsSync(join(curatedDir, 'rules', 'example.md'))).toBe(true);
  });

  test('updates lockfile after install', async () => {
    const projectRoot = join(TEST_DIR, 'project2');
    mkdirSync(projectRoot, { recursive: true });

    globalThis.fetch = async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.includes('/packs/lockfile-test') && !url.includes('/versions/')) {
        return new Response(
          JSON.stringify({
            name: 'lockfile-test',
            latestVersion: '2.0.0',
          }),
          { status: 200, headers: { 'content-type': 'application/json' } }
        );
      }
      if (url.includes('/download')) {
        return new Response(mockTarball, {
          status: 200,
          headers: { 'x-integrity': 'sha256-def456' },
        });
      }
      return new Response('Not Found', { status: 404 });
    };

    const lockfile: Lockfile = { lockfileVersion: 1, sources: {} };
    await installRegistrySource(
      projectRoot,
      'registry:lockfile-test',
      lockfile
    );

    const entry = lockfile.sources['registry:lockfile-test'];
    expect(entry).toBeDefined();
    expect(entry!.resolvedRef).toBe('2.0.0');
    expect(entry!.requestedRef).toBe('latest');
    expect(entry!.skills?.['__integrity']?.integrity).toMatch(/^sha256-/);
  });

  test('uses locked version when not updating', async () => {
    const projectRoot = join(TEST_DIR, 'project3');
    mkdirSync(projectRoot, { recursive: true });

    let downloadedVersion = '';
    globalThis.fetch = async (input: RequestInfo | URL) => {
      const url = input.toString();
      const versionMatch = url.match(/versions\/([^/]+)\/download/);
      if (versionMatch) {
        downloadedVersion = versionMatch[1]!;
        return new Response(mockTarball, {
          status: 200,
          headers: { 'x-integrity': 'sha256-locked' },
        });
      }
      return new Response('Not Found', { status: 404 });
    };

    const lockfile: Lockfile = {
      lockfileVersion: 1,
      sources: {
        'registry:locked-pack': {
          requestedRef: 'latest',
          resolvedRef: '1.5.0',
          resolvedAt: new Date().toISOString(),
          skills: {},
          packs: {},
        },
      },
    };

    await installRegistrySource(projectRoot, 'registry:locked-pack', lockfile, {
      update: false,
    });

    expect(downloadedVersion).toBe('1.5.0');
  });

  test('throws in frozen mode without lockfile entry', async () => {
    const projectRoot = join(TEST_DIR, 'project4');
    mkdirSync(projectRoot, { recursive: true });

    const lockfile: Lockfile = { lockfileVersion: 1, sources: {} };

    await expect(
      installRegistrySource(projectRoot, 'registry:unknown-pack', lockfile, {
        frozen: true,
      })
    ).rejects.toThrow('Frozen mode');
  });

  test('handles specific version in ref', async () => {
    const projectRoot = join(TEST_DIR, 'project5');
    mkdirSync(projectRoot, { recursive: true });

    let downloadedVersion = '';
    globalThis.fetch = async (input: RequestInfo | URL) => {
      const url = input.toString();
      const versionMatch = url.match(/versions\/([^/]+)\/download/);
      if (versionMatch) {
        downloadedVersion = versionMatch[1]!;
        return new Response(mockTarball, {
          status: 200,
          headers: { 'x-integrity': 'sha256-specific' },
        });
      }
      return new Response('Not Found', { status: 404 });
    };

    const lockfile: Lockfile = { lockfileVersion: 1, sources: {} };
    await installRegistrySource(
      projectRoot,
      'registry:versioned-pack@3.1.0',
      lockfile
    );

    expect(downloadedVersion).toBe('3.1.0');
  });

  test('cleans existing installation before extracting', async () => {
    const projectRoot = join(TEST_DIR, 'project6');
    const curatedDir = join(
      projectRoot,
      '.agentpacks',
      '.curated',
      'clean-test'
    );
    mkdirSync(curatedDir, { recursive: true });
    writeFileSync(join(curatedDir, 'stale-file.txt'), 'should be removed');

    globalThis.fetch = async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.includes('/packs/clean-test') && !url.includes('/versions/')) {
        return new Response(
          JSON.stringify({ name: 'clean-test', latestVersion: '1.0.0' }),
          { status: 200, headers: { 'content-type': 'application/json' } }
        );
      }
      if (url.includes('/download')) {
        return new Response(mockTarball, {
          status: 200,
          headers: { 'x-integrity': '' },
        });
      }
      return new Response('Not Found', { status: 404 });
    };

    const lockfile: Lockfile = { lockfileVersion: 1, sources: {} };
    await installRegistrySource(projectRoot, 'registry:clean-test', lockfile);

    expect(existsSync(join(curatedDir, 'stale-file.txt'))).toBe(false);
    expect(existsSync(join(curatedDir, 'pack.json'))).toBe(true);
  });
});
