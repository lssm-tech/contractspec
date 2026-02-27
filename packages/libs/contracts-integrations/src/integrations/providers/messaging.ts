export type MessagingDeliveryStatus =
  | 'queued'
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'failed';

export interface MessagingSendInput {
  recipientId?: string;
  channelId?: string;
  threadId?: string;
  text: string;
  markdown?: boolean;
  metadata?: Record<string, string>;
}

export interface MessagingSendResult {
  id: string;
  providerMessageId?: string;
  status: MessagingDeliveryStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  errorCode?: string;
  errorMessage?: string;
  metadata?: Record<string, string>;
}

export interface MessagingUpdateInput {
  channelId?: string;
  threadId?: string;
  text: string;
  markdown?: boolean;
  metadata?: Record<string, string>;
}

export interface MessagingProvider {
  sendMessage(input: MessagingSendInput): Promise<MessagingSendResult>;
  updateMessage?(
    messageId: string,
    input: MessagingUpdateInput
  ): Promise<MessagingSendResult>;
}
