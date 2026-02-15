export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailAttachment {
  id: string;
  filename: string;
  contentType: string;
  sizeBytes?: number;
  data?: Uint8Array;
  downloadUrl?: string;
}

export interface EmailOutboundMessage {
  from: EmailAddress;
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  replyTo?: EmailAddress;
  subject: string;
  textBody?: string;
  htmlBody?: string;
  headers?: Record<string, string>;
  attachments?: EmailAttachment[];
  metadata?: Record<string, string>;
}

export interface EmailOutboundResult {
  id: string;
  providerMessageId?: string;
  queuedAt?: Date;
  deliveredAt?: Date;
}

export interface EmailThread {
  id: string;
  subject?: string;
  snippet?: string;
  participants: EmailAddress[];
  messages: EmailMessage[];
  updatedAt: Date;
  labels?: string[];
  metadata?: Record<string, string>;
}

export interface EmailMessage {
  id: string;
  threadId: string;
  subject?: string;
  from: EmailAddress;
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  replyTo?: EmailAddress;
  sentAt: Date;
  receivedAt?: Date;
  textBody?: string;
  htmlBody?: string;
  attachments?: EmailAttachment[];
  headers?: Record<string, string>;
  metadata?: Record<string, string>;
}

export interface EmailThreadListQuery {
  label?: string;
  query?: string;
  pageSize?: number;
  pageToken?: string;
  includeArchived?: boolean;
  updatedSince?: Date;
}

export interface EmailMessagesSinceQuery {
  label?: string;
  since?: Date;
  pageSize?: number;
  pageToken?: string;
}

export interface EmailOutboundProvider {
  sendEmail(message: EmailOutboundMessage): Promise<EmailOutboundResult>;
}

export interface EmailInboundProvider {
  listThreads(query?: EmailThreadListQuery): Promise<EmailThread[]>;
  getThread(threadId: string): Promise<EmailThread | null>;
  listMessagesSince(
    query: EmailMessagesSinceQuery
  ): Promise<{ messages: EmailMessage[]; nextPageToken?: string }>;
}
