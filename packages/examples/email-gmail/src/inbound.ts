import { GmailInboundProvider } from '@contractspec/integration.providers-impls/impls/gmail-inbound';
import type {
  EmailMessage,
  EmailThread,
} from '@contractspec/integration.providers-impls/email';
import { createGmailAuthFromEnv } from './auth';

export interface GmailInboundSnapshot {
  threads: EmailThread[];
  messages: EmailMessage[];
}

export async function fetchGmailInboundSnapshot(): Promise<GmailInboundSnapshot> {
  const provider = createGmailInboundProvider();
  const threads = await provider.listThreads({
    pageSize: 5,
    label: process.env.GMAIL_INBOUND_LABEL,
  });
  const sinceMinutes = Number(process.env.GMAIL_SINCE_MINUTES ?? '180');
  const since = new Date(Date.now() - sinceMinutes * 60 * 1000);
  const recent = await provider.listMessagesSince({
    since,
    pageSize: 5,
    label: process.env.GMAIL_INBOUND_LABEL,
  });
  return { threads, messages: recent.messages };
}

export function createGmailInboundProvider(): GmailInboundProvider {
  const auth = createGmailAuthFromEnv();
  const userId = process.env.GMAIL_USER_ID;
  const includeSpamTrash = process.env.GMAIL_INCLUDE_SPAM_TRASH === 'true';
  return new GmailInboundProvider({ auth, userId, includeSpamTrash });
}
