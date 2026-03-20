import Link from '@contractspec/lib.ui-link';

const safetyPages = [
	{
		title: 'Spec signing',
		body: 'Protect the integrity of what gets deployed and make changes verifiable.',
		href: '/docs/safety/signing',
	},
	{
		title: 'Policy decision points',
		body: 'Apply governance consistently across operations, data access, and generated surfaces.',
		href: '/docs/safety/pdp',
	},
	{
		title: 'Audit trails',
		body: 'Record operational and policy decisions with enough context to inspect and explain them later.',
		href: '/docs/safety/auditing',
	},
	{
		title: 'Migrations',
		body: 'Evolve data and schema boundaries without losing control of the system.',
		href: '/docs/safety/migrations',
	},
	{
		title: 'Tenant isolation',
		body: 'Keep configuration, access rules, and sensitive data bounded by tenant.',
		href: '/docs/safety/tenant-isolation',
	},
	{
		title: 'Security and trust',
		body: 'Understand the trust model, release process, and security expectations around the OSS system.',
		href: '/docs/safety/security-trust',
	},
];

export function SafetyOverviewPage() {
	return (
		<div className="space-y-10">
			<div className="space-y-3">
				<p className="editorial-kicker">Operate</p>
				<h1 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
					Safety is part of the system model, not an afterthought.
				</h1>
				<p className="max-w-3xl text-lg text-muted-foreground leading-8">
					ContractSpec is meant to survive real change: new generated surfaces,
					policy updates, migrations, integration churn, and operator handoffs.
					The safety layer makes those changes inspectable, reversible, and
					governed.
				</p>
			</div>

			<div className="editorial-proof-strip">
				<div className="editorial-stat">
					<span className="editorial-label">Operating rule</span>
					<span className="editorial-stat-value">
						explicit change beats hidden mutation
					</span>
				</div>
				<p className="max-w-2xl text-muted-foreground text-sm leading-7">
					Use policies, signing, audit trails, and migrations to keep the system
					legible even as AI-assisted workflows accelerate change volume.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{safetyPages.map((page) => (
					<Link key={page.href} href={page.href} className="editorial-panel">
						<h2 className="font-semibold text-xl">{page.title}</h2>
						<p className="mt-2 text-muted-foreground text-sm leading-7">
							{page.body}
						</p>
					</Link>
				))}
			</div>
		</div>
	);
}
