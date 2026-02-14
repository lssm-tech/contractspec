import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';
import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';

export function LibrariesContractsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">@contractspec/lib.contracts-spec</h1>
        <p className="text-muted-foreground text-lg">
          The core library for defining what your application can do. Unified
          specifications for Operations, Events, Presentations, and Features.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Installation</h2>
        <InstallCommand
          package={['@contractspec/lib.contracts-spec', '@contractspec/lib.schema']}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">What lives where</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>@contractspec/lib.contracts-spec</strong> (root): The core
            contracts definitions (OperationSpec, PresentationSpec, Registry).
          </li>
          <li>
            <strong>@contractspec/lib.contracts-runtime-client-react</strong>: Browser-safe
            helpers (React renderers, client SDK). Import this for web/React
            Native.
          </li>
          <li>
            <strong>@contractspec/lib.contracts-runtime-server-rest</strong>: HTTP/MCP
            adapters, registries, integrations (Node-only).
          </li>
          <li>
            <strong>@contractspec/lib.schema</strong>: Schema dictionary
            (SchemaModel, FieldType) for I/O definitions.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Quick Example</h2>
        <CodeBlock
          language="typescript"
          code={`import { defineCommand } from '@contractspec/lib.contracts-spec';
import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

const CreateUserInput = new SchemaModel({
  name: 'CreateUserInput',
  fields: {
    email: { type: ScalarTypeEnum.Email(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
  },
});

export const CreateUser = defineCommand({
  meta: {
    key: 'users.createUser',
    version: '1.0.0',
    description: 'Create a new user account',
  },
  io: {
    input: CreateUserInput,
    output: /* ... */,
  },
  policy: { auth: 'admin' },
});`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Core Concepts</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>OperationSpec</strong>: Immutable description of an
            operation (Command or Query). Defines I/O, policy, and metadata.
          </li>
          <li>
            <strong>OperationSpecRegistry</strong>: Registry of specs +
            handlers. Use <code className="font-mono text-xs">installOp</code>{' '}
            to attach a handler.
          </li>
          <li>
            <strong>CapabilitySpec</strong>: Canonical capability declaration
            (requires/provides).
          </li>
          <li>
            <strong>PolicySpec</strong>: Declarative policy rules (ABAC/ReBAC,
            rate limits).
          </li>
          <li>
            <strong>TelemetrySpec</strong>: Analytics definitions and privacy
            levels.
          </li>
          <li>
            <strong>PresentationSpec (V2)</strong>: Describes how data is
            rendered (Web Components, Markdown, Data).
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Lifecycle</h2>
        <ol className="text-muted-foreground list-inside list-decimal space-y-2">
          <li>
            <strong>Define</strong> the spec (I/O via SchemaModel or Zod).
          </li>
          <li>
            <strong>Register</strong> it:{' '}
            <code className="font-mono text-xs">
              installOp(registry, spec, handler)
            </code>
            .
          </li>
          <li>
            <strong>Expose</strong> it via an adapter (REST, GraphQL, MCP).
          </li>
          <li>
            <strong>Validate</strong> at runtime automatically.
          </li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Adapters</h2>
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
