import { GmailOutboundProvider } from '@contractspec/integration.providers-impls/impls/gmail-outbound';
import type {
  EmailOutboundMessage,
  EmailOutboundResult,
} from '@contractspec/integration.providers-impls/email';
import { createGmailAuthFromEnv } from './auth';

export async function sendGmailOutboundSample(): Promise<EmailOutboundResult> {
  const provider = createGmailOutboundProvider();
  const message = buildSampleOutboundMessage();
  return provider.sendEmail(message);
}

export function buildSampleOutboundMessage(): EmailOutboundMessage {
  const fromEmail = requireEnv('GMAIL_FROM_EMAIL');
  const toEmail = requireEnv('GMAIL_TO_EMAIL');
  return {
    from: { email: fromEmail, name: process.env.GMAIL_FROM_NAME },
    to: [{ email: toEmail, name: process.env.GMAIL_TO_NAME }],
    subject: 'ContractSpec Gmail provider test',
    textBody:
      'This is a sample outbound email sent from the ContractSpec Gmail provider example.',
  };
}

export function createGmailOutboundProvider(): GmailOutboundProvider {
  const auth = createGmailAuthFromEnv();
  const userId = process.env.GMAIL_USER_ID;
  return new GmailOutboundProvider({ auth, userId });
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}
