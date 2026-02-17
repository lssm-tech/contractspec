import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';
import { StudioPrompt } from '../shared/StudioPrompt';

export function GuideCIDiffGatingPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">
          CI gating with deterministic diffs
        </h1>
        <p className="text-muted-foreground text-lg">
          Add ContractSpec CI checks that validate specs, detect drift, and gate
          breaking changes before merge.
        </p>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">What you'll build</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li>CI workflow running ContractSpec validation and drift checks.</li>
          <li>Machine-readable output for PR annotations.</li>
          <li>Deterministic contract diffs in review.</li>
        </ul>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">1) Add the CI workflow</h2>
          <p className="text-muted-foreground text-sm">
            Copy the template from the CLI package.
          </p>
          <CodeBlock
            language="bash"
            filename="ci-copy"
            code={`cp node_modules/@contractspec/app.cli-contractspec/templates/github-action.yml .github/workflows/contractspec.yml`}
          />
          <p className="text-muted-foreground text-sm">
            Expected output: new workflow file in <code>.github/workflows</code>
            .
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">2) Run CI locally</h2>
          <CodeBlock
            language="bash"
            filename="ci-local"
            code={`contractspec ci --format json --check-drift`}
          />
          <p className="text-muted-foreground text-sm">
            Expected output: JSON summary including pass/fail counts and drift
            status (if configured).
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">3) Add a diff check</h2>
          <p className="text-muted-foreground text-sm">
            Use the diff command to inspect breaking changes in PRs.
          </p>
          <CodeBlock
            language="bash"
            filename="ci-diff"
            code={`contractspec diff src/contracts/spec-v1.ts src/contracts/spec-v2.ts --breaking`}
          />
          <p className="text-muted-foreground text-sm">
            Expected output: deterministic diff with breaking change hints.
          </p>
        </div>

        <div className="card-subtle space-y-3 p-6">
          <h3 className="text-lg font-semibold">Example package</h3>
          <p className="text-muted-foreground text-sm">
            The CRM pipeline example is already wired in the quickstart smoke
            test. Use it as a CI-ready template.
          </p>
          <CodeBlock
            language="bash"
            filename="crm-ci"
            code={`cd packages/examples/crm-pipeline
bun run build
bun run validate`}
          />
        </div>

        <StudioPrompt
          title="Need continuous checks tied to outcomes?"
          body="Studio closes the loop with post-change verification and learning dividends that improve future decisions."
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/guides" className="btn-primary">
          Back to guides <ChevronRight size={16} />
        </Link>
        <Link href="/docs" className="btn-ghost">
          Docs home
        </Link>
      </div>
    </div>
  );
}
