# @lssm/lib.knowledge

Knowledge retrieval and management library for ContractSpec. Provides the runtime implementation for knowledge spaces, including:

- **Retriever Interface**: Unified interface for knowledge retrieval (vector, static, hybrid)
- **Query Service**: RAG-powered question answering over knowledge spaces
- **Ingestion Pipeline**: Document processing, embedding, and vector indexing
- **Access Guard**: Policy-based access control for knowledge spaces

## Installation

```bash
bun add @lssm/lib.knowledge
```

## Usage

### Basic Retriever

```typescript
import { createVectorRetriever } from '@lssm/lib.knowledge/retriever';

const retriever = createVectorRetriever({
  embeddings: embeddingProvider,
  vectorStore: vectorStoreProvider,
});

const results = await retriever.retrieve('How do I reset my password?', {
  spaceKey: 'support-faq',
  topK: 5,
});
```

### Static Knowledge

```typescript
import { createStaticRetriever } from '@lssm/lib.knowledge/retriever';

const retriever = createStaticRetriever({
  'product-canon': 'Product specifications and documentation...',
  'support-faq': 'Frequently asked questions...',
});

const content = await retriever.getStatic('product-canon');
```

## Architecture

This package bridges `@lssm/lib.contracts` (specs/types) with `@lssm/lib.ai-agent` (AI SDK integration):

```
@lssm/lib.contracts (specs/types)
         ↓
@lssm/lib.knowledge (runtime)
         ↓
@lssm/lib.ai-agent (AI SDK)
```

## License

MIT













