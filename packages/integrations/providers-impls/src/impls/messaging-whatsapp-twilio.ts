import { Buffer } from 'node:buffer';

import type {
  MessagingDeliveryStatus,
  MessagingProvider,
  MessagingSendInput,
  MessagingSendResult,
} from '../messaging';

interface TwilioMessageResponse {
  sid?: string;
  status?: string;
  error_code?: number | null;
  error_message?: string | null;
}

export interface TwilioWhatsappMessagingProviderOptions {
  accountSid: string;
  authToken: string;
  fromNumber?: string;
}

export class TwilioWhatsappMessagingProvider implements MessagingProvider {
  private readonly accountSid: string;
  private readonly authToken: string;
  private readonly fromNumber?: string;

  constructor(options: TwilioWhatsappMessagingProviderOptions) {
    this.accountSid = options.accountSid;
    this.authToken = options.authToken;
    this.fromNumber = options.fromNumber;
  }

  async sendMessage(input: MessagingSendInput): Promise<MessagingSendResult> {
    const to = normalizeWhatsappAddress(input.recipientId);
    const from = normalizeWhatsappAddress(input.channelId ?? this.fromNumber);

    if (!to) {
      throw new Error('Twilio WhatsApp sendMessage requires recipientId.');
    }
    if (!from) {
      throw new Error(
        'Twilio WhatsApp sendMessage requires channelId or configured fromNumber.'
      );
    }

    const params = new URLSearchParams();
    params.set('To', to);
    params.set('From', from);
    params.set('Body', input.text);

    const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString(
      'base64'
    );

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          authorization: `Basic ${auth}`,
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    const body = (await response.json()) as TwilioMessageResponse;

    if (!response.ok || !body.sid) {
      throw new Error(
        `Twilio WhatsApp sendMessage failed: ${body.error_message ?? `HTTP_${response.status}`}`
      );
    }

    return {
      id: body.sid,
      providerMessageId: body.sid,
      status: mapTwilioStatus(body.status),
      sentAt: new Date(),
      errorCode: body.error_code != null ? String(body.error_code) : undefined,
      errorMessage: body.error_message ?? undefined,
      metadata: {
        from,
        to,
      },
    };
  }
}

function normalizeWhatsappAddress(value?: string): string | null {
  if (!value) return null;
  if (value.startsWith('whatsapp:')) return value;
  return `whatsapp:${value}`;
}

function mapTwilioStatus(status?: string): MessagingDeliveryStatus {
  switch (status) {
    case 'queued':
    case 'accepted':
    case 'scheduled':
      return 'queued';
    case 'sending':
      return 'sending';
    case 'delivered':
      return 'delivered';
    case 'failed':
    case 'undelivered':
    case 'canceled':
      return 'failed';
    case 'sent':
    default:
      return 'sent';
  }
}
