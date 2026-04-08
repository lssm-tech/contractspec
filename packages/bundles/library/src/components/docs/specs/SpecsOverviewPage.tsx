import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

const specTypes = [
	{
		title: 'Capabilities',
		body: 'Model operations, events, and presentations as explicit system behavior.',
		href: '/docs/specs/capabilities',
	},
	{
		title: 'Data views',
		body: 'Describe query, filtering, and presentation behavior from the same source model.',
		href: '/docs/specs/dataviews',
	},
	{
		title: 'Workflows',
		body: 'Coordinate multi-step execution, retries, monitoring, and hand-offs.',
		href: '/docs/specs/workflows',
	},
	{
		title: 'Policy',
		body: 'Carry governance and access rules through every generated and runtime-served surface.',
		href: '/docs/specs/policy',
	},
	{
		title: 'Overlays',
		body: 'Customize generated surfaces safely instead of forking them permanently.',
		href: '/docs/specs/overlays',
	},
	{
		title: 'Safety and migration',
		body: 'Keep change safe with signing, audits, rollbacks, and explicit migration behavior.',
		href: '/docs/safety',
	},
];

const implementedPacks = [
	{
		title: 'Module bundles',
		body: 'Define typed surface bundles that resolve into auditable runtime plans instead of hand-built page logic.',
		href: '/docs/specs/module-bundles',
	},
	{
		title: 'ContractSpec Connect',
		body: 'Put coding-agent edits and commands behind local-first context, verification, replay, and review artifacts.',
		href: '/docs/specs/connect',
	},
	{
		title: 'Builder control plane',
		body: 'Coordinate multimodal authoring, provider routing, readiness, export, and mobile review on top of OSS and Studio.',
		href: '/docs/specs/builder-control-plane',
	},
];

export function SpecsOverviewPage() {
	return (
		<div className="space-y-10">
			<div className="space-y-3">
				<p className="editorial-kicker">Core model</p>
				<h1 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
					Contracts are the durable system boundary.
				</h1>
				<p className="max-w-3xl text-lg text-muted-foreground leading-8">
					ContractSpec uses explicit TypeScript specs to describe behavior
					before it spreads across APIs, UI, data models, events, and operator
					flows. The goal is not to hide implementation. The goal is to make the
					system boundary explicit enough that generation, validation, runtime
					enforcement, and regeneration can stay coherent.
				</p>
			</div>

			<div className="editorial-proof-strip">
				<div className="editorial-stat">
					<span className="editorial-label">System promise</span>
					<span className="editorial-stat-value">
						one contract → many surfaces
					</span>
				</div>
				<p className="max-w-2xl text-muted-foreground text-sm leading-7">
					Use the contract layer to keep surface behavior aligned, then let
					runtimes and generators do the repetitive work without inventing a
					closed platform.
				</p>
			</div>

			<section className="editorial-panel space-y-5">
				<div className="space-y-2">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						What the contract layer owns
					</h2>
					<ul className="editorial-list">
						<li>
							<span className="editorial-list-marker" />
							<span>
								Behavior: operations, events, presentations, workflows.
							</span>
						</li>
						<li>
							<span className="editorial-list-marker" />
							<span>Validation: input, output, and schema boundaries.</span>
						</li>
						<li>
							<span className="editorial-list-marker" />
							<span>
								Governance: policy, auditability, and migration rules.
							</span>
						</li>
						<li>
							<span className="editorial-list-marker" />
							<span>
								Surface alignment: generated or served behavior across API, UI,
								data, and agent-facing interfaces.
							</span>
						</li>
					</ul>
				</div>
			</section>

			<section className="space-y-5">
				<div className="space-y-2">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						Specification types
					</h2>
					<p className="text-muted-foreground text-sm leading-7">
						You can adopt the model one part at a time. Not every system needs
						every spec type on day one.
					</p>
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					{specTypes.map((item) => (
						<Link key={item.title} href={item.href} className="editorial-panel">
							<h3 className="font-semibold text-xl">{item.title}</h3>
							<p className="mt-2 text-muted-foreground text-sm leading-7">
								{item.body}
							</p>
							<div className="mt-4 flex items-center gap-2 text-[color:var(--rust)] text-sm">
								Open section <ChevronRight size={14} />
							</div>
						</Link>
					))}
				</div>
			</section>

			<section className="space-y-5">
				<div className="space-y-2">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						Implemented spec packs
					</h2>
					<p className="text-muted-foreground text-sm leading-7">
						These packs combine multiple contract surfaces into higher-order
						systems you can use directly today: agent enforcement, AI-native
						surface runtime, and governed Builder authoring.
					</p>
				</div>
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{implementedPacks.map((item) => (
						<Link key={item.title} href={item.href} className="editorial-panel">
							<h3 className="font-semibold text-xl">{item.title}</h3>
							<p className="mt-2 text-muted-foreground text-sm leading-7">
								{item.body}
							</p>
							<div className="mt-4 flex items-center gap-2 text-[color:var(--rust)] text-sm">
								Open pack <ChevronRight size={14} />
							</div>
						</Link>
					))}
				</div>
			</section>
		</div>
	);
}
