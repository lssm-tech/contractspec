/**
 * Notification channel interface.
 */
export interface NotificationChannel {
  /** Channel identifier */
  readonly channelId: string;
  /** Deliver a notification */
  send(notification: ChannelNotification): Promise<ChannelDeliveryResult>;
  /** Check if channel is available */
  isAvailable(): Promise<boolean>;
}

/**
 * Notification to deliver via a channel.
 */
export interface ChannelNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  actionUrl?: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
  // Channel-specific data
  email?: {
    to: string;
    subject: string;
    html?: string;
    text?: string;
  };
  push?: {
    token: string;
    badge?: number;
    sound?: string;
    data?: Record<string, unknown>;
  };
  webhook?: {
    url: string;
    headers?: Record<string, string>;
  };
}

/**
 * Result of channel delivery attempt.
 */
export interface ChannelDeliveryResult {
  success: boolean;
  externalId?: string;
  responseCode?: string;
  responseMessage?: string;
  metadata?: Record<string, unknown>;
}

/**
 * In-app notification channel (stores in database).
 */
export class InAppChannel implements NotificationChannel {
  readonly channelId = 'IN_APP';

  async send(notification: ChannelNotification): Promise<ChannelDeliveryResult> {
    // In-app notifications are stored directly in the database
    // The actual delivery is handled by the notification service
    return {
      success: true,
      responseMessage: 'Stored in database',
    };
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}

/**
 * Console channel for development/testing.
 */
export class ConsoleChannel implements NotificationChannel {
  readonly channelId = 'CONSOLE';

  async send(notification: ChannelNotification): Promise<ChannelDeliveryResult> {
    console.log(`📬 [${notification.id}] ${notification.title}`);
    console.log(`   ${notification.body}`);
    if (notification.actionUrl) {
      console.log(`   Action: ${notification.actionUrl}`);
    }
    return {
      success: true,
      responseMessage: 'Logged to console',
    };
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}

/**
 * Email channel interface (to be implemented with provider).
 */
export abstract class EmailChannel implements NotificationChannel {
  readonly channelId = 'EMAIL';

  abstract send(notification: ChannelNotification): Promise<ChannelDeliveryResult>;

  async isAvailable(): Promise<boolean> {
    return true;
  }
}

/**
 * Push notification channel interface (to be implemented with provider).
 */
export abstract class PushChannel implements NotificationChannel {
  readonly channelId = 'PUSH';

  abstract send(notification: ChannelNotification): Promise<ChannelDeliveryResult>;

  async isAvailable(): Promise<boolean> {
    return true;
  }
}

/**
 * Webhook channel for external integrations.
 */
export class WebhookChannel implements NotificationChannel {
  readonly channelId = 'WEBHOOK';

  async send(notification: ChannelNotification): Promise<ChannelDeliveryResult> {
    if (!notification.webhook?.url) {
      return {
        success: false,
        responseMessage: 'No webhook URL configured',
      };
    }

    try {
      const response = await fetch(notification.webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...notification.webhook.headers,
        },
        body: JSON.stringify({
          id: notification.id,
          title: notification.title,
          body: notification.body,
          actionUrl: notification.actionUrl,
          metadata: notification.metadata,
        }),
      });

      return {
        success: response.ok,
        responseCode: String(response.status),
        responseMessage: response.statusText,
      };
    } catch (error) {
      return {
        success: false,
        responseMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}

/**
 * Channel registry for managing available channels.
 */
export class ChannelRegistry {
  private channels = new Map<string, NotificationChannel>();

  register(channel: NotificationChannel): void {
    this.channels.set(channel.channelId, channel);
  }

  get(channelId: string): NotificationChannel | undefined {
    return this.channels.get(channelId);
  }

  getAll(): NotificationChannel[] {
    return Array.from(this.channels.values());
  }

  async getAvailable(): Promise<NotificationChannel[]> {
    const available: NotificationChannel[] = [];
    for (const channel of this.channels.values()) {
      if (await channel.isAvailable()) {
        available.push(channel);
      }
    }
    return available;
  }
}

/**
 * Create a default channel registry with standard channels.
 */
export function createChannelRegistry(): ChannelRegistry {
  const registry = new ChannelRegistry();
  registry.register(new InAppChannel());
  registry.register(new ConsoleChannel());
  registry.register(new WebhookChannel());
  return registry;
}

