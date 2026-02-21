/**
 * Tests for OrgService — organization management and scoped pack names.
 */
import { describe, test, expect, beforeEach } from 'bun:test';
import { setupTestDb } from './test-app.js';
import * as schema from '../src/db/schema.js';
import type { Db } from '../src/db/client.js';
import { OrgService } from '../src/services/org-service.js';
import { hashToken } from '../src/auth/token.js';

let db: Db;
let orgService: OrgService;

function seedAuth(username: string, token: string) {
  db.insert(schema.authTokens)
    .values({
      token: hashToken(token),
      username,
      scope: 'publish',
    })
    .run();
}

describe('OrgService', () => {
  beforeEach(() => {
    db = setupTestDb();
    orgService = new OrgService(db);
  });

  describe('create', () => {
    test('creates an org and adds owner', async () => {
      const org = await orgService.create({
        name: 'my-org',
        displayName: 'My Organization',
        description: 'Test org',
        ownerUsername: 'alice',
      });

      expect(org.name).toBe('my-org');
      expect(org.displayName).toBe('My Organization');

      const members = await orgService.listMembers('my-org');
      expect(members).toHaveLength(1);
      expect(members[0]!.username).toBe('alice');
      expect(members[0]!.role).toBe('owner');
    });
  });

  describe('get', () => {
    test('returns null for non-existent org', async () => {
      const org = await orgService.get('nonexistent');
      expect(org).toBeNull();
    });

    test('returns the org', async () => {
      await orgService.create({
        name: 'test-org',
        displayName: 'Test Org',
        ownerUsername: 'owner',
      });

      const org = await orgService.get('test-org');
      expect(org).not.toBeNull();
      expect(org!.name).toBe('test-org');
    });
  });

  describe('update', () => {
    test('updates org details', async () => {
      await orgService.create({
        name: 'test-org',
        displayName: 'Test',
        ownerUsername: 'owner',
      });

      const updated = await orgService.update('test-org', {
        displayName: 'Updated Name',
        description: 'New description',
      });

      expect(updated!.displayName).toBe('Updated Name');
      expect(updated!.description).toBe('New description');
    });
  });

  describe('delete', () => {
    test('deletes org and cascades members', async () => {
      await orgService.create({
        name: 'test-org',
        displayName: 'Test',
        ownerUsername: 'owner',
      });

      const deleted = await orgService.delete('test-org');
      expect(deleted).toBe(true);

      const org = await orgService.get('test-org');
      expect(org).toBeNull();

      const members = await orgService.listMembers('test-org');
      expect(members).toHaveLength(0);
    });

    test('returns false for non-existent org', async () => {
      const deleted = await orgService.delete('nonexistent');
      expect(deleted).toBe(false);
    });
  });

  describe('addMember', () => {
    test('adds a new member', async () => {
      await orgService.create({
        name: 'test-org',
        displayName: 'Test',
        ownerUsername: 'owner',
      });

      const member = await orgService.addMember('test-org', 'bob', 'admin');
      expect(member.username).toBe('bob');
      expect(member.role).toBe('admin');

      const members = await orgService.listMembers('test-org');
      expect(members).toHaveLength(2); // owner + bob
    });

    test('updates role of existing member', async () => {
      await orgService.create({
        name: 'test-org',
        displayName: 'Test',
        ownerUsername: 'owner',
      });
      await orgService.addMember('test-org', 'bob', 'member');
      const updated = await orgService.addMember('test-org', 'bob', 'admin');

      expect(updated.role).toBe('admin');

      // Should still be 2 members, not 3
      const members = await orgService.listMembers('test-org');
      expect(members).toHaveLength(2);
    });
  });

  describe('removeMember', () => {
    test('removes a member', async () => {
      await orgService.create({
        name: 'test-org',
        displayName: 'Test',
        ownerUsername: 'owner',
      });
      await orgService.addMember('test-org', 'bob', 'member');

      const removed = await orgService.removeMember('test-org', 'bob');
      expect(removed).toBe(true);

      const members = await orgService.listMembers('test-org');
      expect(members).toHaveLength(1); // Only owner left
    });

    test('returns false for non-existent member', async () => {
      await orgService.create({
        name: 'test-org',
        displayName: 'Test',
        ownerUsername: 'owner',
      });
      const removed = await orgService.removeMember('test-org', 'ghost');
      expect(removed).toBe(false);
    });
  });

  describe('hasRole', () => {
    test('owner has all roles', async () => {
      await orgService.create({
        name: 'test-org',
        displayName: 'Test',
        ownerUsername: 'owner',
      });

      expect(await orgService.hasRole('test-org', 'owner', 'owner')).toBe(true);
      expect(await orgService.hasRole('test-org', 'owner', 'admin')).toBe(true);
      expect(await orgService.hasRole('test-org', 'owner', 'member')).toBe(
        true
      );
    });

    test('admin has admin and member roles', async () => {
      await orgService.create({
        name: 'test-org',
        displayName: 'Test',
        ownerUsername: 'owner',
      });
      await orgService.addMember('test-org', 'admin-user', 'admin');

      expect(await orgService.hasRole('test-org', 'admin-user', 'owner')).toBe(
        false
      );
      expect(await orgService.hasRole('test-org', 'admin-user', 'admin')).toBe(
        true
      );
      expect(await orgService.hasRole('test-org', 'admin-user', 'member')).toBe(
        true
      );
    });

    test('member only has member role', async () => {
      await orgService.create({
        name: 'test-org',
        displayName: 'Test',
        ownerUsername: 'owner',
      });
      await orgService.addMember('test-org', 'regular', 'member');

      expect(await orgService.hasRole('test-org', 'regular', 'owner')).toBe(
        false
      );
      expect(await orgService.hasRole('test-org', 'regular', 'admin')).toBe(
        false
      );
      expect(await orgService.hasRole('test-org', 'regular', 'member')).toBe(
        true
      );
    });

    test('non-member has no roles', async () => {
      await orgService.create({
        name: 'test-org',
        displayName: 'Test',
        ownerUsername: 'owner',
      });

      expect(await orgService.hasRole('test-org', 'stranger', 'member')).toBe(
        false
      );
    });
  });

  describe('parseOrgScope', () => {
    test('parses scoped pack names', () => {
      expect(OrgService.parseOrgScope('@my-org/pack-name')).toBe('my-org');
      expect(OrgService.parseOrgScope('@team/tools')).toBe('team');
    });

    test('returns null for unscoped names', () => {
      expect(OrgService.parseOrgScope('simple-pack')).toBeNull();
      expect(OrgService.parseOrgScope('@noSlash')).toBeNull();
    });
  });

  describe('getUserOrgs', () => {
    test('returns orgs a user belongs to', async () => {
      await orgService.create({
        name: 'org-a',
        displayName: 'Org A',
        ownerUsername: 'alice',
      });
      await orgService.create({
        name: 'org-b',
        displayName: 'Org B',
        ownerUsername: 'bob',
      });
      await orgService.addMember('org-b', 'alice', 'member');

      const orgs = await orgService.getUserOrgs('alice');
      expect(orgs).toHaveLength(2);
    });
  });
});

describe('Org routes', () => {
  let app: typeof import('../src/server.js').app;

  beforeEach(async () => {
    db = setupTestDb();
    app = (await import('../src/server.js')).app;
    seedAuth('alice', 'alice-token');
    seedAuth('bob', 'bob-token');
  });

  test('POST /orgs creates an organization', async () => {
    const res = await app.handle(
      new Request('http://localhost/orgs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer alice-token',
        },
        body: JSON.stringify({
          name: 'test-org',
          displayName: 'Test Org',
          description: 'A test org',
        }),
      })
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.name).toBe('test-org');
  });

  test('POST /orgs rejects invalid name', async () => {
    const res = await app.handle(
      new Request('http://localhost/orgs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer alice-token',
        },
        body: JSON.stringify({
          name: 'INVALID!',
          displayName: 'Bad Name',
        }),
      })
    );
    expect(res.status).toBe(400);
  });

  test('POST /orgs requires auth', async () => {
    const res = await app.handle(
      new Request('http://localhost/orgs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'test-org',
          displayName: 'Test Org',
        }),
      })
    );
    expect(res.status).toBe(401);
  });

  test('GET /orgs/:name returns org with members', async () => {
    // Create org first
    await app.handle(
      new Request('http://localhost/orgs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer alice-token',
        },
        body: JSON.stringify({
          name: 'test-org',
          displayName: 'Test Org',
        }),
      })
    );

    const res = await app.handle(new Request('http://localhost/orgs/test-org'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe('test-org');
    expect(body.members).toHaveLength(1);
    expect(body.members[0].username).toBe('alice');
    expect(body.members[0].role).toBe('owner');
  });

  test('GET /orgs/:name returns 404 for unknown org', async () => {
    const res = await app.handle(
      new Request('http://localhost/orgs/nonexistent')
    );
    expect(res.status).toBe(404);
  });

  test('POST /orgs/:name/members adds a member', async () => {
    // Create org
    await app.handle(
      new Request('http://localhost/orgs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer alice-token',
        },
        body: JSON.stringify({
          name: 'test-org',
          displayName: 'Test Org',
        }),
      })
    );

    const res = await app.handle(
      new Request('http://localhost/orgs/test-org/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer alice-token',
        },
        body: JSON.stringify({ username: 'bob', role: 'admin' }),
      })
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.username).toBe('bob');
    expect(body.role).toBe('admin');
  });

  test('POST /orgs/:name/members rejects unauthorized user', async () => {
    // Create org as alice
    await app.handle(
      new Request('http://localhost/orgs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer alice-token',
        },
        body: JSON.stringify({
          name: 'test-org',
          displayName: 'Test Org',
        }),
      })
    );

    // Bob (not a member) tries to add someone
    const res = await app.handle(
      new Request('http://localhost/orgs/test-org/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer bob-token',
        },
        body: JSON.stringify({ username: 'charlie' }),
      })
    );
    expect(res.status).toBe(403);
  });

  test('DELETE /orgs/:name deletes org (owner only)', async () => {
    // Create org as alice
    await app.handle(
      new Request('http://localhost/orgs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer alice-token',
        },
        body: JSON.stringify({
          name: 'test-org',
          displayName: 'Test Org',
        }),
      })
    );

    const res = await app.handle(
      new Request('http://localhost/orgs/test-org', {
        method: 'DELETE',
        headers: { Authorization: 'Bearer alice-token' },
      })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.deleted).toBe(true);
  });
});
