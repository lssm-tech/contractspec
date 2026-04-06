import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function EcosystemPluginsPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-3">
				<h1 className="font-bold text-4xl">Cursor marketplace plugins</h1>
				<p className="text-lg text-muted-foreground">
					ContractSpec ships a focused Cursor marketplace catalog for the
					product and key libraries.
				</p>
			</div>

			<div className="card-subtle space-y-4 p-6">
				<h2 className="font-bold text-2xl">Catalog at a glance</h2>
				<ul className="space-y-2 text-muted-foreground text-sm">
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
					<h2 className="font-bold text-2xl">Where plugin sources live</h2>
					<p className="text-muted-foreground text-sm">
						Marketplace plugin artifacts are kept in a dedicated package, while
						the canonical reusable source lives in agentpacks under `packs/`.
					</p>
					<CodeBlock
						language="text"
						filename="catalog-layout"
						code={`packages/apps-registry/cursor-marketplace/
  .cursor-plugin/marketplace.json
  plugins/
    contractspec/
    contractspec-contracts-spec/
    contractspec-contracts-integrations/
    contractspec-ai-agent/

packs/
  contractspec-contracts-spec/`}
					/>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">Root marketplace manifest</h2>
					<p className="text-muted-foreground text-sm">
						Cursor submission reads the catalog manifest inside the marketplace
						package and resolves plugin paths relative to that package.
					</p>
					<CodeBlock
						language="json"
						filename="packages/apps-registry/cursor-marketplace/.cursor-plugin/marketplace.json"
						code={`{
  "name": "contractspec-marketplace",
  "owner": { "name": "ContractSpec Team" },
  "plugins": [
    {
      "name": "contractspec",
      "source": "plugins/contractspec"
    },
    {
      "name": "contractspec-contracts-spec",
      "source": "plugins/contractspec-contracts-spec"
    },
    {
      "name": "contractspec-contracts-integrations",
      "source": "plugins/contractspec-contracts-integrations"
    },
    {
      "name": "contractspec-ai-agent",
      "source": "plugins/contractspec-ai-agent"
    }
  ]
}`}
					/>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">Generated multi-host system</h2>
					<p className="text-muted-foreground text-sm">
						The Cursor plugin is publishable metadata only. Customer-facing
						Cursor, Claude Code, and Codex outputs are generated from the same
						pack source with hook and MCP delivery.
					</p>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">Validation gate</h2>
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
