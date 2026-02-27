import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function EcosystemRegistryPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">Marketplace manifest</h1>
        <p className="text-muted-foreground text-lg">
          ContractSpec publishes a multi-plugin Cursor marketplace catalog from
          a single root manifest.
        </p>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Root manifest shape</h2>
        <p className="text-muted-foreground text-sm">
          Cursor reads <code>.cursor-plugin/marketplace.json</code> at
          repository root and resolves each plugin source path.
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
    }
  ]
}`}
        />
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Per-plugin contract</h2>
        <p className="text-muted-foreground text-sm">
          Each plugin source must include a Cursor plugin manifest and
          composable assets.
        </p>
        <CodeBlock
          language="text"
          filename="plugin-layout"
          code={`plugins/<plugin-name>/
  .cursor-plugin/plugin.json
  rules/
  commands/
  agents/
  skills/
  .mcp.json`}
        />
        <CodeBlock
          language="bash"
          filename="validate-catalog"
          code={`bun run plugin:contractspec:validate

# Optional in offline environments
SKIP_PLUGIN_NETWORK_CHECK=1 bun run plugin:contractspec:validate`}
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/ecosystem/integrations" className="btn-primary">
          Integrations <ChevronRight size={16} />
        </Link>
        <Link href="/docs/ecosystem/templates" className="btn-ghost">
          Plugin authoring templates
        </Link>
      </div>
    </div>
  );
}
