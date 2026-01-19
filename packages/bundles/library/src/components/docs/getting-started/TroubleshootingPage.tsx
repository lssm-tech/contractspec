import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';
import { CodeBlock } from '@contractspec/lib.design-system';
import {
  analyticsEventNames,
  captureAnalyticsEvent,
} from '../../libs/posthog/client';

export function TroubleshootingPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Troubleshooting</h1>
        <p className="text-muted-foreground text-lg">
          Common issues and fixes when installing or generating with
          ContractSpec.
        </p>
      </div>

      <div className="space-y-6">
        <div className="card-subtle space-y-3 p-6">
          <h2 className="text-2xl font-bold">Command not found</h2>
          <ul className="text-muted-foreground space-y-2">
            <li>Reinstall the CLI and ensure it is in your PATH.</li>
            <li>Confirm Node.js 20+ or Bun 1.0+ is installed.</li>
          </ul>
        </div>

        <div className="card-subtle space-y-3 p-6">
          <h2 className="text-2xl font-bold">Specs not discovered</h2>
          <ul className="text-muted-foreground space-y-2">
            <li>
              Run <code>contractspec list</code> to see discovered specs.
            </li>
            <li>Verify your spec path conventions in .contractsrc.json.</li>
          </ul>
        </div>

        <div className="card-subtle space-y-3 p-6">
          <h2 className="text-2xl font-bold">Build or validate fails</h2>
          <ul className="text-muted-foreground space-y-2">
            <li>
              Run <code>contractspec validate</code> to surface schema errors.
            </li>
            <li>Check that generated files were not manually edited.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Diagnostics</h2>
          <CodeBlock
            language="bash"
            filename="troubleshooting-diagnostics"
            onCopy={() =>
              captureAnalyticsEvent(analyticsEventNames.COPY_COMMAND_CLICK, {
                surface: 'troubleshooting',
                location: 'diagnostics',
                filename: 'troubleshooting-diagnostics',
              })
            }
            code={`contractspec --version
contractspec list
contractspec validate src/contracts/mySpec.ts`}
          />
        </div>

        <div className="card-subtle space-y-3 p-6">
          <h2 className="text-2xl font-bold">Still blocked?</h2>
          <ul className="text-muted-foreground space-y-2">
            <li>
              Confirm compatibility requirements for runtime and framework.
            </li>
            <li>Re-run builds on a clean branch to isolate changes.</li>
            <li>Use a new spec and minimal adapter to validate setup.</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link href="/docs/getting-started/start-here" className="btn-ghost">
          Start here
        </Link>
        <Link href="/docs/getting-started/compatibility" className="btn-ghost">
          Compatibility
        </Link>
        <Link href="/docs/getting-started/installation" className="btn-primary">
          Next: Installation <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
