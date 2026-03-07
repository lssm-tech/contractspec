import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function EcosystemPluginsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">Cursor marketplace plugins</h1>
        <p className="text-muted-foreground text-lg">
          ContractSpec ships a focused Cursor marketplace catalog for the
          product and key libraries.
        </p>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Catalog at a glance</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li>
            <code>contractspec</code> - Product-level workflow and release
            guardrails.
          </li>
          <li>
            <code>contractspec-contracts-spec</code> -
            <code>@contractspec/lib.contracts-spec</code> governance.
          </li>
          <li>
            <code>contractspec-contracts-integrations</code> -
            <code>@contractspec/lib.contracts-integrations</code> governance.
          </li>
          <li>
            <code>contractspec-ai-agent</code> -
            <code>@contractspec/lib.ai-agent</code> orchestration guardrails.
          </li>
        </ul>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Where plugin sources live</h2>
          <p className="text-muted-foreground text-sm">
            Marketplace plugin sources are kept in a dedicated package so they
            can evolve with the monorepo safely.
          </p>
          <CodeBlock
            language="text"
            filename="catalog-layout"
            code={`packages/apps-registry/cursor-marketplace/
  plugins/
    contractspec/
    contractspec-contracts-spec/
    contractspec-contracts-integrations/
    contractspec-ai-agent/`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Root marketplace manifest</h2>
          <p className="text-muted-foreground text-sm">
            Cursor submission reads <code>.cursor-plugin/marketplace.json</code>{' '}
            at repository root and resolves each plugin source path.
          </p>
          <CodeBlock
            language="json"
            filename=".cursor-plugin/marketplace.json"
            code={`{
  "name": "contractspec-marketplace",
  "plugins": [
    {
      "name": "contractspec",
      "source": "packages/apps-registry/cursor-marketplace/plugins/contractspec"
    },
    {
      "name": "contractspec-contracts-spec",
      "source": "packages/apps-registry/cursor-marketplace/plugins/contractspec-contracts-spec"
    },
    {
      "name": "contractspec-contracts-integrations",
      "source": "packages/apps-registry/cursor-marketplace/plugins/contractspec-contracts-integrations"
    },
    {
      "name": "contractspec-ai-agent",
      "source": "packages/apps-registry/cursor-marketplace/plugins/contractspec-ai-agent"
    }
  ]
}`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Validation gate</h2>
          <p className="text-muted-foreground text-sm">
            Validate all marketplace plugins before publishing.
          </p>
          <CodeBlock
            language="bash"
            filename="validate-marketplace"
            code={`bun run plugin:contractspec:validate

# Optional when offline
SKIP_PLUGIN_NETWORK_CHECK=1 bun run plugin:contractspec:validate`}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/ecosystem/templates" className="btn-primary">
          Author a plugin <ChevronRight size={16} />
        </Link>
        <Link href="/docs/ecosystem/registry" className="btn-ghost">
          Manifest details
        </Link>
      </div>
    </div>
  );
}
