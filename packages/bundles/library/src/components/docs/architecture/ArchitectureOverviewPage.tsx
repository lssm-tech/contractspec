import Link from '@contractspec/lib.ui-link';

const layers = [
	{
		title: 'Contracts and schemas',
		body: 'Explicit specs define the durable boundary for behavior, data, and governance.',
	},
	{
		title: 'Bindings and configuration',
		body: 'Apps, tenants, integrations, and knowledge sources are wired through explicit configuration instead of hidden glue.',
	},
	{
		title: 'Runtimes and generators',
		body: 'Serve or generate aligned surfaces for API, UI, workflows, docs, and agent-facing interfaces.',
	},
	{
		title: 'Operate and observe',
		body: 'Carry auditability, policy, tracing, migrations, and tenant isolation through the same model.',
	},
];

export function ArchitectureOverviewPage() {
	return (
		<div className="space-y-10">
			<div className="space-y-3">
				<p className="editorial-kicker">Build</p>
				<h1 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
					The architecture keeps contracts, runtime behavior, and operations in
					the same system.
				</h1>
				<p className="max-w-3xl text-lg text-muted-foreground leading-8">
					ContractSpec is not a single runtime. It is a layered system that lets
					you define explicit boundaries, bind real-world configuration, and
					then serve or generate aligned surfaces without losing control of the
					output.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{layers.map((layer) => (
					<article key={layer.title} className="editorial-panel space-y-3">
						<h2 className="font-semibold text-xl">{layer.title}</h2>
						<p className="text-muted-foreground text-sm leading-7">
							{layer.body}
						</p>
					</article>
				))}
			</div>

			<section className="editorial-panel space-y-5">
				<div className="space-y-2">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						Follow the architecture by responsibility
					</h2>
					<p className="text-muted-foreground text-sm leading-7">
						Use the architecture pages when you need to understand how the
						pieces snap together in a real deployment.
					</p>
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					<Link
						href="/docs/architecture/app-config"
						className="docs-footer-link"
					>
						<h3 className="font-semibold text-lg">App configuration</h3>
						<p className="text-muted-foreground text-sm leading-7">
							How blueprint-level and tenant-level config stay explicit and
							merge safely.
						</p>
					</Link>
					<Link
						href="/docs/architecture/integration-binding"
						className="docs-footer-link"
					>
						<h3 className="font-semibold text-lg">Integration binding</h3>
						<p className="text-muted-foreground text-sm leading-7">
							How apps connect to tenant-owned integrations without leaking
							provider logic everywhere.
						</p>
					</Link>
					<Link
						href="/docs/architecture/knowledge-binding"
						className="docs-footer-link"
					>
						<h3 className="font-semibold text-lg">Knowledge binding</h3>
						<p className="text-muted-foreground text-sm leading-7">
							How trusted knowledge enters the system and stays isolated by
							context and tenant.
						</p>
					</Link>
					<Link
						href="/docs/architecture/control-plane"
						className="docs-footer-link"
					>
						<h3 className="font-semibold text-lg">Control plane runtime</h3>
						<p className="text-muted-foreground text-sm leading-7">
							How intent, policy, planning, and execution flow through the
							system runtime.
						</p>
					</Link>
				</div>
			</section>
		</div>
	);
}
