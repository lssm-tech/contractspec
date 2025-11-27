import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: '@lssm/lib.contracts: ContractSpec Docs',
  description:
    'Complete reference for the contracts library—define operations, events, and policies in pure TypeScript.',
};

export default function ContractsLibraryPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">@lssm/lib.contracts</h1>
        <p className="text-muted-foreground">
          Unified specifications for Operations, Events, Presentations, and
          Features. The core library for defining what your application can do.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Installation</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`npm install @lssm/lib.contracts @lssm/lib.schema
# or
bun add @lssm/lib.contracts @lssm/lib.schema`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Key Concepts</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Spec-First, TypeScript-First</strong>: Define operations in
            pure TypeScript (no YAML).
          </li>
          <li>
            <strong>Runtime Adapters</strong>: The `SpecRegistry` is passed to
            adapters to serve APIs dynamically. There is no intermediate
            "compile" step.
          </li>
          <li>
            <strong>Capabilities</strong>: `defineCommand` (writes) and
            `defineQuery` (reads) with Zod-backed I/O.
          </li>
          <li>
            <strong>Events</strong>: `defineEvent` for type-safe side effects.
          </li>
          <li>
            <strong>Presentations</strong>: (V2) Describe how data is rendered
            (Web Components, Markdown, Data).
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example: Define a Command</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`import { defineCommand } from '@lssm/lib.contracts';
import { SchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';

const UserInput = new SchemaModel({
  name: 'UserInput',
  fields: {
    email: { type: ScalarTypeEnum.Email(), isOptional: false },
  }
});

const UserOutput = new SchemaModel({
  name: 'UserOutput',
  fields: {
    id: { type: ScalarTypeEnum.String(), isOptional: false },
  }
});

export const CreateUser = defineCommand({
  meta: {
    name: 'user.create',
    version: 1,
    description: 'Register a new user',
    owners: ['team-auth'],
    tags: ['auth'],
    goal: 'Onboard users',
    context: 'Public registration',
    stability: 'stable',
  },
  io: {
    input: UserInput,
    output: UserOutput,
  },
  policy: {
    auth: 'anonymous',
  },
});`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example: Register and Serve</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`import { SpecRegistry, installOp } from '@lssm/lib.contracts';
import { makeNextAppHandler } from '@lssm/lib.contracts/server/rest-next-app';

const reg = new SpecRegistry();

installOp(reg, CreateUser, async (input, ctx) => {
  // Implementation logic here
  return { id: '123' };
});

// Serve via Next.js App Router
export const handler = makeNextAppHandler(reg, (req) => ({ 
  actor: 'anonymous' 
}));

export { handler as GET, handler as POST };`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Available Adapters</h2>
        <ul className="text-muted-foreground space-y-2">
          <li>
            <code className="bg-background/50 rounded px-2 py-1">
              server/rest-next-app
            </code>
            : Next.js App Router adapter
          </li>
          <li>
            <code className="bg-background/50 rounded px-2 py-1">
              server/provider-mcp
            </code>
            : Model Context Protocol (MCP) for AI agents
          </li>
          <li>
            <code className="bg-background/50 rounded px-2 py-1">
              server/graphql-pothos
            </code>
            : GraphQL schema generator
          </li>
          <li>
            <code className="bg-background/50 rounded px-2 py-1">
              server/rest-elysia
            </code>
            : Elysia (Bun) adapter
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/libraries/schema" className="btn-primary">
          Next: Schema <ChevronRight size={16} />
        </Link>
        <Link href="/docs/specs/capabilities" className="btn-ghost">
          Core Concepts
        </Link>
      </div>
    </div>
  );
}




















