import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Knowledge Binding: ContractSpec Docs',
//   description:
//     'Learn how apps bind to knowledge spaces through AppKnowledgeBinding in ContractSpec.',
// };

export default function KnowledgeBindingPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Knowledge Binding</h1>
        <p className="text-muted-foreground">
          Knowledge binding connects your app's workflows and agents to
          structured knowledge spaces. This enables semantic search, RAG
          (Retrieval-Augmented Generation), and context-aware decision-making.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">How it works</h2>
        <p className="text-muted-foreground">
          Knowledge binding follows a three-layer model:
        </p>
        <ol className="text-muted-foreground list-inside list-decimal space-y-3">
          <li>
            <strong>KnowledgeSpaceSpec</strong> (global) - Defines a logical
            knowledge domain
          </li>
          <li>
            <strong>KnowledgeSourceConfig</strong> (per-tenant) - Tenant's data
            sources feeding spaces
          </li>
          <li>
            <strong>AppKnowledgeBinding</strong> (per-app) - Maps spaces to
            workflows/agents
          </li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example: Support agent with RAG</h2>
        <p className="text-muted-foreground">
          Let's build a support agent that uses canonical product documentation
          and operational support history.
        </p>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Step 1: Blueprint declares knowledge needs
          </h3>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`// AppBlueprintSpec
{
  id: "support-app",
  version: "1.0.0",
  knowledgeSpaces: [
    {
      spaceId: "product-canon",
      category: "canonical",
      required: true,
      purpose: "Official product documentation and specs"
    },
    {
      spaceId: "support-history",
      category: "operational",
      required: true,
      purpose: "Past support tickets and resolutions"
    },
    {
      spaceId: "external-docs",
      category: "external",
      required: false,
      purpose: "Third-party integration documentation"
    }
  ]
}`}</pre>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Step 2: Tenant configures sources
          </h3>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`// KnowledgeSourceConfig (per-tenant)
[
  {
    id: "src_notion_product_docs",
    tenantId: "acme-corp",
    spaceId: "product-canon",
    kind: "notion",
    location: "https://notion.so/acme/product-docs",
    syncPolicy: { interval: "1h" },
    lastSyncedAt: "2025-01-15T10:00:00Z"
  },
  {
    id: "src_gmail_support_threads",
    tenantId: "acme-corp",
    spaceId: "support-history",
    kind: "gmail",
    location: "support@acme.com",
    syncPolicy: { webhook: true },
    lastSyncedAt: "2025-01-15T10:30:00Z"
  },
  {
    id: "src_stripe_docs",
    tenantId: "acme-corp",
    spaceId: "external-docs",
    kind: "url",
    location: "https://stripe.com/docs",
    syncPolicy: { interval: "24h" },
    lastSyncedAt: "2025-01-15T00:00:00Z"
  }
]`}</pre>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Step 3: TenantAppConfig binds spaces
          </h3>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`// TenantAppConfig
{
  tenantId: "acme-corp",
  blueprintId: "support-app",
  blueprintVersion: "1.0.0",
  knowledgeBindings: [
    {
      spaceId: "product-canon",
      enabled: true,
      allowedConsumers: {
        workflowIds: ["answer-question", "generate-docs"],
        agentIds: ["support-agent", "docs-agent"]
      },
      allowedCategories: ["canonical"],
      sources: ["src_notion_product_docs"]
    },
    {
      spaceId: "support-history",
      enabled: true,
      allowedConsumers: {
        workflowIds: ["answer-question", "escalate-ticket"],
        agentIds: ["support-agent"]
      },
      allowedCategories: ["operational"],
      sources: ["src_gmail_support_threads"]
    },
    {
      spaceId: "external-docs",
      enabled: true,
      allowedConsumers: {
        agentIds: ["support-agent"]
      },
      allowedCategories: ["external"],
      sources: ["src_stripe_docs"]
    }
  ]
}`}</pre>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Step 4: Workflow uses knowledge
          </h3>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`// WorkflowSpec
workflowId: answer-question
version: 1.0.0

steps:
  - id: generate-embedding
    capability: openai-embeddings
    inputs:
      text: \$\{input.question\}
  
  - id: search-canonical
    capability: vector.search
    inputs:
      collection: "product-canon"
      vector: \$\{steps.generate-embedding.output.embedding\}
      limit: 5
  
  - id: search-support-history
    capability: vector.search
    inputs:
      collection: "support-history"
      vector: \$\{steps.generate-embedding.output.embedding\}
      limit: 3
  
  - id: generate-answer
    capability: openai-chat
    inputs:
      messages:
        - role: "system"
          content: |
            You are a support agent. Answer based on:
            1. Canonical docs (authoritative)
            2. Support history (helpful context)
            Only use external docs for integration questions.
        - role: "user"
          content: |
            Question: \$\{input.question\}
            
            Canonical docs:
            \$\{steps.search-canonical.output.results\}
            
            Support history:
            \$\{steps.search-support-history.output.results\}`}</pre>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Category-based access control</h2>
        <p className="text-muted-foreground">
          Different knowledge categories have different trust levels and access
          patterns:
        </p>
        <div className="border-border/50 overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/50">
              <tr className="border-border/50 border-b">
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Trust Level</th>
                <th className="px-4 py-3 font-semibold">Use Cases</th>
                <th className="px-4 py-3 font-semibold">Policy Impact</th>
              </tr>
            </thead>
            <tbody className="divide-border/50 divide-y">
              <tr>
                <td className="px-4 py-3 font-mono text-xs">canonical</td>
                <td className="px-4 py-3">Highest</td>
                <td className="px-4 py-3">
                  Product specs, schemas, official policies
                </td>
                <td className="px-4 py-3">Can drive policy decisions</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">operational</td>
                <td className="px-4 py-3">High</td>
                <td className="px-4 py-3">
                  Support tickets, sales docs, internal runbooks
                </td>
                <td className="px-4 py-3">Can inform decisions</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">external</td>
                <td className="px-4 py-3">Medium</td>
                <td className="px-4 py-3">
                  Third-party docs, regulations, PSP guides
                </td>
                <td className="px-4 py-3">Reference only, not authoritative</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">ephemeral</td>
                <td className="px-4 py-3">Low</td>
                <td className="px-4 py-3">
                  Agent scratchpads, session context, drafts
                </td>
                <td className="px-4 py-3">Never used for decisions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Multi-space workflows</h2>
        <p className="text-muted-foreground">
          Workflows can query multiple knowledge spaces and combine results:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`knowledgeBindings: [
  {
    spaceId: "product-canon",
    enabled: true,
    allowedConsumers: {
      workflowIds: ["invoice-generation", "quote-creation"]
    },
    allowedCategories: ["canonical"],
    sources: ["src_database_schema", "src_product_catalog"]
  },
  {
    spaceId: "pricing-rules",
    enabled: true,
    allowedConsumers: {
      workflowIds: ["invoice-generation", "quote-creation"]
    },
    allowedCategories: ["canonical", "operational"],
    sources: ["src_pricing_database", "src_discount_policies"]
  },
  {
    spaceId: "customer-history",
    enabled: true,
    allowedConsumers: {
      workflowIds: ["quote-creation"]
    },
    allowedCategories: ["operational"],
    sources: ["src_crm_data", "src_past_invoices"]
  }
]`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Security & validation</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Knowledge sources are validated before sync - credentials and
            permissions checked
          </li>
          <li>PDP enforces which workflows/agents can access which spaces</li>
          <li>
            All knowledge queries are audited with search terms and results
          </li>
          <li>
            Canonical knowledge is immutable once indexed - changes require
            re-sync
          </li>
          <li>
            Ephemeral knowledge is automatically purged based on retention
            policies
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Use canonical spaces for policy-critical decisions, operational for
            suggestions
          </li>
          <li>
            Never allow workflows to write to canonical spaces - maintain
            read-only access
          </li>
          <li>
            Set up monitoring for sync failures and stale knowledge sources
          </li>
          <li>Document the purpose and trust level of each knowledge space</li>
          <li>
            Test knowledge queries in sandbox before promoting to production
          </li>
          <li>
            Use explicit <code>allowedConsumers</code> - avoid wildcard access
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link
          href="/docs/architecture/integration-binding"
          className="btn-ghost"
        >
          Previous: Integration Binding
        </Link>
        <Link href="/docs/knowledge" className="btn-primary">
          Knowledge & Context <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
