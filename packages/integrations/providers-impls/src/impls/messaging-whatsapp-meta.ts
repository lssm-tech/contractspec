import type {
  MessagingProvider,
  MessagingSendInput,
  MessagingSendResult,
} from '../messaging';

interface MetaWhatsappSendResponse {
  messages?: { id?: string }[];
  error?: {
    message?: string;
    code?: number;
  };
}

export interface MetaWhatsappMessagingProviderOptions {
  accessToken: string;
  phoneNumberId: string;
  apiVersion?: string;
}

export class MetaWhatsappMessagingProvider implements MessagingProvider {
  private readonly accessToken: string;
  private readonly phoneNumberId: string;
  private readonly apiVersion: string;

  constructor(options: MetaWhatsappMessagingProviderOptions) {
    this.accessToken = options.accessToken;
    this.phoneNumberId = options.phoneNumberId;
    this.apiVersion = options.apiVersion ?? 'v22.0';
  }

  async sendMessage(input: MessagingSendInput): Promise<MessagingSendResult> {
    const to = input.recipientId;
    if (!to) {
      throw new Error('Meta WhatsApp sendMessage requires recipientId.');
    }

    const response = await fetch(
      `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${this.accessToken}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: {
            body: input.text,
            preview_url: false,
          },
        }),
      }
    );

    const body = (await response.json()) as MetaWhatsappSendResponse;
    const messageId = body.messages?.[0]?.id;

    if (!response.ok || !messageId) {
      const errorCode = body.error?.code != null ? String(body.error.code) : '';
      throw new Error(
        `Meta WhatsApp sendMessage failed: ${body.error?.message ?? `HTTP_${response.status}`}${errorCode ? ` (${errorCode})` : ''}`
      );
    }

    return {
      id: messageId,
      providerMessageId: messageId,
      status: 'sent',
      sentAt: new Date(),
      metadata: {
        phoneNumberId: this.phoneNumberId,
      },
    };
  }
}
