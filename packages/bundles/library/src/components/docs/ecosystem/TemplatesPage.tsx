import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';
import { StudioPrompt } from '../shared/StudioPrompt';

export function EcosystemTemplatesPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-3">
				<h1 className="font-bold text-4xl">Plugin authoring templates</h1>
				<p className="text-lg text-muted-foreground">
					Scaffold focused Cursor plugins for ContractSpec product and core
					libraries.
				</p>
			</div>

			<div className="card-subtle space-y-4 p-6">
				<h2 className="font-bold text-2xl">Create a focused plugin</h2>
				<p className="text-muted-foreground text-sm">
					Start from a scoped domain and keep each plugin aligned to one product
					or library surface.
				</p>
				<CodeBlock
					language="bash"
					filename="catalog-authoring-layout"
					code={`packages/apps-registry/cursor-marketplace/
  plugins/
    <plugin-name>/
      .cursor-plugin/plugin.json
      rules/
      commands/
      agents/
      skills/
      .mcp.json`}
				/>
			</div>

			<div className="card-subtle space-y-4 p-6">
				<h2 className="font-bold text-2xl">Template outputs</h2>
				<ul className="space-y-2 text-muted-foreground text-sm">
					<li>.cursor-plugin/plugin.json with plugin metadata and paths</li>
					<li>rules/, commands/, agents/, and skills/ content directories</li>
					<li>.mcp.json with all MCP server declarations used by the plugin</li>
					<li>README.md describing scope and governance boundaries</li>
				</ul>
			</div>

			<div className="card-subtle space-y-4 p-6">
				<h2 className="font-bold text-2xl">Validate before submission</h2>
				<CodeBlock
					language="bash"
					filename="validate-marketplace-catalog"
					code={`# Validate all plugins referenced by root marketplace manifest
bun run plugin:contractspec:validate

# Optional in offline environments
SKIP_PLUGIN_NETWORK_CHECK=1 bun run plugin:contractspec:validate`}
				/>
			</div>

			<StudioPrompt
				title="Need evidence-backed template iteration?"
				body="Studio helps teams prioritize template changes from real product signals and export implementation-ready task packs."
			/>

			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/ecosystem/plugins" className="btn-primary">
					Marketplace plugins <ChevronRight size={16} />
				</Link>
				<Link href="/docs/ecosystem/registry" className="btn-ghost">
					Marketplace manifest
				</Link>
			</div>
		</div>
	);
}
