/**
 * Tests for `agentpacks search` CLI command.
 * Mocks the registry client to verify output formatting.
 */
import { describe, expect, test, afterAll } from 'bun:test';
import { runSearch } from '../../src/cli/search.js';

describe('runSearch', () => {
  const originalFetch = globalThis.fetch;
  const originalLog = console.log;
  const originalExit = process.exit;
  let logged: string[] = [];

  function captureOutput() {
    logged = [];
    console.log = (...args: unknown[]) => {
      logged.push(args.map(String).join(' '));
    };
  }

  function restoreOutput() {
    console.log = originalLog;
  }

  afterAll(() => {
    globalThis.fetch = originalFetch;
    console.log = originalLog;
    process.exit = originalExit;
  });

  test('displays pack results from search', async () => {
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({
          packs: [
            {
              name: 'typescript-rules',
              displayName: 'TypeScript Rules',
              description: 'Best practices for TypeScript',
              author: 'testuser',
              downloads: 1500,
              weeklyDownloads: 200,
              tags: ['typescript', 'rules'],
              targets: ['opencode', 'cursor'],
              features: ['rules'],
              verified: true,
              featured: false,
              latestVersion: '2.1.0',
              updatedAt: '2025-01-01',
            },
            {
              name: 'security-pack',
              displayName: 'Security Pack',
              description: 'Security scanning rules',
              author: 'secteam',
              downloads: 800,
              weeklyDownloads: 50,
              tags: ['security'],
              targets: ['opencode'],
              features: ['rules', 'commands'],
              verified: false,
              featured: true,
              latestVersion: '1.0.0',
              updatedAt: '2025-01-15',
            },
          ],
          total: 2,
        }),
        { status: 200, headers: { 'content-type': 'application/json' } }
      );
    };

    captureOutput();
    await runSearch('typescript', {});
    restoreOutput();

    const output = logged.join('\n');
    expect(output).toContain('typescript-rules');
    expect(output).toContain('Best practices for TypeScript');
    expect(output).toContain('2 pack(s)');
  });

  test('shows no packs found when empty', async () => {
    globalThis.fetch = async () => {
      return new Response(JSON.stringify({ packs: [], total: 0 }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    };

    captureOutput();
    await runSearch('nonexistent', {});
    restoreOutput();

    const output = logged.join('\n');
    expect(output).toContain('No packs found');
  });

  test('passes tags and sort options', async () => {
    let capturedUrl = '';
    globalThis.fetch = async (input: RequestInfo | URL) => {
      capturedUrl = input.toString();
      return new Response(JSON.stringify({ packs: [], total: 0 }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    };

    captureOutput();
    await runSearch('', {
      tags: 'typescript,react',
      sort: 'downloads',
      limit: '5',
    });
    restoreOutput();

    expect(capturedUrl).toContain('tags=typescript%2Creact');
    expect(capturedUrl).toContain('sort=downloads');
    expect(capturedUrl).toContain('limit=5');
  });

  test('shows verbose tag info', async () => {
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({
          packs: [
            {
              name: 'tagged-pack',
              displayName: 'Tagged',
              description: 'Has tags',
              author: 'user',
              downloads: 10,
              weeklyDownloads: 1,
              tags: ['alpha', 'beta'],
              targets: [],
              features: [],
              verified: false,
              featured: false,
              latestVersion: '1.0.0',
              updatedAt: '2025-01-01',
            },
          ],
          total: 1,
        }),
        { status: 200, headers: { 'content-type': 'application/json' } }
      );
    };

    captureOutput();
    await runSearch('', { verbose: true });
    restoreOutput();

    const output = logged.join('\n');
    expect(output).toContain('alpha');
    expect(output).toContain('beta');
  });

  test('handles API error gracefully', async () => {
    globalThis.fetch = async () => {
      return new Response('Internal Server Error', { status: 500 });
    };

    let exitCode: number | undefined;
    process.exit = ((code: number) => {
      exitCode = code;
    }) as never;

    captureOutput();
    await runSearch('fail', {});
    restoreOutput();

    expect(exitCode).toBe(1);
    const output = logged.join('\n');
    expect(output).toContain('Search failed');
  });
});
