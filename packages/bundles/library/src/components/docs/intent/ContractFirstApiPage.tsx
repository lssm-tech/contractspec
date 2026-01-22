import type { Metadata } from 'next';
import { contractFirstApiBrief } from '@contractspec/bundle.library/components/docs/intent/intent-pages.docblocks';
import { SeoOptimizer } from '@contractspec/lib.content-gen/seo';
import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = new SeoOptimizer().optimize(
  contractFirstApiBrief
);

export function ContractFirstApiPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">{contractFirstApiBrief.title}</h1>
        <p className="text-muted-foreground text-lg">
          {contractFirstApiBrief.summary}
        </p>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Problems Solved</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          {contractFirstApiBrief.problems.map((problem, index) => (
            <li key={index}>{problem}</li>
          ))}
        </ul>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Solutions</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          {contractFirstApiBrief.solutions.map((solution, index) => (
            <li key={index}>{solution}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Quick Start</h2>
          <p className="text-muted-foreground text-sm">
            Define your first API contract and generate consistent
            implementations.
          </p>
          <CodeBlock
            language="typescript"
            filename="src/contracts/user-create.operation.ts"
            code={`import { defineOperation } from '@contractspec/lib.contracts/operations';
import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

export const CreateUserOperation = defineOperation({
  goal: 'Create a new user account with validation',
  context: 'Used by frontend registration forms and internal admin tools',
  input: new SchemaModel({
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        required: true,
      },
      password: {
        type: 'string',
        minLength: 8,
        required: true,
      },
    },
  }),
  output: new SchemaModel({
    type: 'object',
    properties: {
      id: { type: 'string', required: true },
      email: { type: 'string', required: true },
      createdAt: { type: 'string', format: 'date-time', required: true },
    },
  }),
  metadata: {
    name: 'createUser',
    tags: ['users', 'auth'],
    description: 'Create a new user account with email and password',
  },
});`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Generate OpenAPI</h2>
          <p className="text-muted-foreground text-sm">
            Export OpenAPI documentation directly from your contracts.
          </p>
          <CodeBlock
            language="bash"
            filename="export-openapi"
            code={`contractspec openapi export \\
  --registry ./src/contracts/registry.ts \\
  --out ./openapi.json`}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/guides/nextjs-one-endpoint" className="btn-primary">
          Next.js Guide <ChevronRight size={16} />
        </Link>
        <Link href="/docs/intent/spec-driven-development" className="btn-ghost">
          Spec-driven Development
        </Link>
      </div>
    </div>
  );
}
