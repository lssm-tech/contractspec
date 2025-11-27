import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Knowledge & Context: ContractSpec Docs',
  description:
    'Learn how ContractSpec manages knowledge and context for AI agents, workflows, and decision-making.',
};

export default function KnowledgeOverviewPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Knowledge & Context</h1>
        <p className="text-muted-foreground">
          ContractSpec provides first-class support for knowledge management,
          enabling semantic search, RAG (Retrieval-Augmented Generation), and
          context-aware decision-making. Knowledge is organized into typed
          spaces with different trust levels and access controls.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Why knowledge matters</h2>
        <p className="text-muted-foreground">Modern applications need to:</p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Understand context</strong> - Access relevant information to
            make informed decisions
          </li>
          <li>
            <strong>Learn from history</strong> - Use past interactions to
            improve future responses
          </li>
          <li>
            <strong>Trust sources</strong> - Distinguish between authoritative
            and reference information
          </li>
          <li>
            <strong>Scale knowledge</strong> - Handle growing amounts of
            documentation and data
          </li>
          <li>
            <strong>Maintain privacy</strong> - Keep tenant knowledge isolated
            and secure
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Knowledge architecture</h2>
        <p className="text-muted-foreground">
          ContractSpec's knowledge system has three main components:
        </p>
        <div className="space-y-6">
          <div className="card-subtle p-4">
            <h3 className="mb-2 text-lg font-semibold">
              1. Knowledge Categories
            </h3>
            <p className="text-muted-foreground mb-3 text-sm">
              Four trust levels that determine how knowledge is used:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3">
                <code className="bg-background/50 rounded px-2 py-1 text-xs">
                  canonical
                </code>
                <span className="text-muted-foreground">
                  Ground truth - product specs, schemas, official policies
                </span>
              </div>
              <div className="flex items-start gap-3">
                <code className="bg-background/50 rounded px-2 py-1 text-xs">
                  operational
                </code>
                <span className="text-muted-foreground">
                  Internal docs - support tickets, runbooks, sales materials
                </span>
              </div>
              <div className="flex items-start gap-3">
                <code className="bg-background/50 rounded px-2 py-1 text-xs">
                  external
                </code>
                <span className="text-muted-foreground">
                  Third-party - PSP docs, regulations, integration guides
                </span>
              </div>
              <div className="flex items-start gap-3">
                <code className="bg-background/50 rounded px-2 py-1 text-xs">
                  ephemeral
                </code>
                <span className="text-muted-foreground">
                  Temporary - agent scratchpads, session context, drafts
                </span>
              </div>
            </div>
            <Link
              href="/docs/knowledge/categories"
              className="mt-3 inline-block text-sm text-violet-400 hover:text-violet-300"
            >
              Learn more about categories →
            </Link>
          </div>

          <div className="card-subtle p-4">
            <h3 className="mb-2 text-lg font-semibold">2. Knowledge Spaces</h3>
            <p className="text-muted-foreground mb-3 text-sm">
              Logical domains of knowledge defined globally:
            </p>
            <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded border p-3 font-mono text-xs">
              <pre>{`type KnowledgeSpaceSpec = {
  id: string;
  label: string;
  category: KnowledgeCategory;
  storageStrategy: "vector" | "search" | "hybrid";
  indexProvider: string;  // e.g., "qdrant"
  retentionPolicy: { days?: number };
  intendedAudience: "agents" | "humans" | "admin-only";
};`}</pre>
            </div>
            <Link
              href="/docs/knowledge/spaces"
              className="mt-3 inline-block text-sm text-violet-400 hover:text-violet-300"
            >
              Learn more about spaces →
            </Link>
          </div>

          <div className="card-subtle p-4">
            <h3 className="mb-2 text-lg font-semibold">3. Knowledge Sources</h3>
            <p className="text-muted-foreground mb-3 text-sm">
              Per-tenant data sources that feed knowledge spaces:
            </p>
            <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded border p-3 font-mono text-xs">
              <pre>{`type KnowledgeSourceConfig = {
  id: string;
  tenantId: string;
  spaceId: string;
  kind: "uploaded-document" | "url" | "email" 
        | "notion" | "database-query" | "raw-text";
  location: string;
  syncPolicy: { interval?: string; webhook?: boolean };
  lastSyncedAt?: string;
};`}</pre>
            </div>
            <Link
              href="/docs/knowledge/sources"
              className="mt-3 inline-block text-sm text-violet-400 hover:text-violet-300"
            >
              Learn more about sources →
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">How it works</h2>
        <p className="text-muted-foreground">
          Knowledge flows through ContractSpec in four stages:
        </p>
        <ol className="text-muted-foreground list-inside list-decimal space-y-3">
          <li>
            <strong>Define spaces</strong> - Create KnowledgeSpaceSpec for each
            logical domain (e.g., "Product Canon", "Support FAQ")
          </li>
          <li>
            <strong>Configure sources</strong> - Tenants connect their data
            sources (Notion, Gmail, uploads, etc.)
          </li>
          <li>
            <strong>Sync & index</strong> - Sources are synced, chunked, and
            indexed in vector databases
          </li>
          <li>
            <strong>Query & retrieve</strong> - Workflows and agents perform
            semantic search to find relevant context
          </li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Use cases</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card-subtle p-4">
            <h3 className="mb-2 font-semibold">Support Agents</h3>
            <p className="text-muted-foreground text-sm">
              Answer customer questions using product documentation (canonical)
              and past support tickets (operational).
            </p>
          </div>
          <div className="card-subtle p-4">
            <h3 className="mb-2 font-semibold">Invoice Generation</h3>
            <p className="text-muted-foreground text-sm">
              Generate invoices using product catalog (canonical) and pricing
              rules (operational).
            </p>
          </div>
          <div className="card-subtle p-4">
            <h3 className="mb-2 font-semibold">Compliance Checking</h3>
            <p className="text-muted-foreground text-sm">
              Validate operations against regulatory requirements (external) and
              internal policies (canonical).
            </p>
          </div>
          <div className="card-subtle p-4">
            <h3 className="mb-2 font-semibold">Semantic Search</h3>
            <p className="text-muted-foreground text-sm">
              Find relevant documents, tickets, or records using natural
              language queries.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Integration with workflows</h2>
        <p className="text-muted-foreground">
          Knowledge spaces are consumed by workflows through standard
          capabilities:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`import { defineWorkflow } from '@lssm/lib.contracts';
import { OpenAIEmbeddings, VectorSearch, OpenAIChat } from './specs';

export const AnswerSupportQuestion = defineWorkflow({
  meta: {
    name: 'support.answerQuestion',
    version: 1,
    description: 'Answer support questions using RAG',
    owners: ['team-support'],
    tags: ['ai', 'support'],
    stability: 'stable',
  },
  steps: [
    {
      id: 'embed-question',
      operation: OpenAIEmbeddings,
      inputs: (ctx, input) => ({
        text: input.question,
      }),
    },
    {
      id: 'search-knowledge',
      operation: VectorSearch,
      inputs: (ctx, input, steps) => ({
        collection: 'product-canon', // KnowledgeSpace
        vector: steps['embed-question'].output.embedding,
        limit: 5,
      }),
    },
    {
      id: 'generate-answer',
      operation: OpenAIChat,
      inputs: (ctx, input, steps) => ({
        messages: [
          { role: 'system', content: 'Answer using the provided context' },
          { 
            role: 'user', 
            content: \`Context: \${steps['search-knowledge'].output.results}\\nQuestion: \${input.question}\`
          },
        ],
      }),
    },
  ],
});`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Real-world examples</h2>
        <p className="text-muted-foreground">
          See how different applications use knowledge spaces:
        </p>
        <Link
          href="/docs/knowledge/examples"
          className="btn-primary inline-flex items-center gap-2"
        >
          View Examples <ChevronRight size={16} />
        </Link>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/knowledge/categories" className="btn-primary">
          Knowledge Categories <ChevronRight size={16} />
        </Link>
        <Link href="/docs/knowledge/spaces" className="btn-ghost">
          Knowledge Spaces
        </Link>
      </div>
    </div>
  );
}
