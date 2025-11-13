import Twilio from 'twilio';

import type {
  SendSmsInput,
  SmsDeliveryStatus,
  SmsMessage,
  SmsProvider,
} from '../sms';

type TwilioClient = ReturnType<typeof Twilio>;

export interface TwilioSmsProviderOptions {
  accountSid: string;
  authToken: string;
  fromNumber?: string;
  client?: TwilioClient;
}

export class TwilioSmsProvider implements SmsProvider {
  private readonly client: TwilioClient;
  private readonly fromNumber?: string;

  constructor(options: TwilioSmsProviderOptions) {
    this.client =
      options.client ?? Twilio(options.accountSid, options.authToken);
    this.fromNumber = options.fromNumber;
  }

  async sendSms(input: SendSmsInput): Promise<SmsMessage> {
    const message = await this.client.messages.create({
      to: input.to,
      from: input.from ?? this.fromNumber,
      body: input.body,
    });

    return {
      id: message.sid,
      to: message.to ?? input.to,
      from: message.from ?? input.from ?? this.fromNumber ?? '',
      body: message.body ?? input.body,
      status: mapStatus(message.status),
      sentAt: message.dateCreated ? new Date(message.dateCreated) : undefined,
      deliveredAt: message.dateDelivered
        ? new Date(message.dateDelivered)
        : undefined,
      price: message.price ? Number(message.price) : undefined,
      priceCurrency: message.priceUnit ?? undefined,
      errorCode: message.errorCode ? String(message.errorCode) : undefined,
      errorMessage: message.errorMessage ?? undefined,
    };
  }

  async getDeliveryStatus(messageId: string): Promise<SmsDeliveryStatus> {
    const message = await this.client.messages(messageId).fetch();
    return {
      status: mapStatus(message.status),
      errorCode: message.errorCode ? String(message.errorCode) : undefined,
      errorMessage: message.errorMessage ?? undefined,
      updatedAt: message.dateUpdated
        ? new Date(message.dateUpdated)
        : new Date(),
    };
  }
}

function mapStatus(
  status: string | null
): SmsMessage['status'] {
  switch (status) {
    case 'queued':
    case 'accepted':
    case 'scheduled':
      return 'queued';
    case 'sending':
    case 'processing':
      return 'sending';
    case 'sent':
      return 'sent';
    case 'delivered':
      return 'delivered';
    case 'undelivered':
      return 'undelivered';
    case 'failed':
    case 'canceled':
      return 'failed';
    default:
      return 'queued';
  }
}


