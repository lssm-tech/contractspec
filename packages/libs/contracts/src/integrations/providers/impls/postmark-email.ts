import { ServerClient, type Models as PostmarkModels } from 'postmark';

import type {
  EmailOutboundMessage,
  EmailOutboundProvider,
  EmailOutboundResult,
} from '../email';

export interface PostmarkEmailProviderOptions {
  serverToken: string;
  defaultFromEmail?: string;
  messageStream?: string;
  client?: ServerClient;
}

export class PostmarkEmailProvider implements EmailOutboundProvider {
  private readonly client: ServerClient;
  private readonly defaultFromEmail?: string;
  private readonly messageStream?: string;

  constructor(options: PostmarkEmailProviderOptions) {
    this.client =
      options.client ??
      new ServerClient(options.serverToken, {
        useHttps: true,
      });
    this.defaultFromEmail = options.defaultFromEmail;
    this.messageStream = options.messageStream;
  }

  async sendEmail(message: EmailOutboundMessage): Promise<EmailOutboundResult> {
    const request: PostmarkModels.Message = {
      From: formatAddress(message.from) ?? this.defaultFromEmail,
      To: message.to.map((addr) => formatAddress(addr)).join(', '),
      Cc: message.cc?.map((addr) => formatAddress(addr)).join(', ') || undefined,
      Bcc:
        message.bcc?.map((addr) => formatAddress(addr)).join(', ') || undefined,
      ReplyTo: message.replyTo ? formatAddress(message.replyTo) : undefined,
      Subject: message.subject,
      TextBody: message.textBody,
      HtmlBody: message.htmlBody,
      Headers: message.headers
        ? Object.entries(message.headers).map(([name, value]) => ({
            Name: name,
            Value: value,
          }))
        : undefined,
      MessageStream: this.messageStream,
      Attachments: buildAttachments(message),
    };

    const response = await this.client.sendEmail(request);
    return {
      id: response.MessageID,
      providerMessageId: response.MessageID,
      queuedAt: new Date(response.SubmittedAt ?? new Date().toISOString()),
    };
  }
}

function formatAddress(address: { email: string; name?: string }): string {
  if (address.name) {
    return `"${address.name}" <${address.email}>`;
  }
  return address.email;
}

function buildAttachments(
  message: EmailOutboundMessage
): PostmarkModels.Attachment[] | undefined {
  if (!message.attachments?.length) return undefined;
  return message.attachments
    .filter((attachment) => attachment.data)
    .map((attachment) => ({
      Name: attachment.filename,
      Content: Buffer.from(attachment.data ?? new Uint8Array()).toString('base64'),
      ContentType: attachment.contentType,
      ContentID: null,
      ContentLength: attachment.sizeBytes,
      Disposition: 'attachment',
    }));
}


