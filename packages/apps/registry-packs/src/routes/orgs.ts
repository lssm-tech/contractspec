import { Elysia, t } from 'elysia';
import { getDb } from '../db/client.js';
import { OrgService } from '../services/org-service.js';
import { extractAuth } from '../auth/middleware.js';

/**
 * Organization routes: /orgs
 */
export const orgRoutes = new Elysia({ prefix: '/orgs' })
  .get('/:name', async ({ params, set }) => {
    const db = getDb();
    const orgService = new OrgService(db);

    const org = await orgService.get(params.name);
    if (!org) {
      set.status = 404;
      return { error: `Organization "${params.name}" not found` };
    }

    const members = await orgService.listMembers(params.name);
    return {
      ...org,
      members: members.map((m) => ({
        username: m.username,
        role: m.role,
      })),
    };
  })
  .post(
    '/',
    async ({ body, set, headers }) => {
      const auth = await extractAuth(headers);
      if (!auth) {
        set.status = 401;
        return { error: 'Authentication required' };
      }

      const db = getDb();
      const orgService = new OrgService(db);

      // Check if org name is valid (lowercase, alphanumeric + hyphens)
      if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(body.name)) {
        set.status = 400;
        return {
          error:
            'Organization name must be lowercase alphanumeric with hyphens, min 2 chars',
        };
      }

      // Check if org already exists
      const existing = await orgService.get(body.name);
      if (existing) {
        set.status = 409;
        return { error: `Organization "${body.name}" already exists` };
      }

      const org = await orgService.create({
        name: body.name,
        displayName: body.displayName,
        description: body.description,
        website: body.website,
        ownerUsername: auth.username,
      });

      set.status = 201;
      return org;
    },
    {
      body: t.Object({
        name: t.String(),
        displayName: t.String(),
        description: t.Optional(t.String()),
        website: t.Optional(t.String()),
      }),
    }
  )
  .put(
    '/:name',
    async ({ params, body, set, headers }) => {
      const auth = await extractAuth(headers);
      if (!auth) {
        set.status = 401;
        return { error: 'Authentication required' };
      }

      const db = getDb();
      const orgService = new OrgService(db);

      // Only admins/owners can update
      const hasPermission = await orgService.hasRole(
        params.name,
        auth.username,
        'admin'
      );
      if (!hasPermission) {
        set.status = 403;
        return { error: 'Insufficient permissions' };
      }

      const org = await orgService.update(params.name, body);
      if (!org) {
        set.status = 404;
        return { error: `Organization "${params.name}" not found` };
      }

      return org;
    },
    {
      body: t.Object({
        displayName: t.Optional(t.String()),
        description: t.Optional(t.String()),
        website: t.Optional(t.String()),
      }),
    }
  )
  .delete('/:name', async ({ params, set, headers }) => {
    const auth = await extractAuth(headers);
    if (!auth) {
      set.status = 401;
      return { error: 'Authentication required' };
    }

    const db = getDb();
    const orgService = new OrgService(db);

    // Only owners can delete
    const isOwner = await orgService.hasRole(
      params.name,
      auth.username,
      'owner'
    );
    if (!isOwner) {
      set.status = 403;
      return { error: 'Only organization owners can delete' };
    }

    const deleted = await orgService.delete(params.name);
    if (!deleted) {
      set.status = 404;
      return { error: `Organization "${params.name}" not found` };
    }

    return { deleted: true };
  });

/**
 * Org member management routes: /orgs/:name/members
 */
export const orgMemberRoutes = new Elysia({ prefix: '/orgs' })
  .get('/:name/members', async ({ params, set }) => {
    const db = getDb();
    const orgService = new OrgService(db);

    const org = await orgService.get(params.name);
    if (!org) {
      set.status = 404;
      return { error: `Organization "${params.name}" not found` };
    }

    const members = await orgService.listMembers(params.name);
    return { members };
  })
  .post(
    '/:name/members',
    async ({ params, body, set, headers }) => {
      const auth = await extractAuth(headers);
      if (!auth) {
        set.status = 401;
        return { error: 'Authentication required' };
      }

      const db = getDb();
      const orgService = new OrgService(db);

      // Only admins/owners can add members
      const hasPermission = await orgService.hasRole(
        params.name,
        auth.username,
        'admin'
      );
      if (!hasPermission) {
        set.status = 403;
        return { error: 'Insufficient permissions' };
      }

      const member = await orgService.addMember(
        params.name,
        body.username,
        body.role as 'owner' | 'admin' | 'member' | undefined
      );

      set.status = 201;
      return member;
    },
    {
      body: t.Object({
        username: t.String(),
        role: t.Optional(t.String()),
      }),
    }
  )
  .delete('/:name/members/:username', async ({ params, set, headers }) => {
    const auth = await extractAuth(headers);
    if (!auth) {
      set.status = 401;
      return { error: 'Authentication required' };
    }

    const db = getDb();
    const orgService = new OrgService(db);

    // Admins/owners can remove; members can remove themselves
    const isAdminOrOwner = await orgService.hasRole(
      params.name,
      auth.username,
      'admin'
    );
    const isSelf = auth.username === params.username;

    if (!isAdminOrOwner && !isSelf) {
      set.status = 403;
      return { error: 'Insufficient permissions' };
    }

    const removed = await orgService.removeMember(params.name, params.username);
    if (!removed) {
      set.status = 404;
      return { error: 'Member not found' };
    }

    return { removed: true };
  });
