import { google, type gmail_v1 } from 'googleapis';

import type {
  EmailAttachment,
  EmailOutboundMessage,
  EmailOutboundProvider,
  EmailOutboundResult,
} from '../email';

export interface GmailOutboundProviderOptions {
  auth: gmail_v1.Options['auth'];
  userId?: string;
  gmail?: gmail_v1.Gmail;
}

export class GmailOutboundProvider implements EmailOutboundProvider {
  private readonly gmail: gmail_v1.Gmail;
  private readonly userId: string;
  private readonly auth: gmail_v1.Options['auth'];

  constructor(options: GmailOutboundProviderOptions) {
    this.auth = options.auth;
    this.gmail =
      options.gmail ??
      google.gmail({
        version: 'v1',
        auth: options.auth,
      });
    this.userId = options.userId ?? 'me';
  }

  async sendEmail(message: EmailOutboundMessage): Promise<EmailOutboundResult> {
    const raw = encodeMessage(message);
    const response = await this.gmail.users.messages.send({
      userId: this.userId,
      requestBody: {
        raw,
      },
      auth: this.auth,
    });

    const id = response.data.id ?? '';
    return {
      id,
      providerMessageId: response.data.id ?? undefined,
      queuedAt: new Date(),
    };
  }
}

function encodeMessage(message: EmailOutboundMessage): string {
  const headers: string[] = [
    `From: ${formatAddress(message.from)}`,
    `To: ${message.to.map(formatAddress).join(', ')}`,
    `Subject: ${message.subject}`,
    'MIME-Version: 1.0',
  ];
  if (message.cc?.length) {
    headers.push(`Cc: ${message.cc.map(formatAddress).join(', ')}`);
  }
  if (message.replyTo) {
    headers.push(`Reply-To: ${formatAddress(message.replyTo)}`);
  }
  Object.entries(message.headers ?? {}).forEach(([key, value]) => {
    headers.push(`${key}: ${value}`);
  });

  const attachments = message.attachments ?? [];
  const hasHtml = Boolean(message.htmlBody);
  const hasText = Boolean(message.textBody);
  const boundaryMain = `mixed_${Date.now()}`;
  const boundaryAlt = `alt_${Date.now()}`;

  let body = '';
  if (attachments.length > 0) {
    headers.push(`Content-Type: multipart/mixed; boundary="${boundaryMain}"`);
    body += `\r\n--${boundaryMain}\r\n`;
    body += buildAlternativePart(hasText, hasHtml, boundaryAlt, message);
    attachments.forEach((attachment) => {
      body += buildAttachmentPart(boundaryMain, attachment);
    });
    body += `\r\n--${boundaryMain}--`;
  } else if (hasText && hasHtml) {
    headers.push(
      `Content-Type: multipart/alternative; boundary="${boundaryAlt}"`
    );
    body += `\r\n--${boundaryAlt}\r\n`;
    body += buildTextPart('text/plain; charset="utf-8"', message.textBody!);
    body += `\r\n--${boundaryAlt}\r\n`;
    body += buildTextPart('text/html; charset="utf-8"', message.htmlBody!);
    body += `\r\n--${boundaryAlt}--`;
  } else if (hasHtml) {
    headers.push('Content-Type: text/html; charset="utf-8"');
    body += `\r\n\r\n${message.htmlBody}`;
  } else {
    headers.push('Content-Type: text/plain; charset="utf-8"');
    body += `\r\n\r\n${message.textBody ?? ''}`;
  }

  const mime = `${headers.join('\r\n')}${body}`;
  return Buffer.from(mime)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function buildAlternativePart(
  hasText: boolean,
  hasHtml: boolean,
  boundary: string,
  message: EmailOutboundMessage
) {
  let content = '';
  content += `Content-Type: multipart/alternative; boundary="${boundary}"\r\n`;
  content += '\r\n';
  if (hasText) {
    content += `--${boundary}\r\n`;
    content += buildTextPart('text/plain; charset="utf-8"', message.textBody!);
  }
  if (hasHtml) {
    content += `\r\n--${boundary}\r\n`;
    content += buildTextPart('text/html; charset="utf-8"', message.htmlBody!);
  }
  content += `\r\n--${boundary}--`;
  return content;
}

function buildTextPart(contentType: string, content: string) {
  return (
    `Content-Type: ${contentType}\r\n` +
    'Content-Transfer-Encoding: 7bit\r\n\r\n' +
    content
  );
}

function buildAttachmentPart(
  boundary: string,
  attachment: EmailAttachment
): string {
  const data = attachment.data ?? new Uint8Array();
  const encoded =
    data.byteLength > 0 ? Buffer.from(data).toString('base64') : '';
  return (
    `\r\n--${boundary}\r\n` +
    `Content-Type: ${attachment.contentType}; name="${attachment.filename}"\r\n` +
    'Content-Transfer-Encoding: base64\r\n' +
    `Content-Disposition: attachment; filename="${attachment.filename}"\r\n\r\n` +
    encoded
  );
}

function formatAddress(address: { email: string; name?: string }) {
  if (address.name) {
    return `"${address.name}" <${address.email}>`;
  }
  return address.email;
}
