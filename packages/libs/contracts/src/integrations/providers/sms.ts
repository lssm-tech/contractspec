export interface SmsMessage {
  id: string;
  to: string;
  from: string;
  body: string;
  status:
    | 'queued'
    | 'sending'
    | 'sent'
    | 'delivered'
    | 'undelivered'
    | 'failed';
  providerMessageId?: string;
  carrier?: string;
  price?: number;
  priceCurrency?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  errorCode?: string;
  errorMessage?: string;
}

export interface SendSmsInput {
  to: string;
  from?: string;
  body: string;
  metadata?: Record<string, string>;
}

export interface SmsDeliveryStatus {
  status: SmsMessage['status'];
  errorCode?: string;
  errorMessage?: string;
  updatedAt: Date;
}

export interface SmsProvider {
  sendSms(input: SendSmsInput): Promise<SmsMessage>;
  getDeliveryStatus(messageId: string): Promise<SmsDeliveryStatus>;
}


