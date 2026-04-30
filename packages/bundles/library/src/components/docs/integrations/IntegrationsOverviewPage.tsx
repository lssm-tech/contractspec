import Link from '@contractspec/lib.ui-link';

const groups = [
	{
		title: 'Models and voice',
		items: [
			{ title: 'OpenAI', href: '/docs/integrations/openai' },
			{ title: 'Mistral', href: '/docs/integrations/mistral' },
			{ title: 'ElevenLabs', href: '/docs/integrations/elevenlabs' },
		],
	},
	{
		title: 'Messaging and product operations',
		items: [
			{ title: 'GitHub', href: '/docs/integrations/github' },
			{ title: 'Slack', href: '/docs/integrations/slack' },
			{ title: 'Twilio', href: '/docs/integrations/twilio' },
			{ title: 'Postmark', href: '/docs/integrations/postmark' },
		],
	},
	{
		title: 'Data, storage, and retrieval',
		items: [
			{ title: 'Qdrant', href: '/docs/integrations/qdrant' },
			{ title: 'S3 storage', href: '/docs/integrations/s3' },
			{ title: 'Gmail', href: '/docs/integrations/gmail' },
			{ title: 'Google Drive', href: '/docs/integrations/google-drive' },
			{ title: 'Google Calendar', href: '/docs/integrations/google-calendar' },
		],
	},
	{
		title: 'Payments and external workflows',
		items: [
			{ title: 'Stripe', href: '/docs/integrations/stripe' },
			{ title: 'Powens', href: '/docs/integrations/powens' },
			{
				title: 'Circuit breakers',
				href: '/docs/integrations/circuit-breakers',
			},
			{
				title: 'Health routing',
				href: '/docs/integrations/health-routing',
			},
		],
	},
];

export function IntegrationsOverviewPage() {
	return (
		<div className="space-y-10">
			<div className="space-y-3">
				<p className="editorial-kicker">Integrations</p>
				<h1 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
					Integrations stay explicit: spec what a provider offers, then bind it
					per tenant and per app.
				</h1>
				<p className="max-w-3xl text-lg text-muted-foreground leading-8">
					The integration model keeps provider behavior out of ad hoc glue code.
					Define the capability contract first, configure the provider
					connection explicitly, then bind the integration into app workflows
					and runtime surfaces with clear ownership.
				</p>
			</div>

			<div className="editorial-proof-strip">
				<div className="editorial-stat">
					<span className="editorial-label">Binding model</span>
					<span className="editorial-stat-value">
						Integration spec → tenant connection → app binding
					</span>
				</div>
				<p className="max-w-2xl text-muted-foreground text-sm leading-7">
					That separation is what makes reuse, tenant isolation, and provider
					swaps practical without rewriting every surface.
				</p>
			</div>

			<section className="editorial-panel space-y-5">
				<div className="space-y-2">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						Start with the model, then pick a provider
					</h2>
					<div className="grid gap-4 md:grid-cols-2">
						<Link
							href="/docs/integrations/spec-model"
							className="docs-footer-link"
						>
							<h3 className="font-semibold text-lg">Integration spec model</h3>
							<p className="text-muted-foreground text-sm leading-7">
								Define what the provider offers, what configuration it needs,
								and how the runtime should treat it.
							</p>
						</Link>
						<Link
							href="/docs/architecture/integration-binding"
							className="docs-footer-link"
						>
							<h3 className="font-semibold text-lg">Integration binding</h3>
							<p className="text-muted-foreground text-sm leading-7">
								Understand how tenant connections get mapped into concrete app
								surfaces and workflows.
							</p>
						</Link>
					</div>
				</div>
			</section>

			<div className="grid gap-5 md:grid-cols-2">
				{groups.map((group) => (
					<section key={group.title} className="editorial-panel space-y-4">
						<h2 className="font-serif text-2xl tracking-[-0.03em]">
							{group.title}
						</h2>
						<div className="space-y-3">
							{group.items.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="docs-chip-link"
								>
									{item.title}
								</Link>
							))}
						</div>
					</section>
				))}
			</div>
		</div>
	);
}
