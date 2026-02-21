import { Elysia, t } from 'elysia';
import { getDb } from '../db/client.js';
import { PackService } from '../services/pack-service.js';
import {
  WebhookService,
  type WebhookEvent,
} from '../services/webhook-service.js';
import { extractAuth } from '../auth/middleware.js';

const VALID_EVENTS: WebhookEvent[] = ['publish', 'update', 'delete'];

/**
 * Webhook management routes: /packs/:name/webhooks
 */
export const webhookRoutes = new Elysia({ prefix: '/packs' })
  .get('/:name/webhooks', async ({ params, set, headers }) => {
    const auth = await extractAuth(headers);
    if (!auth) {
      set.status = 401;
      return { error: 'Authentication required' };
    }

    const db = getDb();
    const packService = new PackService(db);
    const pack = await packService.get(params.name);
    if (!pack) {
      set.status = 404;
      return { error: `Pack "${params.name}" not found` };
    }

    // Only pack author can view webhooks
    if (pack.authorName !== auth.username) {
      set.status = 403;
      return { error: 'Only the pack author can manage webhooks' };
    }

    const webhookService = new WebhookService(db);
    const hooks = await webhookService.list(params.name);
    return { webhooks: hooks };
  })
  .post(
    '/:name/webhooks',
    async ({ params, body, set, headers }) => {
      const auth = await extractAuth(headers);
      if (!auth) {
        set.status = 401;
        return { error: 'Authentication required' };
      }

      const db = getDb();
      const packService = new PackService(db);
      const pack = await packService.get(params.name);
      if (!pack) {
        set.status = 404;
        return { error: `Pack "${params.name}" not found` };
      }

      if (pack.authorName !== auth.username) {
        set.status = 403;
        return { error: 'Only the pack author can manage webhooks' };
      }

      // Validate events
      const events = body.events as WebhookEvent[];
      for (const event of events) {
        if (!VALID_EVENTS.includes(event)) {
          set.status = 400;
          return {
            error: `Invalid event: ${event}. Valid: ${VALID_EVENTS.join(', ')}`,
          };
        }
      }

      // Validate URL
      try {
        new URL(body.url);
      } catch {
        set.status = 400;
        return { error: 'Invalid webhook URL' };
      }

      const webhookService = new WebhookService(db);
      const webhook = await webhookService.create({
        packName: params.name,
        url: body.url,
        secret: body.secret,
        events,
        username: auth.username,
      });

      set.status = 201;
      return webhook;
    },
    {
      body: t.Object({
        url: t.String(),
        secret: t.Optional(t.String()),
        events: t.Array(t.String()),
      }),
    }
  )
  .delete('/:name/webhooks/:id', async ({ params, set, headers }) => {
    const auth = await extractAuth(headers);
    if (!auth) {
      set.status = 401;
      return { error: 'Authentication required' };
    }

    const db = getDb();
    const webhookService = new WebhookService(db);

    const hook = await webhookService.get(Number(params.id));
    if (!hook) {
      set.status = 404;
      return { error: 'Webhook not found' };
    }

    // Only the webhook creator can delete it
    if (hook.username !== auth.username) {
      set.status = 403;
      return { error: 'Insufficient permissions' };
    }

    await webhookService.delete(Number(params.id));
    return { deleted: true };
  })
  .get('/:name/webhooks/:id/deliveries', async ({ params, set, headers }) => {
    const auth = await extractAuth(headers);
    if (!auth) {
      set.status = 401;
      return { error: 'Authentication required' };
    }

    const db = getDb();
    const webhookService = new WebhookService(db);

    const hook = await webhookService.get(Number(params.id));
    if (!hook) {
      set.status = 404;
      return { error: 'Webhook not found' };
    }

    if (hook.username !== auth.username) {
      set.status = 403;
      return { error: 'Insufficient permissions' };
    }

    const deliveries = await webhookService.getDeliveries(Number(params.id));
    return { deliveries };
  });
