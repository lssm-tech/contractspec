import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Knowledge Sources: ContractSpec Docs",
  description:
    "Learn about KnowledgeSourceConfig and how to connect tenant data sources to knowledge spaces.",
};

export default function KnowledgeSourcesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Knowledge Sources</h1>
        <p className="text-muted-foreground">
          A <strong>KnowledgeSourceConfig</strong> connects a tenant's data
          sources (Notion, Gmail, uploads, databases) to knowledge spaces. Each
          source is synced, chunked, embedded, and indexed according to the
          space's configuration.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">KnowledgeSourceConfig</h2>
        <div className="bg-background/50 p-4 rounded-lg border border-border font-mono text-sm text-muted-foreground overflow-x-auto">
          <pre>{`type KnowledgeSourceConfig = {
  id: string;
  tenantId: string;
  spaceId: string;
  
  // Source type and location
  kind: "uploaded-document" | "url" | "email" 
        | "notion" | "database-query" | "raw-text"
        | "slack" | "confluence" | "google-drive";
  location: string;
  
  // Sync configuration
  syncPolicy: {
    interval?: string;  // e.g., "1h", "24h"
    webhook?: boolean;
    manual?: boolean;
  };
  
  // State
  status: "active" | "paused" | "error";
  lastSyncedAt?: string;
  lastErrorMessage?: string;
  
  // Metadata
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Source types</h2>
        <div className="space-y-6">
          <div className="card-subtle p-4">
            <h3 className="text-lg font-semibold mb-2">
              Uploaded Documents
            </h3>
            <div className="bg-background/50 p-3 rounded border border-border font-mono text-xs text-muted-foreground overflow-x-auto">
              <pre>{`{
  kind: "uploaded-document",
  location: "s3://bucket/tenant-123/docs/product-spec.pdf",
  syncPolicy: { manual: true }
}`}</pre>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              PDFs, Word docs, presentations uploaded by users
            </p>
          </div>

          <div className="card-subtle p-4">
            <h3 className="text-lg font-semibold mb-2">Notion</h3>
            <div className="bg-background/50 p-3 rounded border border-border font-mono text-xs text-muted-foreground overflow-x-auto">
              <pre>{`{
  kind: "notion",
  location: "https://notion.so/workspace/product-docs",
  syncPolicy: { interval: "1h", webhook: true }
}`}</pre>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Notion pages and databases with real-time webhook updates
            </p>
          </div>

          <div className="card-subtle p-4">
            <h3 className="text-lg font-semibold mb-2">Gmail / Email</h3>
            <div className="bg-background/50 p-3 rounded border border-border font-mono text-xs text-muted-foreground overflow-x-auto">
              <pre>{`{
  kind: "email",
  location: "support@company.com",
  syncPolicy: { webhook: true }
}`}</pre>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Email threads from Gmail or other providers
            </p>
          </div>

          <div className="card-subtle p-4">
            <h3 className="text-lg font-semibold mb-2">Database Query</h3>
            <div className="bg-background/50 p-3 rounded border border-border font-mono text-xs text-muted-foreground overflow-x-auto">
              <pre>{`{
  kind: "database-query",
  location: "SELECT * FROM products WHERE active = true",
  syncPolicy: { interval: "24h" }
}`}</pre>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Structured data from application databases
            </p>
          </div>

          <div className="card-subtle p-4">
            <h3 className="text-lg font-semibold mb-2">URL / Web Scraping</h3>
            <div className="bg-background/50 p-3 rounded border border-border font-mono text-xs text-muted-foreground overflow-x-auto">
              <pre>{`{
  kind: "url",
  location: "https://stripe.com/docs",
  syncPolicy: { interval: "24h" }
}`}</pre>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              External documentation and web content
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Sync strategies</h2>
        <div className="overflow-x-auto rounded-lg border border-border/50">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/50">
              <tr className="border-b border-border/50">
                <th className="px-4 py-3 font-semibold">Strategy</th>
                <th className="px-4 py-3 font-semibold">When to Use</th>
                <th className="px-4 py-3 font-semibold">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr>
                <td className="px-4 py-3 font-mono text-xs">webhook</td>
                <td className="px-4 py-3">
                  Real-time updates (Notion, Gmail, Slack)
                </td>
                <td className="px-4 py-3">Seconds</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">interval</td>
                <td className="px-4 py-3">
                  Periodic sync (databases, URLs)
                </td>
                <td className="px-4 py-3">Minutes to hours</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">manual</td>
                <td className="px-4 py-3">
                  User-triggered (uploads, one-time imports)
                </td>
                <td className="px-4 py-3">On-demand</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example: Multi-source space</h2>
        <p className="text-muted-foreground">
          A single knowledge space can be fed by multiple sources:
        </p>
        <div className="bg-background/50 p-4 rounded-lg border border-border font-mono text-sm text-muted-foreground overflow-x-auto">
          <pre>{`// Product Canon space with multiple sources
{
  spaceId: "product-canon",
  sources: [
    {
      id: "src_database_schema",
      kind: "database-query",
      location: "SELECT * FROM schema_definitions",
      syncPolicy: { interval: "1h" }
    },
    {
      id: "src_notion_product_docs",
      kind: "notion",
      location: "https://notion.so/product-docs",
      syncPolicy: { interval: "1h", webhook: true }
    },
    {
      id: "src_uploaded_specs",
      kind: "uploaded-document",
      location: "s3://bucket/specs/",
      syncPolicy: { manual: true }
    }
  ]
}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Processing pipeline</h2>
        <p className="text-muted-foreground">
          When a source is synced, ContractSpec processes it through several
          stages:
        </p>
        <ol className="space-y-3 text-muted-foreground list-decimal list-inside">
          <li>
            <strong>Fetch</strong> - Retrieve content from source (API, database,
            file)
          </li>
          <li>
            <strong>Parse</strong> - Extract text from documents (PDF, Word,
            HTML)
          </li>
          <li>
            <strong>Chunk</strong> - Split into semantic chunks (paragraphs,
            sections)
          </li>
          <li>
            <strong>Embed</strong> - Generate vector embeddings (OpenAI,
            Cohere)
          </li>
          <li>
            <strong>Index</strong> - Store in vector database (Qdrant) or search
            engine
          </li>
          <li>
            <strong>Audit</strong> - Log sync operation and results
          </li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="space-y-2 text-muted-foreground list-disc list-inside">
          <li>
            Use webhooks for real-time sources (Notion, Gmail) to minimize
            latency
          </li>
          <li>
            Set appropriate sync intervals - hourly for active docs, daily for
            stable content
          </li>
          <li>
            Monitor sync failures and set up alerts for critical sources
          </li>
          <li>
            Test sources in sandbox before enabling in production
          </li>
          <li>
            Document the purpose and ownership of each source for your team
          </li>
          <li>
            Use manual sync for sensitive or infrequently updated content
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/knowledge/spaces" className="btn-ghost">
          Previous: Spaces
        </Link>
        <Link href="/docs/knowledge/examples" className="btn-primary">
          Examples <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}

