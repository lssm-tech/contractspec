import { google, type gmail_v1 } from 'googleapis';

import type {
  EmailInboundProvider,
  EmailMessagesSinceQuery,
  EmailMessage,
  EmailThread,
  EmailThreadListQuery,
} from '../email';

export interface GmailInboundProviderOptions {
  auth: gmail_v1.Options['auth'];
  userId?: string;
  gmail?: gmail_v1.Gmail;
  includeSpamTrash?: boolean;
}

export class GmailInboundProvider implements EmailInboundProvider {
  private readonly gmail: gmail_v1.Gmail;
  private readonly userId: string;
  private readonly includeSpamTrash: boolean;
  private readonly auth: gmail_v1.Options['auth'];

  constructor(options: GmailInboundProviderOptions) {
    this.auth = options.auth;
    this.gmail =
      options.gmail ??
      google.gmail({
        version: 'v1',
        auth: options.auth,
      });
    this.userId = options.userId ?? 'me';
    this.includeSpamTrash = options.includeSpamTrash ?? false;
  }

  async listThreads(query?: EmailThreadListQuery): Promise<EmailThread[]> {
    const response = await this.gmail.users.threads.list({
      userId: this.userId,
      maxResults: query?.pageSize,
      pageToken: query?.pageToken,
      q: query?.query,
      labelIds: query?.label ? [query.label] : undefined,
      includeSpamTrash: this.includeSpamTrash,
      auth: this.auth,
    });

    const threads = await Promise.all(
      (response.data.threads ?? []).map(async (thread) => {
        if (!thread.id) return null;
        return this.getThread(thread.id);
      })
    );

    return threads.filter((thread): thread is EmailThread => thread !== null);
  }

  async getThread(threadId: string): Promise<EmailThread | null> {
    const response = await this.gmail.users.threads.get({
      id: threadId,
      userId: this.userId,
      format: 'full',
      auth: this.auth,
    });
    const thread = response.data;
    if (!thread) return null;

    const messages =
      thread.messages?.map((message) => this.transformMessage(message)) ?? [];

    const participants = dedupeAddresses(
      messages.flatMap((message) => [
        message.from,
        ...message.to,
        ...(message.cc ?? []),
      ])
    );

    const firstMessage = messages[0];
    const lastMessage = messages[messages.length - 1];
    const updatedAt =
      lastMessage?.receivedAt ??
      lastMessage?.sentAt ??
      firstMessage?.receivedAt ??
      firstMessage?.sentAt ??
      new Date();

    const labels = Array.from(
      new Set(
        messages
          .flatMap((message) => {
            const labelField = message.metadata?.labelIds;
            if (!labelField) return [];
            return labelField.split(',').map((label) => label.trim());
          })
          .filter((label): label is string => Boolean(label))
      )
    );

    return {
      id: thread.id ?? threadId,
      subject: messages[0]?.subject,
      snippet: thread.snippet ?? '',
      participants,
      messages,
      updatedAt,
      labels,
      metadata: thread.historyId ? { historyId: thread.historyId } : undefined,
    };
  }

  async listMessagesSince(query: EmailMessagesSinceQuery) {
    const after = query.since
      ? Math.floor(query.since.getTime() / 1000)
      : undefined;
    const q: string[] = [];
    if (after) {
      q.push(`after:${after}`);
    }
    const response = await this.gmail.users.messages.list({
      userId: this.userId,
      maxResults: query.pageSize,
      pageToken: query.pageToken,
      labelIds: query.label ? [query.label] : undefined,
      q: q.join(' '),
      includeSpamTrash: this.includeSpamTrash,
      auth: this.auth,
    });

    const messages = await Promise.all(
      (response.data.messages ?? []).map(async (item) => {
        if (!item.id) return null;
        const full = await this.gmail.users.messages.get({
          userId: this.userId,
          id: item.id,
          format: 'full',
          auth: this.auth,
        });
        if (!full.data) return null;
        return this.transformMessage(full.data);
      })
    );

    return {
      messages: messages.filter(
        (message): message is EmailMessage => message !== null
      ),
      nextPageToken: response.data.nextPageToken ?? undefined,
    };
  }

  private transformMessage(message: gmail_v1.Schema$Message): EmailMessage {
    const headers = message.payload?.headers ?? [];
    const subject = headerValue(headers, 'Subject') ?? '';
    const from =
      parseAddress(headerValue(headers, 'From')) ??
      inferFallbackAddress('from', message.id);
    const to = parseAddressList(headerValue(headers, 'To'));
    const cc = parseAddressList(headerValue(headers, 'Cc'));
    const bcc = parseAddressList(headerValue(headers, 'Bcc'));
    const replyTo = parseAddress(headerValue(headers, 'Reply-To'));

    const { text, html, attachments } = extractContent(message.payload);
    const timestamp = message.internalDate
      ? new Date(Number(message.internalDate))
      : new Date();

    const metadata: Record<string, string> = {
      ...(message.labelIds?.length
        ? { labelIds: message.labelIds.join(',') }
        : {}),
      ...(message.historyId ? { historyId: message.historyId } : {}),
    };

    return {
      id: message.id ?? '',
      threadId: message.threadId ?? '',
      subject,
      from,
      to,
      cc,
      bcc,
      replyTo: replyTo ?? undefined,
      sentAt: timestamp,
      receivedAt: timestamp,
      textBody: text ?? undefined,
      htmlBody: html ?? undefined,
      attachments,
      headers: Object.fromEntries(
        headers.map((header) => [header.name ?? '', header.value ?? ''])
      ),
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    };
  }
}

function headerValue(
  headers: gmail_v1.Schema$MessagePartHeader[],
  name: string
): string | undefined {
  const header = headers.find(
    (candidate) => candidate.name?.toLowerCase() === name.toLowerCase()
  );
  const value = header?.value;
  return typeof value === 'string' ? value : undefined;
}

function parseAddress(
  header?: string
): { email: string; name?: string } | null {
  const addresses = parseAddressList(header);
  if (addresses.length === 0) {
    return null;
  }
  return addresses[0] ?? null;
}

function inferFallbackAddress(
  field: string,
  messageId?: string | null
): { email: string; name?: string } {
  const suffix = messageId
    ? messageId.replace(/[^\w]/g, '').slice(-8) || 'unknown'
    : 'unknown';
  return {
    email: `${field}-${suffix}@mail.local`,
  };
}

function parseAddressList(header?: string): { email: string; name?: string }[] {
  if (!header) return [];
  return header
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((value) => {
      const match = value.match(/^(?:"?([^"]*)"?\s)?<?([^<>]+)>?$/);
      if (!match) {
        return { email: value };
      }
      const name = match[1]?.trim();
      const email = match[2]?.trim();
      if (!email) {
        return { email: value };
      }
      return name ? { email, name } : { email };
    });
}

function dedupeAddresses(
  addresses: (
    | ReturnType<typeof parseAddress>
    | { email: string; name?: string }
  )[]
) {
  const map = new Map<string, { email: string; name?: string }>();
  for (const address of addresses) {
    if (!address) continue;
    map.set(address.email.toLowerCase(), address);
  }
  return Array.from(map.values());
}

function extractContent(payload?: gmail_v1.Schema$MessagePart): {
  text?: string;
  html?: string;
  attachments: EmailMessage['attachments'];
} {
  if (!payload) {
    return { attachments: [] };
  }
  const attachments: NonNullable<EmailMessage['attachments']> = [];
  const visit = (
    part?: gmail_v1.Schema$MessagePart
  ): {
    text?: string;
    html?: string;
  } => {
    if (!part) return {};
    if (part.filename && part.body?.attachmentId) {
      attachments.push({
        id: part.body.attachmentId,
        filename: part.filename,
        contentType: part.mimeType ?? 'application/octet-stream',
        sizeBytes: part.body.size ?? undefined,
      });
    }
    const mimeType = part.mimeType ?? '';
    const data = part.body?.data;
    if (mimeType === 'text/plain' && data) {
      return { text: decodeBase64Url(data) };
    }
    if (mimeType === 'text/html' && data) {
      return { html: decodeBase64Url(data) };
    }
    if (part.parts?.length) {
      return part.parts.reduce<{ text?: string; html?: string }>(
        (acc, nested) => {
          const value = visit(nested);
          return {
            text: value.text ?? acc.text,
            html: value.html ?? acc.html,
          };
        },
        {}
      );
    }
    return {};
  };

  const { text, html } = visit(payload);
  return { text, html, attachments };
}

function decodeBase64Url(data: string): string {
  const normalized = data.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4;
  const padded =
    padding === 0 ? normalized : normalized + '='.repeat(4 - padding);
  return Buffer.from(padded, 'base64').toString('utf-8');
}
