import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Knowledge Spaces: ContractSpec Docs',
//   description:
//     'Learn about KnowledgeSpaceSpec and how to define logical knowledge domains in ContractSpec.',
// };

export default function KnowledgeSpacesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Knowledge Spaces</h1>
        <p className="text-muted-foreground">
          A <strong>KnowledgeSpaceSpec</strong> defines a logical domain of
          knowledge with a specific category, storage strategy, and intended
          audience. Spaces are defined globally and populated per-tenant through
          knowledge sources.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">KnowledgeSpaceSpec</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`type KnowledgeSpaceSpec = {
  id: string;
  label: string;
  description: string;
  
  // Trust and access
  category: KnowledgeCategory;
  intendedAudience: "agents" | "humans" | "admin-only";
  
  // Storage and indexing
  storageStrategy: "vector" | "search" | "hybrid";
  indexProvider: string;  // e.g., "qdrant", "elasticsearch"
  vectorDimensions?: number;  // For vector storage
  
  // Lifecycle
  retentionPolicy: {
    days?: number;
    versions?: number;
  };
  
  // Metadata
  tags?: string[];
  owner?: string;
  createdAt: string;
  updatedAt: string;
};`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Common knowledge spaces</h2>
        <div className="space-y-6">
          <div className="card-subtle p-4">
            <h3 className="mb-2 text-lg font-semibold">Product Canon</h3>
            <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded border p-3 font-mono text-xs">
              <pre>{`{
  id: "product-canon",
  label: "Product Canon",
  description: "Official product specifications and schemas",
  category: "canonical",
  intendedAudience: "agents",
  storageStrategy: "hybrid",
  indexProvider: "qdrant",
  vectorDimensions: 1536,
  retentionPolicy: { versions: 10 }
}`}</pre>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              <strong>Use cases:</strong> Invoice generation, quote creation,
              product recommendations, schema validation
            </p>
          </div>

          <div className="card-subtle p-4">
            <h3 className="mb-2 text-lg font-semibold">Support History</h3>
            <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded border p-3 font-mono text-xs">
              <pre>{`{
  id: "support-history",
  label: "Support History",
  description: "Past support tickets and resolutions",
  category: "operational",
  intendedAudience: "agents",
  storageStrategy: "vector",
  indexProvider: "qdrant",
  vectorDimensions: 1536,
  retentionPolicy: { days: 365 }
}`}</pre>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              <strong>Use cases:</strong> Customer support, troubleshooting,
              similar issue detection
            </p>
          </div>

          <div className="card-subtle p-4">
            <h3 className="mb-2 text-lg font-semibold">
              External Provider Docs
            </h3>
            <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded border p-3 font-mono text-xs">
              <pre>{`{
  id: "provider-docs",
  label: "External Provider Docs",
  description: "Third-party integration documentation",
  category: "external",
  intendedAudience: "agents",
  storageStrategy: "search",
  indexProvider: "elasticsearch",
  retentionPolicy: { days: 90 }
}`}</pre>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              <strong>Use cases:</strong> Integration help, API reference,
              troubleshooting external services
            </p>
          </div>

          <div className="card-subtle p-4">
            <h3 className="mb-2 text-lg font-semibold">Agent Scratchpad</h3>
            <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded border p-3 font-mono text-xs">
              <pre>{`{
  id: "agent-scratchpad",
  label: "Agent Scratchpad",
  description: "Temporary agent working memory",
  category: "ephemeral",
  intendedAudience: "agents",
  storageStrategy: "vector",
  indexProvider: "qdrant",
  vectorDimensions: 1536,
  retentionPolicy: { days: 1 }
}`}</pre>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              <strong>Use cases:</strong> Conversation continuity, intermediate
              calculations, session state
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Storage strategies</h2>
        <div className="border-border/50 overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/50">
              <tr className="border-border/50 border-b">
                <th className="px-4 py-3 font-semibold">Strategy</th>
                <th className="px-4 py-3 font-semibold">Best For</th>
                <th className="px-4 py-3 font-semibold">Providers</th>
              </tr>
            </thead>
            <tbody className="divide-border/50 divide-y">
              <tr>
                <td className="px-4 py-3 font-mono text-xs">vector</td>
                <td className="px-4 py-3">
                  Semantic search, RAG, similarity matching
                </td>
                <td className="px-4 py-3">Qdrant, Pinecone, Weaviate</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">search</td>
                <td className="px-4 py-3">
                  Keyword search, exact matching, filtering
                </td>
                <td className="px-4 py-3">Elasticsearch, Algolia</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">hybrid</td>
                <td className="px-4 py-3">
                  Combined semantic + keyword search
                </td>
                <td className="px-4 py-3">Qdrant + Elasticsearch</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Choose storage strategy based on query patterns - use vector for
            semantic, search for exact
          </li>
          <li>
            Set appropriate retention policies - canonical is permanent,
            ephemeral is short-lived
          </li>
          <li>
            Use consistent vector dimensions across spaces that will be queried
            together
          </li>
          <li>Document the intended audience and use cases for each space</li>
          <li>
            Monitor space size and query performance - add sharding if needed
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/knowledge/categories" className="btn-ghost">
          Previous: Categories
        </Link>
        <Link href="/docs/knowledge/sources" className="btn-primary">
          Knowledge Sources <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
