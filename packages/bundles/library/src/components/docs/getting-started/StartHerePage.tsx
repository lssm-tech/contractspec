import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';
import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';

export function StartHerePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Start here</h1>
        <p className="text-muted-foreground text-lg">
          A fast onboarding path from install to your first generated contract.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Install the CLI</h2>
          <InstallCommand package="contractspec" dev />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Add core libraries</h2>
          <InstallCommand
            package={[
              '@contractspec/lib.contracts-spec',
              '@contractspec/lib.schema',
            ]}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Initialize your project</h2>
          <CodeBlock
            language="bash"
            filename="start-here-init"
            code={`bunx contractspec init`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Create your first contract</h2>
          <CodeBlock
            language="bash"
            filename="start-here-create"
            code={`contractspec create --type operation`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Generate implementation</h2>
          <CodeBlock
            language="bash"
            filename="start-here-build"
            code={`contractspec build src/contracts/mySpec.ts
contractspec validate src/contracts/mySpec.ts`}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link href="/docs/getting-started/hello-world" className="btn-primary">
          Next: Hello World <ChevronRight size={16} />
        </Link>
        <Link
          href="/docs/getting-started/troubleshooting"
          className="btn-ghost"
        >
          Troubleshooting
        </Link>
        <Link href="/docs/getting-started/compatibility" className="btn-ghost">
          Compatibility
        </Link>
      </div>
    </div>
  );
}
