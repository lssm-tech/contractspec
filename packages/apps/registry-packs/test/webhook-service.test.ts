/**
 * Tests for WebhookService — registration, dispatch, delivery log.
 */
import { describe, test, expect, beforeEach } from 'bun:test';
import { setupTestDb } from './test-app.js';
import * as schema from '../src/db/schema.js';
import type { Db } from '../src/db/client.js';
import { WebhookService } from '../src/services/webhook-service.js';
import { hashToken } from '../src/auth/token.js';
import { eq } from 'drizzle-orm';

let db: Db;
let webhookService: WebhookService;

function seedPack(name: string = 'test-pack') {
  db.insert(schema.packs)
    .values({
      name,
      displayName: 'Test Pack',
      description: 'A test pack',
      authorName: 'author',
    })
    .run();
}

function seedAuth(username: string, token: string) {
  db.insert(schema.authTokens)
    .values({
      token: hashToken(token),
      username,
      scope: 'publish',
    })
    .run();
}

describe('WebhookService', () => {
  beforeEach(() => {
    db = setupTestDb();
    webhookService = new WebhookService(db);
  });

  describe('create', () => {
    test('creates a webhook', async () => {
      seedPack();
      const hook = await webhookService.create({
        packName: 'test-pack',
        url: 'https://example.com/webhook',
        secret: 'my-secret',
        events: ['publish', 'update'],
        username: 'author',
      });

      expect(hook.id).toBeDefined();
      expect(hook.packName).toBe('test-pack');
      expect(hook.url).toBe('https://example.com/webhook');
      expect(hook.active).toBe(true);
    });
  });

  describe('list', () => {
    test('lists webhooks for a pack', async () => {
      seedPack();
      await webhookService.create({
        packName: 'test-pack',
        url: 'https://a.com/hook',
        events: ['publish'],
        username: 'author',
      });
      await webhookService.create({
        packName: 'test-pack',
        url: 'https://b.com/hook',
        events: ['update'],
        username: 'author',
      });

      const hooks = await webhookService.list('test-pack');
      expect(hooks).toHaveLength(2);
    });
  });

  describe('update', () => {
    test('updates webhook fields', async () => {
      seedPack();
      const hook = await webhookService.create({
        packName: 'test-pack',
        url: 'https://example.com/hook',
        events: ['publish'],
        username: 'author',
      });

      const updated = await webhookService.update(hook.id, {
        active: false,
        url: 'https://new.example.com/hook',
      });

      expect(updated!.active).toBe(false);
      expect(updated!.url).toBe('https://new.example.com/hook');
    });
  });

  describe('delete', () => {
    test('deletes a webhook', async () => {
      seedPack();
      const hook = await webhookService.create({
        packName: 'test-pack',
        url: 'https://example.com/hook',
        events: ['publish'],
        username: 'author',
      });

      const deleted = await webhookService.delete(hook.id);
      expect(deleted).toBe(true);

      const result = await webhookService.get(hook.id);
      expect(result).toBeNull();
    });

    test('returns false for non-existent webhook', async () => {
      const deleted = await webhookService.delete(9999);
      expect(deleted).toBe(false);
    });
  });

  describe('dispatch', () => {
    test('skips when no matching webhooks', async () => {
      seedPack();
      const count = await webhookService.dispatch('test-pack', 'publish', {
        version: '1.0.0',
      });
      expect(count).toBe(0);
    });

    test('dispatches to matching webhooks and records delivery', async () => {
      seedPack();
      const hook = await webhookService.create({
        packName: 'test-pack',
        url: 'https://httpbin.org/status/200', // Will likely timeout in test
        events: ['publish'],
        username: 'author',
      });

      // Dispatch — the fetch will fail (no real server), but delivery should be recorded
      await webhookService.dispatch(
        'test-pack',
        'publish',
        { version: '1.0.0' },
        '1.0.0'
      );

      const deliveries = await webhookService.getDeliveries(hook.id);
      expect(deliveries).toHaveLength(1);
      expect(deliveries[0]!.event).toBe('publish');
    });

    test('skips webhooks that do not subscribe to the event', async () => {
      seedPack();
      await webhookService.create({
        packName: 'test-pack',
        url: 'https://example.com/hook',
        events: ['delete'], // Only subscribed to delete
        username: 'author',
      });

      const count = await webhookService.dispatch(
        'test-pack',
        'publish', // Dispatching publish event
        { version: '1.0.0' }
      );
      expect(count).toBe(0);
    });

    test('skips inactive webhooks', async () => {
      seedPack();
      const hook = await webhookService.create({
        packName: 'test-pack',
        url: 'https://example.com/hook',
        events: ['publish'],
        username: 'author',
      });

      await webhookService.update(hook.id, { active: false });

      const count = await webhookService.dispatch('test-pack', 'publish', {
        version: '1.0.0',
      });
      expect(count).toBe(0);
    });
  });
});

describe('Webhook routes', () => {
  let app: typeof import('../src/server.js').app;

  beforeEach(async () => {
    db = setupTestDb();
    app = (await import('../src/server.js')).app;
    seedPack();
    seedAuth('author', 'author-token');
    seedAuth('other', 'other-token');
  });

  test('POST /packs/:name/webhooks creates a webhook', async () => {
    const res = await app.handle(
      new Request('http://localhost/packs/test-pack/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer author-token',
        },
        body: JSON.stringify({
          url: 'https://example.com/hook',
          events: ['publish'],
        }),
      })
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.url).toBe('https://example.com/hook');
  });

  test('POST /packs/:name/webhooks rejects non-author', async () => {
    const res = await app.handle(
      new Request('http://localhost/packs/test-pack/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer other-token',
        },
        body: JSON.stringify({
          url: 'https://example.com/hook',
          events: ['publish'],
        }),
      })
    );
    expect(res.status).toBe(403);
  });

  test('POST /packs/:name/webhooks rejects invalid URL', async () => {
    const res = await app.handle(
      new Request('http://localhost/packs/test-pack/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer author-token',
        },
        body: JSON.stringify({
          url: 'not-a-url',
          events: ['publish'],
        }),
      })
    );
    expect(res.status).toBe(400);
  });

  test('POST /packs/:name/webhooks rejects invalid events', async () => {
    const res = await app.handle(
      new Request('http://localhost/packs/test-pack/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer author-token',
        },
        body: JSON.stringify({
          url: 'https://example.com/hook',
          events: ['invalid-event'],
        }),
      })
    );
    expect(res.status).toBe(400);
  });

  test('GET /packs/:name/webhooks lists webhooks', async () => {
    // Create one first
    await app.handle(
      new Request('http://localhost/packs/test-pack/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer author-token',
        },
        body: JSON.stringify({
          url: 'https://example.com/hook',
          events: ['publish'],
        }),
      })
    );

    const res = await app.handle(
      new Request('http://localhost/packs/test-pack/webhooks', {
        headers: { Authorization: 'Bearer author-token' },
      })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.webhooks).toHaveLength(1);
  });

  test('DELETE /packs/:name/webhooks/:id deletes webhook', async () => {
    // Create
    const createRes = await app.handle(
      new Request('http://localhost/packs/test-pack/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer author-token',
        },
        body: JSON.stringify({
          url: 'https://example.com/hook',
          events: ['publish'],
        }),
      })
    );
    const { id } = await createRes.json();

    const res = await app.handle(
      new Request(`http://localhost/packs/test-pack/webhooks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer author-token' },
      })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.deleted).toBe(true);
  });
});
