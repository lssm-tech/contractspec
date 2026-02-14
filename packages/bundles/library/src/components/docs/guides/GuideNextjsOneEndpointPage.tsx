import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';
import { StudioPrompt } from '../shared/StudioPrompt';

export function GuideNextjsOneEndpointPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">Next.js: add one endpoint</h1>
        <p className="text-muted-foreground text-lg">
          Add ContractSpec to an existing Next.js App Router project by wiring a
          single operation end-to-end with validation and types.
        </p>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">What you'll build</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li>One OperationSpec with SchemaModel validation.</li>
          <li>A registry wiring the operation to its handler.</li>
          <li>A Next.js route handler that exposes the operation.</li>
        </ul>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">1) Install core packages</h2>
          <CodeBlock
            language="bash"
            filename="nextjs-install"
            code={`bun add -D contractspec
bun add @contractspec/lib.contracts-spec @contractspec/lib.contracts-runtime-server-rest @contractspec/lib.schema`}
          />
          <p className="text-muted-foreground text-sm">
            Expected output: <code>added 3 packages</code> and a lockfile
            update.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">2) Define the operation spec</h2>
          <p className="text-muted-foreground text-sm">
            Create <code>src/contracts/healthcheck.operation.ts</code>:
          </p>
          <CodeBlock
            language="typescript"
            filename="src/contracts/healthcheck.operation.ts"
            code={`import { defineQuery } from "@contractspec/lib.contracts-spec/operations";
import { SchemaModel, ScalarTypeEnum } from "@contractspec/lib.schema";

const HealthcheckOutput = new SchemaModel({
  name: "HealthcheckOutput",
  fields: {
    status: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    checkedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const HealthcheckQuery = defineQuery({
  meta: {
    key: "healthcheck.get",
    version: "1.0.0",
    description: "Return service health status",
    owners: ["@platform.core"],
    tags: ["health", "observability"],
  },
  io: {
    input: null,
    output: HealthcheckOutput,
  },
  policy: {
    auth: "public",
  },
  transport: {
    rest: { method: "GET" },
    gql: { field: "healthcheck_get" },
    mcp: { toolName: "healthcheck.get.v1" },
  },
});`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">3) Register the operation</h2>
          <p className="text-muted-foreground text-sm">
            Create <code>src/contracts/registry.ts</code>:
          </p>
          <CodeBlock
            language="typescript"
            filename="src/contracts/registry.ts"
            code={`import {
  OperationSpecRegistry,
  installOp,
} from "@contractspec/lib.contracts-spec/operations";
import { HealthcheckQuery } from "./healthcheck.operation";

export const registry = new OperationSpecRegistry();

installOp(registry, HealthcheckQuery, async () => ({
  status: "ok",
  checkedAt: new Date().toISOString(),
}));`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">4) Add the Next.js handler</h2>
          <p className="text-muted-foreground text-sm">
            Create <code>app/api/ops/[...route]/route.ts</code>:
          </p>
          <CodeBlock
            language="typescript"
            filename="app/api/ops/[...route]/route.ts"
            code={`import { makeNextAppHandler } from "@contractspec/lib.contracts-runtime-server-rest/rest-next-app";
import { registry } from "@/contracts/registry";

const handler = makeNextAppHandler(registry, async () => ({
  actor: "public",
  tenantId: "public",
}));

export { handler as GET, handler as POST };`}
          />
          <p className="text-muted-foreground text-sm">
            Expected output: the route responds at
            <code> /api/ops/healthcheck.get</code>.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">5) Validate the spec</h2>
          <CodeBlock
            language="bash"
            filename="nextjs-validate"
            code={`contractspec validate src/contracts/healthcheck.operation.ts`}
          />
          <p className="text-muted-foreground text-sm">
            Expected output: <code>Validation passed</code>.
          </p>
        </div>

        <div className="card-subtle space-y-3 p-6">
          <h3 className="text-lg font-semibold">Example package</h3>
          <p className="text-muted-foreground text-sm">
            Use <code>@contractspec/example.lifecycle-dashboard</code> as a
            lightweight Next.js snippet reference.
          </p>
          <CodeBlock
            language="bash"
            filename="nextjs-example"
            code={`# Inspect the example docs
contractspec examples show lifecycle-dashboard

# Validate all example manifests in this repo
contractspec examples validate --repo-root .`}
          />
        </div>

        <StudioPrompt
          title="Need team approvals for new endpoints?"
          body="Studio adds review gates, shared registries, and audit trails after you ship your first endpoint."
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link
          href="/docs/guides/spec-validation-and-typing"
          className="btn-primary"
        >
          Next: Spec validation + typing <ChevronRight size={16} />
        </Link>
        <Link href="/docs/guides" className="btn-ghost">
          Back to guides
        </Link>
      </div>
    </div>
  );
}
