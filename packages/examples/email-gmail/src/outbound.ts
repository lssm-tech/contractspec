import { google } from 'googleapis';
import { GmailOutboundProvider } from '@contractspec/integration.providers-impls/impls/gmail-outbound';
import type {
  EmailOutboundMessage,
  EmailOutboundResult,
} from '@contractspec/integration.providers-impls/email';
import { createGmailAuthFromEnv } from './auth';

export async function sendGmailOutboundSample(): Promise<EmailOutboundResult> {
  const auth = createGmailAuthFromEnv();
  const provider = createGmailOutboundProvider(auth);
  const message = await buildSampleOutboundMessage(auth);
  return provider.sendEmail(message);
}

export async function buildSampleOutboundMessage(
  auth = createGmailAuthFromEnv()
): Promise<EmailOutboundMessage> {
  const profileEmail = await fetchProfileEmail(auth);
  const fromEmail = process.env.GMAIL_FROM_EMAIL ?? profileEmail;
  const toEmail = process.env.GMAIL_TO_EMAIL ?? profileEmail;
  if (!fromEmail || !toEmail) {
    throw new Error(
      'Missing required env var: GMAIL_FROM_EMAIL or GMAIL_TO_EMAIL (and unable to resolve Gmail profile).'
    );
  }
  return {
    from: {
      email: fromEmail,
      name: process.env.GMAIL_FROM_NAME ?? inferName(fromEmail),
    },
    to: [
      {
        email: toEmail,
        name: process.env.GMAIL_TO_NAME ?? inferName(toEmail),
      },
    ],
    subject: 'ContractSpec Gmail provider test',
    textBody:
      'This is a sample outbound email sent from the ContractSpec Gmail provider example.',
  };
}

export function createGmailOutboundProvider(
  auth = createGmailAuthFromEnv()
): GmailOutboundProvider {
  const userId = process.env.GMAIL_USER_ID;
  return new GmailOutboundProvider({ auth, userId });
}

async function fetchProfileEmail(
  auth: ReturnType<typeof createGmailAuthFromEnv>
): Promise<string | undefined> {
  const gmail = google.gmail({ version: 'v1', auth });
  const response = await gmail.users.getProfile({ userId: 'me', auth });
  return response.data.emailAddress ?? undefined;
}

function inferName(email: string): string {
  const local = email.split('@')[0] ?? '';
  if (!local) return 'Gmail User';
  return local
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase())
    .trim();
}
