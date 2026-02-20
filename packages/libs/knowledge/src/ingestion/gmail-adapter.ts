import type {
  EmailInboundProvider,
  EmailThread,
} from '@contractspec/lib.contracts-integrations';
import type { DocumentProcessor, RawDocument } from './document-processor';
import type { EmbeddingService } from './embedding-service';
import type { VectorIndexer } from './vector-indexer';
import { getDefaultI18n, createKnowledgeI18n } from '../i18n/messages';
import type { KnowledgeI18n } from '../i18n/messages';

export class GmailIngestionAdapter {
  private readonly i18n: KnowledgeI18n;

  constructor(
    private readonly gmail: EmailInboundProvider,
    private readonly processor: DocumentProcessor,
    private readonly embeddings: EmbeddingService,
    private readonly indexer: VectorIndexer,
    locale?: string
  ) {
    this.i18n = locale ? createKnowledgeI18n(locale) : getDefaultI18n();
  }

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
    const content = composeThreadText(thread, this.i18n);
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

function composeThreadText(thread: EmailThread, i18n: KnowledgeI18n): string {
  const header = [
    i18n.t('ingestion.gmail.subject', { subject: thread.subject ?? '' }),
    i18n.t('ingestion.gmail.snippet', { snippet: thread.snippet ?? '' }),
  ];
  const messageTexts = thread.messages.map((message) => {
    const parts = [
      i18n.t('ingestion.gmail.from', { from: formatAddress(message.from) }),
      i18n.t('ingestion.gmail.to', {
        to: message.to.map(formatAddress).join(', '),
      }),
    ];
    if (message.sentAt) {
      parts.push(
        i18n.t('ingestion.gmail.date', {
          date: message.sentAt.toISOString(),
        })
      );
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
