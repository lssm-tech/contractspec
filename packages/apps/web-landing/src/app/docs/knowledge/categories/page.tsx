import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Knowledge Categories: ContractSpec Docs',
//   description:
//     'Understand the four knowledge categories in ContractSpec and how they affect trust and decision-making.',
// };

export default function KnowledgeCategoriesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Knowledge Categories</h1>
        <p className="text-muted-foreground">
          ContractSpec classifies knowledge into four categories based on trust
          level, source authority, and intended use. This classification
          determines how knowledge can be used in workflows, policy decisions,
          and agent responses.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">The four categories</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`type KnowledgeCategory =
  | "canonical"   // Internal ground truth
  | "operational" // Internal operational docs
  | "external"    // Third-party reference
  | "ephemeral";  // Temporary context`}</pre>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">1. Canonical</h3>
          <p className="text-muted-foreground">
            <strong>Trust level:</strong> Highest - Authoritative ground truth
          </p>
          <div className="space-y-3">
            <div>
              <h4 className="mb-2 text-sm font-semibold">What it contains:</h4>
              <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-1 text-sm">
                <li>Official product specifications and schemas</li>
                <li>Company policies and procedures</li>
                <li>Legal terms and compliance requirements</li>
                <li>Pricing rules and business logic</li>
                <li>Data classification and security policies</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold">How it's used:</h4>
              <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-1 text-sm">
                <li>
                  <strong>Policy decisions</strong> - Can drive PDP decisions
                </li>
                <li>
                  <strong>Validation</strong> - Used to validate user inputs and
                  operations
                </li>
                <li>
                  <strong>Code generation</strong> - Source of truth for
                  generated code
                </li>
                <li>
                  <strong>Compliance</strong> - Reference for audit and
                  regulatory checks
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold">Examples:</h4>
              <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded border p-3 font-mono text-xs">
                <pre>{`// Product Canon space
{
  id: "product-canon",
  category: "canonical",
  sources: [
    "database-schema.sql",
    "product-catalog.yaml",
    "pricing-rules.json"
  ]
}

// Policy Canon space
{
  id: "policy-canon",
  category: "canonical",
  sources: [
    "data-classification.yaml",
    "access-policies.rego",
    "compliance-requirements.md"
  ]
}`}</pre>
              </div>
            </div>
            <div className="card-subtle border-violet-500/30 bg-violet-500/10 p-3">
              <p className="text-sm text-violet-300">
                <strong>⚠️ Important:</strong> Canonical knowledge is immutable
                once indexed. Changes require re-sync and versioning.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">2. Operational</h3>
          <p className="text-muted-foreground">
            <strong>Trust level:</strong> High - Internal but not authoritative
          </p>
          <div className="space-y-3">
            <div>
              <h4 className="mb-2 text-sm font-semibold">What it contains:</h4>
              <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-1 text-sm">
                <li>Support ticket history and resolutions</li>
                <li>Internal runbooks and playbooks</li>
                <li>Sales materials and customer communications</li>
                <li>Product management docs and roadmaps</li>
                <li>Team wikis and knowledge bases</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold">How it's used:</h4>
              <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-1 text-sm">
                <li>
                  <strong>Context</strong> - Provides helpful context for
                  decisions
                </li>
                <li>
                  <strong>Suggestions</strong> - Informs recommendations, not
                  requirements
                </li>
                <li>
                  <strong>Learning</strong> - Helps agents learn from past
                  interactions
                </li>
                <li>
                  <strong>Troubleshooting</strong> - Guides problem-solving
                  workflows
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold">Examples:</h4>
              <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded border p-3 font-mono text-xs">
                <pre>{`// Support History space
{
  id: "support-history",
  category: "operational",
  sources: [
    "gmail:support@company.com",
    "zendesk:tickets",
    "slack:support-channel"
  ]
}

// Internal Docs space
{
  id: "internal-docs",
  category: "operational",
  sources: [
    "notion:engineering-wiki",
    "confluence:product-docs",
    "google-drive:runbooks"
  ]
}`}</pre>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">3. External</h3>
          <p className="text-muted-foreground">
            <strong>Trust level:</strong> Medium - Reference only
          </p>
          <div className="space-y-3">
            <div>
              <h4 className="mb-2 text-sm font-semibold">What it contains:</h4>
              <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-1 text-sm">
                <li>Third-party integration documentation (Stripe, Twilio)</li>
                <li>Regulatory and compliance documents</li>
                <li>Industry standards and best practices</li>
                <li>Public API documentation</li>
                <li>External knowledge bases</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold">How it's used:</h4>
              <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-1 text-sm">
                <li>
                  <strong>Reference</strong> - Consulted but not authoritative
                </li>
                <li>
                  <strong>Integration help</strong> - Guides external API usage
                </li>
                <li>
                  <strong>Compliance context</strong> - Provides regulatory
                  background
                </li>
                <li>
                  <strong>Never for policy</strong> - Cannot drive policy
                  decisions
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold">Examples:</h4>
              <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded border p-3 font-mono text-xs">
                <pre>{`// External Provider Docs space
{
  id: "provider-docs",
  category: "external",
  sources: [
    "url:https://stripe.com/docs",
    "url:https://twilio.com/docs",
    "url:https://openai.com/docs"
  ]
}

// Regulatory Docs space
{
  id: "regulatory-docs",
  category: "external",
  sources: [
    "url:https://gdpr.eu/",
    "url:https://www.hhs.gov/hipaa",
    "pdf:SOC2-requirements.pdf"
  ]
}`}</pre>
              </div>
            </div>
            <div className="card-subtle border-amber-500/30 bg-amber-500/10 p-3">
              <p className="text-sm text-amber-300">
                <strong>⚠️ Note:</strong> External knowledge should be clearly
                marked in agent responses as "according to [source]" to indicate
                it's not internal authority.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">4. Ephemeral</h3>
          <p className="text-muted-foreground">
            <strong>Trust level:</strong> Low - Temporary context only
          </p>
          <div className="space-y-3">
            <div>
              <h4 className="mb-2 text-sm font-semibold">What it contains:</h4>
              <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-1 text-sm">
                <li>Agent conversation history and scratchpads</li>
                <li>Session-specific context and state</li>
                <li>Draft documents and work-in-progress</li>
                <li>Temporary calculations and intermediate results</li>
                <li>User-provided context for current task</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold">How it's used:</h4>
              <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-1 text-sm">
                <li>
                  <strong>Session continuity</strong> - Maintains conversation
                  context
                </li>
                <li>
                  <strong>Working memory</strong> - Stores intermediate results
                </li>
                <li>
                  <strong>Never persisted long-term</strong> - Auto-purged after
                  session
                </li>
                <li>
                  <strong>Never for decisions</strong> - Cannot influence policy
                  or validation
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold">Examples:</h4>
              <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded border p-3 font-mono text-xs">
                <pre>{`// Agent Scratchpad space
{
  id: "agent-scratchpad",
  category: "ephemeral",
  retentionPolicy: { days: 1 },
  sources: [
    "session:current-conversation",
    "memory:agent-working-memory"
  ]
}

// User Session space
{
  id: "user-session",
  category: "ephemeral",
  retentionPolicy: { days: 7 },
  sources: [
    "session:user-uploads",
    "session:form-drafts"
  ]
}`}</pre>
              </div>
            </div>
            <div className="card-subtle border-red-500/30 bg-red-500/10 p-3">
              <p className="text-sm text-red-300">
                <strong>⚠️ Critical:</strong> Ephemeral knowledge is never used
                for policy decisions, compliance checks, or any authoritative
                purpose.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Category comparison</h2>
        <div className="border-border/50 overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/50">
              <tr className="border-border/50 border-b">
                <th className="px-4 py-3 font-semibold">Feature</th>
                <th className="px-4 py-3 font-semibold">Canonical</th>
                <th className="px-4 py-3 font-semibold">Operational</th>
                <th className="px-4 py-3 font-semibold">External</th>
                <th className="px-4 py-3 font-semibold">Ephemeral</th>
              </tr>
            </thead>
            <tbody className="divide-border/50 divide-y">
              <tr>
                <td className="px-4 py-3 font-semibold">Trust Level</td>
                <td className="px-4 py-3">Highest</td>
                <td className="px-4 py-3">High</td>
                <td className="px-4 py-3">Medium</td>
                <td className="px-4 py-3">Low</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">Policy Impact</td>
                <td className="px-4 py-3">✅ Can drive decisions</td>
                <td className="px-4 py-3">⚠️ Can inform</td>
                <td className="px-4 py-3">❌ Reference only</td>
                <td className="px-4 py-3">❌ Never used</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">Mutability</td>
                <td className="px-4 py-3">Immutable</td>
                <td className="px-4 py-3">Mutable</td>
                <td className="px-4 py-3">Mutable</td>
                <td className="px-4 py-3">Temporary</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">Retention</td>
                <td className="px-4 py-3">Permanent</td>
                <td className="px-4 py-3">Long-term</td>
                <td className="px-4 py-3">Long-term</td>
                <td className="px-4 py-3">Short-term</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">Audit Level</td>
                <td className="px-4 py-3">Full audit</td>
                <td className="px-4 py-3">Full audit</td>
                <td className="px-4 py-3">Basic audit</td>
                <td className="px-4 py-3">Minimal audit</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Use canonical for anything that affects policy, pricing, or
            compliance
          </li>
          <li>
            Use operational for context that helps but doesn't dictate decisions
          </li>
          <li>
            Use external for reference material that's helpful but not
            authoritative
          </li>
          <li>
            Use ephemeral for temporary working memory that shouldn't persist
          </li>
          <li>
            Never mix categories in a single knowledge space - keep them
            separate
          </li>
          <li>
            Document the category and purpose of each knowledge space clearly
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/knowledge" className="btn-ghost">
          Back to Knowledge
        </Link>
        <Link href="/docs/knowledge/spaces" className="btn-primary">
          Knowledge Spaces <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
