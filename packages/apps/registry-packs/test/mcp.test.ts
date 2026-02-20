/**
 * Integration tests for MCP endpoint.
 *
 * Tests the MCP tools, resources, and prompts registered on the /mcp endpoint
 * via JSON-RPC over HTTP POST (stateless, JSON response mode).
 */
import { describe, test, expect, beforeEach } from 'bun:test';
import { setupTestDb } from './test-app.js';
import * as schema from '../src/db/schema.js';
import type { Db } from '../src/db/client.js';
import { app } from '../src/server.js';

let db: Db;

/** Send a JSON-RPC request to the MCP endpoint. */
async function mcpRequest(
  method: string,
  params: Record<string, unknown> = {}
) {
  const res = await app.handle(
    new Request('http://localhost/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
      }),
    })
  );
  return res;
}

/** Seed a pack into the DB for testing. */
function seedPack(overrides: Partial<typeof schema.packs.$inferInsert> = {}) {
  db.insert(schema.packs)
    .values({
      name: 'test-pack',
      displayName: 'Test Pack',
      description: 'A test pack for MCP testing',
      authorName: 'tester',
      tags: ['typescript', 'testing'],
      targets: ['cursor', 'opencode'],
      features: ['rules'],
      downloads: 100,
      weeklyDownloads: 25,
      ...overrides,
    })
    .run();
}

describe('MCP endpoint', () => {
  beforeEach(() => {
    db = setupTestDb();
  });

  describe('initialization', () => {
    test('responds to initialize request', async () => {
      const res = await mcpRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test-client', version: '1.0.0' },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.result).toBeDefined();
      expect(body.result.serverInfo.name).toBe('agentpacks-registry-mcp');
      expect(body.result.capabilities.tools).toBeDefined();
      expect(body.result.capabilities.resources).toBeDefined();
      expect(body.result.capabilities.prompts).toBeDefined();
    });
  });

  describe('tools/list', () => {
    test('lists all registered tools', async () => {
      // Initialize first
      await mcpRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0' },
      });

      const res = await mcpRequest('tools/list', {});
      expect(res.status).toBe(200);
      const body = await res.json();
      const tools = body.result.tools;

      expect(tools).toBeArray();
      const toolNames = tools.map((t: { name: string }) => t.name);
      expect(toolNames).toContain('search_packs');
      expect(toolNames).toContain('get_pack_info');
      expect(toolNames).toContain('list_featured');
      expect(toolNames).toContain('list_by_target');
      expect(toolNames).toContain('get_pack_readme');
    });
  });

  describe('tools/call — search_packs', () => {
    test('returns empty results for no match', async () => {
      await mcpRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0' },
      });

      const res = await mcpRequest('tools/call', {
        name: 'search_packs',
        arguments: { query: 'nonexistent' },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.result.content[0].text).toContain('Found 0 packs');
    });

    test('finds seeded packs', async () => {
      seedPack();
      await mcpRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0' },
      });

      const res = await mcpRequest('tools/call', {
        name: 'search_packs',
        arguments: { query: 'test' },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.result.content[0].text).toContain('test-pack');
    });
  });

  describe('tools/call — get_pack_info', () => {
    test('returns pack info for existing pack', async () => {
      seedPack();
      await mcpRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0' },
      });

      const res = await mcpRequest('tools/call', {
        name: 'get_pack_info',
        arguments: { name: 'test-pack' },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      const text = body.result.content[0].text;
      expect(text).toContain('Test Pack');
      expect(text).toContain('registry:test-pack');
    });

    test('returns not found for missing pack', async () => {
      await mcpRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0' },
      });

      const res = await mcpRequest('tools/call', {
        name: 'get_pack_info',
        arguments: { name: 'nonexistent' },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.result.content[0].text).toContain('not found');
    });
  });

  describe('tools/call — list_featured', () => {
    test('returns featured packs', async () => {
      seedPack({ featured: 1 });
      await mcpRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0' },
      });

      const res = await mcpRequest('tools/call', {
        name: 'list_featured',
        arguments: {},
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.result.content[0].text).toContain('test-pack');
    });

    test('returns empty when no featured packs', async () => {
      await mcpRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0' },
      });

      const res = await mcpRequest('tools/call', {
        name: 'list_featured',
        arguments: {},
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.result.content[0].text).toContain('No featured packs');
    });
  });

  describe('tools/call — list_by_target', () => {
    test('finds packs for a target', async () => {
      seedPack();
      await mcpRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0' },
      });

      const res = await mcpRequest('tools/call', {
        name: 'list_by_target',
        arguments: { targetId: 'cursor' },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.result.content[0].text).toContain('test-pack');
    });

    test('returns empty for unknown target', async () => {
      await mcpRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0' },
      });

      const res = await mcpRequest('tools/call', {
        name: 'list_by_target',
        arguments: { targetId: 'unknown-tool' },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.result.content[0].text).toContain('No packs found');
    });
  });

  describe('tools/call — get_pack_readme', () => {
    test('returns readme when available', async () => {
      seedPack();
      db.insert(schema.packReadmes)
        .values({
          packName: 'test-pack',
          content: '# Test Pack\n\nThis is the readme.',
        })
        .run();

      await mcpRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0' },
      });

      const res = await mcpRequest('tools/call', {
        name: 'get_pack_readme',
        arguments: { name: 'test-pack' },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.result.content[0].text).toContain('This is the readme');
    });

    test('returns not found when no readme', async () => {
      seedPack();
      await mcpRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0' },
      });

      const res = await mcpRequest('tools/call', {
        name: 'get_pack_readme',
        arguments: { name: 'test-pack' },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.result.content[0].text).toContain('No README found');
    });
  });

  describe('resources/list', () => {
    test('lists all registered resources', async () => {
      await mcpRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0' },
      });

      const res = await mcpRequest('resources/list', {});
      expect(res.status).toBe(200);
      const body = await res.json();
      const resources = body.result.resources ?? body.result.resourceTemplates;

      expect(resources).toBeArray();
      expect(resources.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('prompts/list', () => {
    test('lists all registered prompts', async () => {
      await mcpRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0' },
      });

      const res = await mcpRequest('prompts/list', {});
      expect(res.status).toBe(200);
      const body = await res.json();
      const prompts = body.result.prompts;

      expect(prompts).toBeArray();
      const promptNames = prompts.map((p: { name: string }) => p.name);
      expect(promptNames).toContain('suggest_packs');
      expect(promptNames).toContain('compare_packs');
    });
  });

  describe('prompts/get — suggest_packs', () => {
    test('generates suggestion prompt with results', async () => {
      seedPack();
      await mcpRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0' },
      });

      const res = await mcpRequest('prompts/get', {
        name: 'suggest_packs',
        arguments: {
          useCase: 'TypeScript testing',
          targets: 'cursor,opencode',
        },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      const messages = body.result.messages;
      expect(messages).toBeArray();
      expect(messages.length).toBeGreaterThanOrEqual(1);
      expect(messages[0].role).toBe('user');
      expect(messages[0].content.text).toContain('TypeScript testing');
    });
  });

  describe('prompts/get — compare_packs', () => {
    test('generates comparison prompt', async () => {
      seedPack({ name: 'pack-a', displayName: 'Pack A' });
      seedPack({ name: 'pack-b', displayName: 'Pack B' });

      await mcpRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0' },
      });

      const res = await mcpRequest('prompts/get', {
        name: 'compare_packs',
        arguments: { packNames: 'pack-a,pack-b' },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      const messages = body.result.messages;
      expect(messages).toBeArray();
      expect(messages[0].content.text).toContain('Pack A');
      expect(messages[0].content.text).toContain('Pack B');
    });

    test('handles missing packs gracefully', async () => {
      seedPack({ name: 'pack-a', displayName: 'Pack A' });

      await mcpRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0' },
      });

      const res = await mcpRequest('prompts/get', {
        name: 'compare_packs',
        arguments: { packNames: 'pack-a,nonexistent' },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      const text = body.result.messages[0].content.text;
      expect(text).toContain('Pack A');
      expect(text).toContain('Not found');
    });
  });
});
