import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';
import { StudioPrompt } from '../shared/StudioPrompt';

export function GuideGenerateDocsClientsSchemasPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">Generate docs + client schemas</h1>
        <p className="text-muted-foreground text-lg">
          Generate docs and OpenAPI output from ContractSpec operations to power
          SDKs, docs sites, and tooling.
        </p>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">What you'll build</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li>Export docs from your specs.</li>
          <li>Emit OpenAPI 3.1 for client SDK generation.</li>
          <li>Keep outputs deterministic with CI validation.</li>
        </ul>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">1) Generate docs</h2>
          <p className="text-muted-foreground text-sm">
            Use the generator to emit docs from your contracts.
          </p>
          <CodeBlock
            language="bash"
            filename="generate-docs"
            code={`contractspec generate`}
          />
          <p className="text-muted-foreground text-sm">
            Expected output: <code>Generate X doc files in generated/docs</code>
            .
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">2) Export OpenAPI</h2>
          <p className="text-muted-foreground text-sm">
            Export an OpenAPI document from your registry module.
          </p>
          <CodeBlock
            language="bash"
            filename="openapi-export"
            code={`contractspec openapi export --registry ./src/contracts/registry.ts --out ./generated/openapi.json`}
          />
          <p className="text-muted-foreground text-sm">
            Expected output:{' '}
            <code>OpenAPI written to .../generated/openapi.json</code>.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">3) Validate specs</h2>
          <CodeBlock
            language="bash"
            filename="validate-specs"
            code={`contractspec validate`}
          />
          <p className="text-muted-foreground text-sm">
            Expected output: <code>Validation passed</code>.
          </p>
        </div>

        <div className="card-subtle space-y-3 p-6">
          <h3 className="text-lg font-semibold">Example package</h3>
          <p className="text-muted-foreground text-sm">
            The Integration Hub example provides a full registry of operations
            and is a good source for OpenAPI exports.
          </p>
          <CodeBlock
            language="bash"
            filename="integration-hub-example"
            code={`contractspec examples show integration-hub

# openapi export against your registry module
contractspec openapi export --registry ./src/contracts/registry.ts --out ./generated/openapi.json`}
          />
        </div>

        <StudioPrompt
          title="Want managed schema releases?"
          body="Studio can publish OpenAPI, SDKs, and release notes automatically with approvals."
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link
          href="/docs/guides/docs-generation-pipeline"
          className="btn-primary"
        >
          Next: Docs pipeline <ChevronRight size={16} />
        </Link>
        <Link href="/docs/guides" className="btn-ghost">
          Back to guides
        </Link>
      </div>
    </div>
  );
}
