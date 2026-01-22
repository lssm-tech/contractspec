import type { Metadata } from 'next';
import { openapiAlternativeBrief } from '@contractspec/bundle.library/components/docs/intent/intent-pages.docblocks';
import { SeoOptimizer } from '@contractspec/lib.content-gen/seo';
import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = new SeoOptimizer().optimize(
  openapiAlternativeBrief
);

export function OpenapiAlternativePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">{openapiAlternativeBrief.title}</h1>
        <p className="text-muted-foreground text-lg">
          {openapiAlternativeBrief.summary}
        </p>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">OpenAPI Limitations</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          {openapiAlternativeBrief.problems.map((problem, index) => (
            <li key={index}>{problem}</li>
          ))}
        </ul>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">ContractSpec Advantages</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          {openapiAlternativeBrief.solutions.map((solution, index) => (
            <li key={index}>{solution}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">
            Comparison: OpenAPI vs ContractSpec
          </h2>
          <p className="text-muted-foreground text-sm">
            Key differences between OpenAPI documentation and ContractSpec
            executable contracts.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="card-subtle space-y-3 p-4">
              <h3 className="text-lg font-semibold">OpenAPI</h3>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Documentation specification only</li>
                <li>• No runtime validation</li>
                <li>• Manual code generation</li>
                <li>• Type safety requires tools</li>
                <li>• Separate schemas from documentation</li>
              </ul>
            </div>

            <div className="card-subtle space-y-3 p-4">
              <h3 className="text-lg font-semibold">ContractSpec</h3>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Executable contracts</li>
                <li>• Built-in runtime validation</li>
                <li>• Automatic code generation</li>
                <li>• Type-safe by default</li>
                <li>• Unified spec and implementation</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Export from Contracts</h2>
          <p className="text-muted-foreground text-sm">
            Generate OpenAPI documentation from ContractSpec for existing
            tooling.
          </p>
          <CodeBlock
            language="bash"
            filename="export-openapi"
            code={`# From ContractSpec contracts
contractspec openapi export \\
  --registry ./src/contracts/registry.ts \\
  --format yaml \\
  --out ./openapi.yaml

# Compare: Manual OpenAPI vs Generated
# Manual: Write OpenAPI by hand, maintain separately
# Generated: Single source of truth, always in sync`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Beyond Documentation</h2>
          <p className="text-muted-foreground text-sm">
            ContractSpec provides more than just API documentation.
          </p>
          <CodeBlock
            language="typescript"
            filename="multi-output-example.ts"
            code={`// One contract, multiple outputs
import { UserApiContract } from './contracts/user-api.contract';

// Generated outputs
export const outputs = {
  // API documentation (OpenAPI)
  openapi: UserApiContract.toOpenAPI(),
  
  // Client SDKs (TypeScript, Python, etc.)
  clients: UserApiContract.generateClients({
    languages: ['typescript', 'python', 'go'],
  }),
  
  // Database schemas (Prisma, Drizzle)
  database: UserApiContract.toDatabase({
    adapter: 'prisma',
  }),
  
  // API handlers (Express, Fastify, Next.js)
  handlers: UserApiContract.toHandlers({
    framework: 'express',
  }),
  
  // Validation middleware
  validation: UserApiContract.toValidation({
    library: 'zod',
  }),
  
  // Type definitions
  types: UserApiContract.toTypescript(),
};`}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link
          href="/docs/guides/generate-docs-clients-schemas"
          className="btn-primary"
        >
          Generate from Contracts <ChevronRight size={16} />
        </Link>
        <Link
          href="/docs/intent/generate-client-from-schema"
          className="btn-ghost"
        >
          Client Generation
        </Link>
      </div>
    </div>
  );
}
