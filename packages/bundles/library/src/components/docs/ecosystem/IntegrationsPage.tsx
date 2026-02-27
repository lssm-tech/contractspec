import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function EcosystemIntegrationsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">Integrations</h1>
        <p className="text-muted-foreground text-lg">
          Reference integrations show how to extend ContractSpec with real-world
          adapters and generators.
        </p>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Reference plugin</h2>
        <p className="text-muted-foreground text-sm">
          The example markdown generator plugin ships as a working reference
          implementation.
        </p>
        <CodeBlock
          language="bash"
          filename="install-example"
          code={`bun add @contractspec/lib.plugin.example-generator

# Or in a workspace
bun add -D @contractspec/lib.plugin.example-generator`}
        />
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Providers and adapters</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li>Payments: Stripe</li>
          <li>Email: Postmark, Gmail</li>
          <li>AI: OpenAI, Mistral</li>
          <li>Voice: ElevenLabs, Mistral</li>
          <li>Vector DB: Qdrant</li>
          <li>Storage: GCS</li>
        </ul>
        <p className="text-muted-foreground text-sm">
          Use provider modules as inspiration for adapter plugins.
        </p>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/ecosystem/registry" className="btn-primary">
          Marketplace manifest <ChevronRight size={16} />
        </Link>
        <Link href="/docs/ecosystem/templates" className="btn-ghost">
          Authoring templates
        </Link>
      </div>
    </div>
  );
}
