import type { Region } from '@scaleway/sdk-client';

export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailServiceConfig {
  accessKey: string;
  secretKey: string;
  projectId: string;
  region: Region;
  defaultZone: string;
  from: EmailAddress;
  teamInbox: EmailAddress;
}

export interface EmailConfigResult {
  ok: boolean;
  config?: EmailServiceConfig;
  errorMessage?: string;
}

export interface SendEmailRequest {
  to: EmailAddress[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  context?: string;
}

export interface EmailSendOutcome {
  success: boolean;
  error?: unknown;
  errorMessage?: string;
}
