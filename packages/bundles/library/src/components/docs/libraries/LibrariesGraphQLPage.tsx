import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function LibrariesGraphQLPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">GraphQL Libraries</h1>
				<p className="text-muted-foreground">
					This suite of libraries enables seamless GraphQL integration,
					transforming your ContractSpecs into a type-safe Pothos schema,
					connecting with Prisma, and enabling Apollo Federation.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Libraries</h2>
				<div className="grid gap-4 md:grid-cols-1">
					<div className="card-subtle p-6">
						<h3 className="font-bold text-lg">
							@contractspec/lib.graphql-core
						</h3>
						<p className="mt-2 text-muted-foreground text-sm">
							The foundation. Provides a configured Pothos builder, common
							scalars (JSON, DateTime), and utilities for mapping ContractSpec
							I/O to Pothos types.
						</p>
					</div>
					<div className="card-subtle p-6">
						<h3 className="font-bold text-lg">
							@contractspec/lib.graphql-prisma
						</h3>
						<p className="mt-2 text-muted-foreground text-sm">
							Connects Pothos to Prisma. Automatically generates GraphQL types
							from your Prisma schema and optimizes queries to prevent N+1
							issues.
						</p>
					</div>
					<div className="card-subtle p-6">
						<h3 className="font-bold text-lg">
							@contractspec/lib.graphql-federation
						</h3>
						<p className="mt-2 text-muted-foreground text-sm">
							Adds Apollo Federation V2 support. Allows your subgraph to define
							keys and entities, making it ready for a supergraph.
						</p>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Installation</h2>
				<InstallCommand
					package={[
						'@contractspec/lib.graphql-core',
						'@contractspec/lib.graphql-prisma',
						'@contractspec/lib.graphql-federation',
					]}
				/>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Usage: Building a Schema</h2>
				<p className="text-muted-foreground">
					Here's how to assemble a federated GraphQL schema from your specs:
				</p>
				<CodeBlock
					language="typescript"
					code={`import { builder } from '@contractspec/lib.graphql-core';
import { registerContractsOnBuilder } from '@contractspec/lib.contracts-runtime-server-graphql/graphql-pothos';
import { OperationSpecRegistry } from '@contractspec/lib.contracts-spec';
import { MySpecs } from './specs';

// 1. Register contracts
const registry = new OperationSpecRegistry();
registry.register(MySpecs);

// 2. Mount specs onto Pothos builder
registerContractsOnBuilder(builder, registry);

// 3. Build and print schema
const schema = builder.toSchema();
console.log(printSchema(schema));`}
				/>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Features</h2>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground">
					<li>
						<strong>Code-First</strong>: Define schema in TypeScript (Pothos),
						get SDL as artifact.
					</li>
					<li>
						<strong>Spec Integration</strong>: `registerContractsOnBuilder`
						automatically converts Command/Query specs into Mutations/Queries.
					</li>
					<li>
						<strong>Federation Ready</strong>: Just add `provider: 'federation'`
						to your config.
					</li>
				</ul>
			</div>

			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/libraries/data-backend" className="btn-primary">
					Next: Data & Backend <ChevronRight size={16} />
				</Link>
				<Link href="/docs/libraries" className="btn-ghost">
					Back to Libraries
				</Link>
			</div>
		</div>
	);
}
