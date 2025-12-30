/* eslint-disable no-useless-escape */
import Link from 'next/link';

// export const metadata = {
//   title: 'Knowledge Examples: ContractSpec Docs',
//   description:
//     'Real-world examples of knowledge spaces in ContractSpec applications.',
// };

export default function KnowledgeExamplesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Knowledge Examples</h1>
        <p className="text-muted-foreground">
          Real-world examples of how different applications use knowledge spaces
          to power intelligent workflows and agents.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            Example 1: ArtisanOS Support Agent
          </h2>
          <p className="text-muted-foreground">
            <strong>Context:</strong> ArtisanOS needs a support agent that can
            answer product questions using official documentation and learn from
            past support tickets.
          </p>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`// Knowledge spaces
knowledgeSpaces: [
  {
    id: "product-canon",
    category: "canonical",
    sources: [
      { kind: "notion", location: "product-docs" },
      { kind: "database-query", location: "SELECT * FROM features" }
    ]
  },
  {
    id: "support-history",
    category: "operational",
    sources: [
      { kind: "email", location: "support@artisanos.com" },
      { kind: "slack", location: "#support-channel" }
    ]
  }
]

// Workflow
workflowId: answer-support-question
steps:
  - id: embed-question
    capability: openai-embeddings
    inputs:
      text: \$\{input.question\}
  
  - id: search-canon
    capability: vector.search
    inputs:
      collection: "product-canon"
      vector: \$\{steps.embed-question.output.embedding\}
      limit: 5
  
  - id: search-history
    capability: vector.search
    inputs:
      collection: "support-history"
      vector: \$\{steps.embed-question.output.embedding\}
      limit: 3
  
  - id: generate-answer
    capability: openai-chat
    inputs:
      messages:
        - role: "system"
          content: |
            Answer using canonical docs as authority.
            Use support history for helpful context.
        - role: "user"
          content: |
            Question: \$\{input.question\}
            Docs: \$\{steps.search-canon.output.results\}
            History: \$\{steps.search-history.output.results\}`}</pre>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            Example 2: HCircle Invoice Generation
          </h2>
          <p className="text-muted-foreground">
            <strong>Context:</strong> HCircle needs to generate invoices using
            house playbook rules and resident service history.
          </p>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`// Knowledge spaces
knowledgeSpaces: [
  {
    id: "house-playbook",
    category: "canonical",
    sources: [
      { kind: "uploaded-document", location: "playbook.pdf" },
      { kind: "database-query", location: "SELECT * FROM pricing_rules" }
    ]
  },
  {
    id: "resident-history",
    category: "operational",
    sources: [
      { kind: "database-query", location: "SELECT * FROM services" },
      { kind: "database-query", location: "SELECT * FROM invoices" }
    ]
  }
]

// Workflow
workflowId: generate-invoice
steps:
  - id: fetch-services
    capability: database.query
    inputs:
      query: "SELECT * FROM services WHERE resident_id = ?"
      params: [\$\{input.residentId\}]
  
  - id: search-pricing-rules
    capability: vector.search
    inputs:
      collection: "house-playbook"
      query: "pricing rules for \$\{steps.fetch-services.output.serviceType\}"
      limit: 3
  
  - id: calculate-total
    capability: calculate
    inputs:
      services: \$\{steps.fetch-services.output.rows\}
      rules: \$\{steps.search-pricing-rules.output.results\}
  
  - id: create-invoice
    capability: database.insert
    inputs:
      table: "invoices"
      data: \$\{steps.calculate-total.output\}`}</pre>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            Example 3: Multi-tenant SaaS with External Docs
          </h2>
          <p className="text-muted-foreground">
            <strong>Context:</strong> A SaaS platform needs to help users
            integrate with Stripe, using both internal guides and Stripe's
            official documentation.
          </p>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`// Knowledge spaces
knowledgeSpaces: [
  {
    id: "integration-guides",
    category: "canonical",
    sources: [
      { kind: "notion", location: "integration-guides" }
    ]
  },
  {
    id: "stripe-docs",
    category: "external",
    sources: [
      { kind: "url", location: "https://stripe.com/docs" }
    ]
  },
  {
    id: "customer-questions",
    category: "operational",
    sources: [
      { kind: "email", location: "support@saas.com" }
    ]
  }
]

// Workflow
workflowId: answer-integration-question
steps:
  - id: embed-question
    capability: openai-embeddings
    inputs:
      text: \$\{input.question\}
  
  - id: search-internal-guides
    capability: vector.search
    inputs:
      collection: "integration-guides"
      vector: \$\{steps.embed-question.output.embedding\}
      limit: 3
  
  - id: search-stripe-docs
    capability: vector.search
    inputs:
      collection: "stripe-docs"
      vector: \$\{steps.embed-question.output.embedding\}
      limit: 2
  
  - id: search-past-questions
    capability: vector.search
    inputs:
      collection: "customer-questions"
      vector: \$\{steps.embed-question.output.embedding\}
      limit: 2
  
  - id: generate-answer
    capability: openai-chat
    inputs:
      messages:
        - role: "system"
          content: |
            Prioritize internal guides (authoritative).
            Use Stripe docs for API details (reference).
            Use past questions for common issues (context).
        - role: "user"
          content: |
            Question: \$\{input.question\}
            Internal: \$\{steps.search-internal-guides.output.results\}
            Stripe: \$\{steps.search-stripe-docs.output.results\}
            Past: \$\{steps.search-past-questions.output.results\}`}</pre>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Key patterns</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Canonical first</strong> - Always search canonical spaces
            before operational or external
          </li>
          <li>
            <strong>Category-aware prompts</strong> - Tell the LLM which sources
            are authoritative vs reference
          </li>
          <li>
            <strong>Multi-space queries</strong> - Combine results from multiple
            spaces for richer context
          </li>
          <li>
            <strong>Limit results</strong> - Use appropriate limits (3-5) to
            avoid token overflow
          </li>
          <li>
            <strong>Audit everything</strong> - Log all knowledge queries for
            debugging and compliance
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/knowledge/sources" className="btn-ghost">
          Previous: Sources
        </Link>
        <Link href="/docs/architecture/knowledge-binding" className="btn-ghost">
          Knowledge Binding
        </Link>
      </div>
    </div>
  );
}
