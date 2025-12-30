/* eslint-disable @typescript-eslint/no-explicit-any -- Pragmatic use of any for test mocks */

import { beforeEach, describe, expect, it, vi } from 'bun:test';
import { prismaMock } from '../../__tests__/mocks/prisma';

const processMock = vi.fn();
const embedFragmentsMock = vi.fn();
const vectorUpsertMock = vi.fn();
const queryMock = vi.fn();

vi.mock('@contractspec/lib.knowledge/ingestion/document-processor', () => ({
  DocumentProcessor: class {
    process = processMock;
  },
}));

vi.mock('@contractspec/lib.knowledge/ingestion/embedding-service', () => ({
  EmbeddingService: class {
    embedFragments = embedFragmentsMock;
  },
}));

vi.mock('@contractspec/lib.knowledge/ingestion/vector-indexer', () => ({
  VectorIndexer: class {
    upsert = vectorUpsertMock;
  },
}));

vi.mock('@contractspec/lib.knowledge/query/service', () => ({
  KnowledgeQueryService: class {
    constructor(
      public readonly embeddings: unknown,
      public readonly vectorStore: unknown,
      public readonly llm: unknown,
      public readonly options: unknown
    ) {}

    query = queryMock;
  },
}));

import { StudioKnowledgeModule } from './index';

describe('StudioKnowledgeModule', () => {
  beforeEach(() => {
    processMock.mockReset();
    embedFragmentsMock.mockReset();
    vectorUpsertMock.mockReset();
    queryMock.mockReset();
  });

  const module = new StudioKnowledgeModule({
    embeddings: {} as any,
    vectorStore: {} as any,
    llm: {} as any,
    defaultCollection: 'studio',
  });

  it('throws when no documents are provided', async () => {
    await expect(
      module.indexSource({
        organizationId: 'org-1',
        type: 'DOCUMENTATION' as any,
        name: 'Docs',
        documents: [],
      })
    ).rejects.toThrow(/requires at least one document/);
  });

  it('indexes documents and persists the knowledge source', async () => {
    processMock.mockResolvedValue([{ id: 'doc-fragment', text: 'hello' }]);
    embedFragmentsMock.mockResolvedValue([{ vector: [0.1] }]);
    vectorUpsertMock.mockResolvedValue(undefined);
    prismaMock.knowledgeSource.create.mockResolvedValue({
      id: 'source-1',
    } as any);

    const source = await module.indexSource({
      organizationId: 'org-1',
      projectId: 'project-1',
      type: 'DOCUMENTATION' as any,
      name: 'Docs',
      documents: [{ id: 'doc-1' } as any],
    });

    expect(processMock).toHaveBeenCalled();
    expect(embedFragmentsMock).toHaveBeenCalled();
    expect(vectorUpsertMock).toHaveBeenCalled();
    expect(prismaMock.knowledgeSource.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        organizationId: 'org-1',
        projectId: 'project-1',
        indexed: true,
      }),
    });
    expect(source.id).toBe('source-1');
  });

  it('queries knowledge through the query service', async () => {
    queryMock.mockResolvedValue({ answer: '42', references: [] });

    const response = await module.queryKnowledge({
      question: 'What is the meaning of life?',
      collection: 'studio',
    });

    expect(queryMock).toHaveBeenCalledWith('What is the meaning of life?');
    expect(response).toEqual({ answer: '42', references: [] });
  });
});
