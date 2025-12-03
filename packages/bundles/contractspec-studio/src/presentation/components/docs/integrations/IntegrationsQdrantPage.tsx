import Link from '@lssm/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Qdrant Integration: ContractSpec Docs',
//   description:
//     'Build semantic search and RAG applications with Qdrant vector database in ContractSpec.',
// };

export function IntegrationsQdrantPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Qdrant</h1>
        <p className="text-muted-foreground">
          Qdrant is a high-performance vector database for semantic search,
          recommendations, and RAG (Retrieval-Augmented Generation)
          applications.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Setup</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`# .env
QDRANT_URL=https://...
QDRANT_API_KEY=...
QDRANT_COLLECTION=documents`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Storing vectors</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`capabilityId: qdrant-upsert
provider:
  type: qdrant
  operation: upsert

inputs:
  collection:
    type: string
  points:
    type: array
    items:
      type: object
      properties:
        id: string
        vector: array
        payload: object

outputs:
  status:
    type: string`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Semantic search</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`capabilityId: qdrant-search
provider:
  type: qdrant
  operation: search

inputs:
  collection:
    type: string
  vector:
    type: array
    items:
      type: number
  limit:
    type: number
    default: 10

outputs:
  results:
    type: array
    items:
      type: object
      properties:
        id: string
        score: number
        payload: object`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">RAG workflow example</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`workflowId: rag-query
version: 1.0.0

steps:
  - id: generate-embedding
    capability: openai-embeddings
    inputs:
      text: \$\{input.query\}

  - id: search-documents
    capability: qdrant-search
    inputs:
      collection: "documents"
      vector: \$\{steps.generate-embedding.output.embedding\}
      limit: 5

  - id: generate-answer
    capability: openai-chat
    inputs:
      messages:
        - role: "system"
          content: "Answer based on the context provided"
        - role: "user"
          content: |
            Context: \$\{steps.search-documents.output.results\}
            Question: \$\{input.query\}`}</pre>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/integrations/elevenlabs" className="btn-ghost">
          Previous: ElevenLabs
        </Link>
        <Link href="/docs/integrations/s3" className="btn-primary">
          Next: S3 Storage <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
