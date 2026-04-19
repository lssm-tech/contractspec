import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function CompatibilityPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h1 className="font-bold text-4xl">Compatibility</h1>
				<p className="text-lg text-muted-foreground">
					Supported runtimes, frameworks, and agent modes for ContractSpec.
				</p>
			</div>

			<div className="space-y-6">
				<div className="card-subtle space-y-3 p-6">
					<h2 className="font-bold text-2xl">Runtimes</h2>
					<ul className="space-y-2 text-muted-foreground">
						<li>Node.js 20+</li>
						<li>Bun 1.0+</li>
					</ul>
				</div>

				<div className="card-subtle space-y-3 p-6">
					<h2 className="font-bold text-2xl">Frameworks</h2>
					<ul className="space-y-2 text-muted-foreground">
						<li>Next.js 14+ (App Router preferred)</li>
						<li>Bun + Elysia or compatible HTTP servers</li>
					</ul>
				</div>

				<div className="card-subtle space-y-3 p-6">
					<h2 className="font-bold text-2xl">Package managers</h2>
					<ul className="space-y-2 text-muted-foreground">
						<li>bun (recommended)</li>
						<li>npm</li>
						<li>pnpm</li>
					</ul>
				</div>

				<div className="card-subtle space-y-3 p-6">
					<h2 className="font-bold text-2xl">AI agent modes</h2>
					<ul className="space-y-2 text-muted-foreground">
						<li>claude-code</li>
						<li>openai-codex</li>
						<li>cursor</li>
						<li>opencode</li>
						<li>simple (direct LLM)</li>
					</ul>
				</div>

				<div className="card-subtle space-y-3 p-6">
					<h2 className="font-bold text-2xl">Datastores</h2>
					<p className="text-muted-foreground">
						ContractSpec ships with Prisma-friendly defaults and can integrate
						with custom adapters for other databases.
					</p>
					<ul className="space-y-2 text-muted-foreground">
						<li>PostgreSQL via Prisma</li>
						<li>Custom adapters for other SQL/NoSQL stores</li>
					</ul>
				</div>

				<div className="card-subtle space-y-3 p-6">
					<h2 className="font-bold text-2xl">Cross-platform UI architecture</h2>
					<p className="text-muted-foreground">
						Need the React and React Native component compatibility story? Read{' '}
						<Link
							href="/docs/libraries/cross-platform-ui"
							className="text-[color:var(--rust)] underline underline-offset-4"
						>
							Cross-platform UI
						</Link>{' '}
						for the runtime and UI-layer split.
					</p>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-3 pt-2">
				<Link href="/docs/getting-started/start-here" className="btn-ghost">
					Start here
				</Link>
				<Link
					href="/docs/getting-started/troubleshooting"
					className="btn-ghost"
				>
					Troubleshooting
				</Link>
				<Link href="/docs/getting-started/installation" className="btn-primary">
					Next: Installation <ChevronRight size={16} />
				</Link>
			</div>
		</div>
	);
}
