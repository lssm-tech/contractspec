import type {
  MessagingProvider,
  MessagingSendInput,
  MessagingSendResult,
  MessagingUpdateInput,
} from '../messaging';

interface SlackPostResponse {
  ok?: boolean;
  error?: string;
  ts?: string;
  channel?: string;
}

export interface SlackMessagingProviderOptions {
  botToken: string;
  defaultChannelId?: string;
  apiBaseUrl?: string;
}

export class SlackMessagingProvider implements MessagingProvider {
  private readonly botToken: string;
  private readonly defaultChannelId?: string;
  private readonly apiBaseUrl: string;

  constructor(options: SlackMessagingProviderOptions) {
    this.botToken = options.botToken;
    this.defaultChannelId = options.defaultChannelId;
    this.apiBaseUrl = options.apiBaseUrl ?? 'https://slack.com/api';
  }

  async sendMessage(input: MessagingSendInput): Promise<MessagingSendResult> {
    const channel =
      input.channelId ?? input.recipientId ?? this.defaultChannelId;
    if (!channel) {
      throw new Error(
        'Slack sendMessage requires channelId, recipientId, or defaultChannelId.'
      );
    }

    const payload = {
      channel,
      text: input.text,
      mrkdwn: input.markdown ?? true,
      thread_ts: input.threadId,
    };

    const response = await fetch(`${this.apiBaseUrl}/chat.postMessage`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${this.botToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const body = (await response.json()) as SlackPostResponse;

    if (!response.ok || !body.ok || !body.ts) {
      throw new Error(
        `Slack sendMessage failed: ${body.error ?? `HTTP_${response.status}`}`
      );
    }

    return {
      id: `slack:${body.channel ?? channel}:${body.ts}`,
      providerMessageId: body.ts,
      status: 'sent',
      sentAt: new Date(),
      metadata: {
        channelId: body.channel ?? channel,
      },
    };
  }

  async updateMessage(
    messageId: string,
    input: MessagingUpdateInput
  ): Promise<MessagingSendResult> {
    const channel = input.channelId ?? this.defaultChannelId;
    if (!channel) {
      throw new Error(
        'Slack updateMessage requires channelId or defaultChannelId.'
      );
    }

    const response = await fetch(`${this.apiBaseUrl}/chat.update`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${this.botToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        channel,
        ts: messageId,
        text: input.text,
        mrkdwn: input.markdown ?? true,
      }),
    });

    const body = (await response.json()) as SlackPostResponse;
    if (!response.ok || !body.ok || !body.ts) {
      throw new Error(
        `Slack updateMessage failed: ${body.error ?? `HTTP_${response.status}`}`
      );
    }

    return {
      id: `slack:${body.channel ?? channel}:${body.ts}`,
      providerMessageId: body.ts,
      status: 'sent',
      sentAt: new Date(),
      metadata: {
        channelId: body.channel ?? channel,
      },
    };
  }
}
