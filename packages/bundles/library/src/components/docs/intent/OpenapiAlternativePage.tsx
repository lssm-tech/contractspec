import { openapiAlternativeBrief } from '@contractspec/bundle.library/components/docs/intent/intent-pages.docblocks';
import { SeoOptimizer } from '@contractspec/lib.content-gen/seo';
import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = new SeoOptimizer().optimize(
	openapiAlternativeBrief
);

export function OpenapiAlternativePage() {
	return (
		<div className="space-y-8">
			<div className="space-y-3">
				<h1 className="font-bold text-4xl">{openapiAlternativeBrief.title}</h1>
				<p className="text-lg text-muted-foreground">
					{openapiAlternativeBrief.summary}
				</p>
			</div>

			<div className="card-subtle space-y-4 p-6">
				<h2 className="font-bold text-2xl">OpenAPI Limitations</h2>
				<ul className="space-y-2 text-muted-foreground text-sm">
					{openapiAlternativeBrief.problems.map((problem, index) => (
						<li key={index}>{problem}</li>
					))}
				</ul>
			</div>

			<div className="card-subtle space-y-4 p-6">
				<h2 className="font-bold text-2xl">ContractSpec Advantages</h2>
				<ul className="space-y-2 text-muted-foreground text-sm">
					{openapiAlternativeBrief.solutions.map((solution, index) => (
						<li key={index}>{solution}</li>
					))}
				</ul>
			</div>

			<div className="space-y-6">
				<div className="space-y-3">
					<h2 className="font-bold text-2xl">
						Comparison: OpenAPI vs ContractSpec
					</h2>
					<p className="text-muted-foreground text-sm">
						Key differences between OpenAPI documentation and ContractSpec
						executable contracts.
					</p>

					<div className="grid gap-6 md:grid-cols-2">
						<div className="card-subtle space-y-3 p-4">
							<h3 className="font-semibold text-lg">OpenAPI</h3>
							<ul className="space-y-1 text-muted-foreground text-sm">
								<li>• Documentation specification only</li>
								<li>• No runtime validation</li>
								<li>• Manual code generation</li>
								<li>• Type safety requires tools</li>
								<li>• Separate schemas from documentation</li>
							</ul>
						</div>

						<div className="card-subtle space-y-3 p-4">
							<h3 className="font-semibold text-lg">ContractSpec</h3>
							<ul className="space-y-1 text-muted-foreground text-sm">
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
					<h2 className="font-bold text-2xl">Export from Contracts</h2>
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
					<h2 className="font-bold text-2xl">Beyond Documentation</h2>
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
