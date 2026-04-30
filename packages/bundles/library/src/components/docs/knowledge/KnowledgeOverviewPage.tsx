import Link from '@contractspec/lib.ui-link';

const knowledgeTracks = [
	{
		title: 'Categories',
		body: 'Separate canonical truth from operational notes, external material, and ephemeral working context.',
		href: '/docs/knowledge/categories',
	},
	{
		title: 'Spaces',
		body: 'Define the storage and retrieval boundary for each knowledge domain.',
		href: '/docs/knowledge/spaces',
	},
	{
		title: 'Sources',
		body: 'Connect tenant-owned sources explicitly instead of letting context leak in through prompts alone.',
		href: '/docs/knowledge/sources',
	},
	{
		title: 'Governance',
		body: 'Gate provider-backed mutations with dry-runs, approvals, idempotency, audit evidence, and outbound-send policy.',
		href: '/docs/knowledge/governance',
	},
	{
		title: 'Provider-backed adoption',
		body: 'Wire Gmail and Google Drive ingestion through checkpointed deltas, tombstones, watches, and Connect evidence.',
		href: '/docs/guides/provider-backed-knowledge',
	},
	{
		title: 'Examples',
		body: 'See how support, compliance, and product systems consume trusted knowledge at runtime.',
		href: '/docs/knowledge/examples',
	},
];

export function KnowledgeOverviewPage() {
	return (
		<div className="space-y-10">
			<div className="space-y-3">
				<p className="editorial-kicker">Operate</p>
				<h1 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
					Knowledge is part of the runtime, not a sidecar prompt hack.
				</h1>
				<p className="max-w-3xl text-lg text-muted-foreground leading-8">
					When AI-native systems depend on external context, the context needs
					the same discipline as the rest of the stack. ContractSpec treats
					knowledge as typed, bounded, and governable so teams can reason about
					trust, isolation, and retrieval behavior.
				</p>
			</div>

			<section className="editorial-panel space-y-5">
				<div className="space-y-2">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						How knowledge enters the system
					</h2>
					<ul className="editorial-list">
						<li>
							<span className="editorial-list-marker" />
							<span>
								Define the trust category and retrieval expectations first.
							</span>
						</li>
						<li>
							<span className="editorial-list-marker" />
							<span>
								Bind tenant-owned sources explicitly to those knowledge spaces.
							</span>
						</li>
						<li>
							<span className="editorial-list-marker" />
							<span>
								Consume knowledge through capabilities and workflows, not
								through invisible prompt assumptions.
							</span>
						</li>
					</ul>
				</div>
			</section>

			<div className="grid gap-4 md:grid-cols-2">
				{knowledgeTracks.map((item) => (
					<Link key={item.href} href={item.href} className="editorial-panel">
						<h2 className="font-semibold text-xl">{item.title}</h2>
						<p className="mt-2 text-muted-foreground text-sm leading-7">
							{item.body}
						</p>
					</Link>
				))}
			</div>
		</div>
	);
}
