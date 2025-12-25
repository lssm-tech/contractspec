import type { EmailInboundProvider, EmailThread } from '@lssm/lib.contracts';
import type { DocumentProcessor, RawDocument } from './document-processor';
import type { EmbeddingService } from './embedding-service';
import type { VectorIndexer } from './vector-indexer';

export class GmailIngestionAdapter {
  constructor(
    private readonly gmail: EmailInboundProvider,
    private readonly processor: DocumentProcessor,
    private readonly embeddings: EmbeddingService,
    private readonly indexer: VectorIndexer
  ) {}

  async syncThreads(
    query?: Parameters<EmailInboundProvider['listThreads']>[0]
  ) {
    const threads = await this.gmail.listThreads(query);
    for (const thread of threads) {
      await this.ingestThread(thread);
    }
  }

  async ingestThread(thread: EmailThread) {
    const document = this.toRawDocument(thread);
    const fragments = await this.processor.process(document);
    const embeddings = await this.embeddings.embedFragments(fragments);
    await this.indexer.upsert(fragments, embeddings);
  }

  private toRawDocument(thread: EmailThread): RawDocument {
    const content = composeThreadText(thread);
    return {
      id: thread.id,
      mimeType: 'text/plain',
      data: Buffer.from(content, 'utf-8'),
      metadata: {
        subject: thread.subject ?? '',
        participants: thread.participants.map((p) => p.email).join(', '),
        updatedAt: thread.updatedAt.toISOString(),
      },
    };
  }
}

function composeThreadText(thread: EmailThread): string {
  const header = [
    `Subject: ${thread.subject ?? ''}`,
    `Snippet: ${thread.snippet ?? ''}`,
  ];
  const messageTexts = thread.messages.map((message) => {
    const parts = [
      `From: ${formatAddress(message.from)}`,
      `To: ${message.to.map(formatAddress).join(', ')}`,
    ];
    if (message.sentAt) {
      parts.push(`Date: ${message.sentAt.toISOString()}`);
    }
    const body = message.textBody ?? stripHtml(message.htmlBody ?? '');
    return `${parts.join('\n')}\n\n${body ?? ''}`;
  });
  return [...header, ...messageTexts].join('\n\n---\n\n');
}

function formatAddress(address: { email: string; name?: string }): string {
  return address.name ? `${address.name} <${address.email}>` : address.email;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ');
}
