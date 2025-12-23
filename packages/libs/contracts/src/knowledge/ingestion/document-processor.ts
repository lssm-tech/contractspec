import { Buffer } from 'node:buffer';

export interface RawDocument {
  id: string;
  mimeType: string;
  data: Uint8Array;
  metadata?: Record<string, string>;
}

export interface DocumentFragment {
  id: string;
  documentId: string;
  text: string;
  metadata?: Record<string, string>;
}

type Extractor = (input: RawDocument) => Promise<DocumentFragment[]>;

export class DocumentProcessor {
  private readonly extractors = new Map<string, Extractor>();

  constructor() {
    this.registerExtractor('text/plain', this.extractText);
    this.registerExtractor('application/json', this.extractJson);
  }

  registerExtractor(mimeType: string, extractor: Extractor): void {
    this.extractors.set(mimeType.toLowerCase(), extractor);
  }

  async process(document: RawDocument): Promise<DocumentFragment[]> {
    const extractor =
      this.extractors.get(document.mimeType.toLowerCase()) ??
      this.extractors.get('*/*');
    if (!extractor) {
      throw new Error(
        `No extractor registered for mime type ${document.mimeType}`
      );
    }
    const fragments = await extractor(document);
    if (fragments.length === 0) {
      return [
        {
          id: `${document.id}:0`,
          documentId: document.id,
          text: '',
          metadata: document.metadata,
        },
      ];
    }
    return fragments;
  }

  private async extractText(
    document: RawDocument
  ): Promise<DocumentFragment[]> {
    const text = Buffer.from(document.data).toString('utf-8');
    return [
      {
        id: `${document.id}:0`,
        documentId: document.id,
        text,
        metadata: document.metadata,
      },
    ];
  }

  private async extractJson(
    document: RawDocument
  ): Promise<DocumentFragment[]> {
    const text = Buffer.from(document.data).toString('utf-8');
    try {
      const json = JSON.parse(text);
      return [
        {
          id: `${document.id}:0`,
          documentId: document.id,
          text: JSON.stringify(json, null, 2),
          metadata: {
            ...document.metadata,
            contentType: 'application/json',
          },
        },
      ];
    } catch {
      return this.extractText(document);
    }
  }
}
