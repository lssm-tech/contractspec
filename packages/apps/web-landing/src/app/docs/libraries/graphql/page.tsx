import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'GraphQL Libraries: ContractSpec Docs',
  description:
    'Generate production-ready GraphQL schemas from ContractSpec definitions.',
};

export default function GraphQLLibrariesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">GraphQL Libraries</h1>
        <p className="text-muted-foreground">
          This suite of libraries enables seamless GraphQL integration,
          transforming your ContractSpecs into a type-safe Pothos schema,
          connecting with Prisma, and enabling Apollo Federation.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Libraries</h2>
        <div className="grid gap-4 md:grid-cols-1">
          <div className="card-subtle p-6">
            <h3 className="text-lg font-bold">@lssm/lib.graphql-core</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              The foundation. Provides a configured Pothos builder, common
              scalars (JSON, DateTime), and utilities for mapping ContractSpec
              I/O to Pothos types.
            </p>
          </div>
          <div className="card-subtle p-6">
            <h3 className="text-lg font-bold">@lssm/lib.graphql-prisma</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Connects Pothos to Prisma. Automatically generates GraphQL types
              from your Prisma schema and optimizes queries to prevent N+1
              issues.
            </p>
          </div>
          <div className="card-subtle p-6">
            <h3 className="text-lg font-bold">@lssm/lib.graphql-federation</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Adds Apollo Federation V2 support. Allows your subgraph to define
              keys and entities, making it ready for a supergraph.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Installation</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`npm install @lssm/lib.graphql-core @lssm/lib.graphql-prisma @lssm/lib.graphql-federation`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Usage: Building a Schema</h2>
        <p className="text-muted-foreground">
          Here's how to assemble a federated GraphQL schema from your specs:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`import { builder } from '@lssm/lib.graphql-core';
import { registerContractsOnBuilder } from '@lssm/lib.contracts/server/graphql-pothos';
import { SpecRegistry } from '@lssm/lib.contracts';
import { MySpecs } from './specs';

// 1. Register contracts
const registry = new SpecRegistry();
registry.register(MySpecs);

// 2. Mount specs onto Pothos builder
registerContractsOnBuilder(builder, registry);

// 3. Build and print schema
const schema = builder.toSchema();
console.log(printSchema(schema));`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Features</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
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
