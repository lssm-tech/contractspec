# @contractspec/lib.knowledge

Website: https://contractspec.io/


Knowledge retrieval and management library for ContractSpec. Provides the runtime implementation for knowledge spaces, including:

- **Retriever Interface**: Unified interface for knowledge retrieval (vector, static, hybrid)
- **Query Service**: RAG-powered question answering over knowledge spaces
- **Ingestion Pipeline**: Document processing, embedding, and vector indexing
- **Access Guard**: Policy-based access control for knowledge spaces

## Installation

```bash
bun add @contractspec/lib.knowledge
```

## Usage

### Basic Retriever

```typescript
import { createVectorRetriever } from '@contractspec/lib.knowledge/retriever';

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
import { createStaticRetriever } from '@contractspec/lib.knowledge/retriever';

const retriever = createStaticRetriever({
  'product-canon': 'Product specifications and documentation...',
  'support-faq': 'Frequently asked questions...',
});

const content = await retriever.getStatic('product-canon');
```

## Architecture

This package bridges `@contractspec/lib.contracts-spec` (specs/types) with `@contractspec/lib.ai-agent` (AI SDK integration):

```
@contractspec/lib.contracts-spec (specs/types)
         ↓
@contractspec/lib.knowledge (runtime)
         ↓
@contractspec/lib.ai-agent (AI SDK)
```

## License

MIT















