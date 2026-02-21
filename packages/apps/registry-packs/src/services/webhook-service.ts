import { eq, and } from 'drizzle-orm';
import { createHmac } from 'crypto';
import type { Db } from '../db/client.js';
import {
  webhooks,
  webhookDeliveries,
  type Webhook,
  type WebhookDelivery,
} from '../db/schema.js';

/** Valid webhook event types. */
export type WebhookEvent = 'publish' | 'update' | 'delete';

/** Payload shape sent to webhook endpoints. */
export interface WebhookPayload {
  event: WebhookEvent;
  pack: string;
  version?: string;
  timestamp: string;
  data: Record<string, unknown>;
}

/**
 * Service for managing webhooks and dispatching events.
 */
export class WebhookService {
  constructor(private db: Db) {}

  /** Register a new webhook for a pack. */
  async create(input: {
    packName: string;
    url: string;
    secret?: string;
    events: WebhookEvent[];
    username: string;
  }): Promise<Webhook> {
    const now = new Date().toISOString();
    const result = await this.db
      .insert(webhooks)
      .values({
        packName: input.packName,
        url: input.url,
        secret: input.secret ?? null,
        events: input.events,
        username: input.username,
        active: true,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    const created = result[0];
    if (!created) {
      throw new Error(`Failed to create webhook for pack ${input.packName}`);
    }
    return created;
  }

  /** List webhooks for a pack. */
  async list(packName: string): Promise<Webhook[]> {
    return this.db
      .select()
      .from(webhooks)
      .where(eq(webhooks.packName, packName));
  }

  /** Get a specific webhook by ID. */
  async get(id: number): Promise<Webhook | null> {
    const result = await this.db
      .select()
      .from(webhooks)
      .where(eq(webhooks.id, id))
      .limit(1);
    return result[0] ?? null;
  }

  /** Update a webhook. */
  async update(
    id: number,
    updates: Partial<Pick<Webhook, 'url' | 'secret' | 'events' | 'active'>>
  ): Promise<Webhook | null> {
    await this.db
      .update(webhooks)
      .set({ ...updates, updatedAt: new Date().toISOString() })
      .where(eq(webhooks.id, id));
    return this.get(id);
  }

  /** Delete a webhook. */
  async delete(id: number): Promise<boolean> {
    const result = await this.db.delete(webhooks).where(eq(webhooks.id, id));
    return (result as unknown as { changes: number }).changes > 0;
  }

  /** Get delivery log for a webhook. */
  async getDeliveries(
    webhookId: number,
    limit = 20
  ): Promise<WebhookDelivery[]> {
    return this.db
      .select()
      .from(webhookDeliveries)
      .where(eq(webhookDeliveries.webhookId, webhookId))
      .limit(limit);
  }

  /**
   * Dispatch an event to all matching webhooks for a pack.
   * Fires HTTP POST to each registered URL with HMAC signing.
   * Returns the number of successful deliveries.
   */
  async dispatch(
    packName: string,
    event: WebhookEvent,
    data: Record<string, unknown>,
    version?: string
  ): Promise<number> {
    // Find all active webhooks for this pack that subscribe to this event
    const allHooks = await this.db
      .select()
      .from(webhooks)
      .where(and(eq(webhooks.packName, packName), eq(webhooks.active, true)));

    // Filter by event subscription (JSON array contains)
    const matching = allHooks.filter((h) => {
      const events = this.parseJsonArray(h.events);
      return events.includes(event);
    });

    if (matching.length === 0) return 0;

    const payload: WebhookPayload = {
      event,
      pack: packName,
      version,
      timestamp: new Date().toISOString(),
      data,
    };

    const payloadJson = JSON.stringify(payload);
    let successCount = 0;

    const deliveries = matching.map((hook) =>
      this.deliverToHook(hook, event, payload, payloadJson)
    );

    const results = await Promise.allSettled(deliveries);
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value) successCount++;
    }

    return successCount;
  }

  /** Deliver a payload to a single webhook endpoint. */
  private async deliverToHook(
    hook: Webhook,
    event: string,
    payload: WebhookPayload,
    payloadJson: string
  ): Promise<boolean> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Registry-Event': event,
      'X-Registry-Delivery': String(Date.now()),
    };

    // HMAC signature if secret is configured
    if (hook.secret) {
      const signature = createHmac('sha256', hook.secret)
        .update(payloadJson)
        .digest('hex');
      headers['X-Registry-Signature'] = `sha256=${signature}`;
    }

    let statusCode: number | null = null;
    let responseBody: string | null = null;
    let success = false;

    try {
      const res = await fetch(hook.url, {
        method: 'POST',
        headers,
        body: payloadJson,
        signal: AbortSignal.timeout(10_000), // 10s timeout
      });

      statusCode = res.status;
      responseBody = await res.text().catch(() => null);
      success = res.ok;
    } catch (err) {
      responseBody = err instanceof Error ? err.message : String(err);
    }

    // Record the delivery attempt
    await this.db.insert(webhookDeliveries).values({
      webhookId: hook.id,
      event,
      payload: payload as unknown as Record<string, unknown>,
      statusCode,
      responseBody,
      success,
      attemptedAt: new Date().toISOString(),
    });

    return success;
  }

  /** Safely parse JSON array field. */
  private parseJsonArray(value: unknown): string[] {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }
}
