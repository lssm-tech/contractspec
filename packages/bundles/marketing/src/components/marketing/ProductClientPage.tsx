'use client';

import {
	analyticsEventNames,
	captureAnalyticsEvent,
} from '@contractspec/bundle.library/libs/posthog/client';
import {
	ArrowRight,
	Blocks,
	Bot,
	Braces,
	Captions,
	CheckCircle2,
	ClipboardCheck,
	Layers3,
	ShieldCheck,
	Sparkles,
} from 'lucide-react';
import Link from 'next/link';

const layers = [
	{
		name: 'Contracts and specs',
		copy: 'The canonical product rules your team wants the system to keep respecting over time.',
		icon: Braces,
	},
	{
		name: 'Generation and runtime bridges',
		copy: 'The adapters that turn those rules into API, UI, data, event, MCP, and client-facing surfaces.',
		icon: Layers3,
	},
	{
		name: 'Harness and proof workflows',
		copy: 'The inspection, replay, evaluation, and evidence surfaces that tell you whether automation is safe.',
		icon: ClipboardCheck,
	},
	{
		name: 'Studio operating product',
		copy: 'The opinionated team workflow for running evidence, drafts, review, exports, and checks on top of the same foundation.',
		icon: Sparkles,
	},
];

const comparison = [
	{
		label: 'OSS/Core',
		points: [
			'You want explicit contracts, safe regeneration, and standards-first outputs.',
			'You need to stabilize an existing product incrementally.',
			'You want the foundation without being forced into a hosted product loop.',
		],
	},
	{
		label: 'Studio',
		points: [
			'You want the operating surface for evidence, drafts, review, exports, and follow-up.',
			'You want packaged workflows and coordination on top of the same contract system.',
			'You want the product that absorbs more operational complexity for the team.',
		],
	},
];

const proofs = [
	{
		label: 'Explicit contracts, not inferred conventions',
		icon: ShieldCheck,
	},
	{
		label: 'Standard outputs the team can own and change',
		icon: Bot,
	},
	{
		label: 'Multi-surface consistency across API, UI, data, and tools',
		icon: Blocks,
	},
	{
		label: 'Incremental adoption instead of rewrite-only adoption',
		icon: Captions,
	},
];

function trackInstall() {
	captureAnalyticsEvent(analyticsEventNames.CTA_INSTALL_CLICK, {
		surface: 'product-hero',
	});
}

function trackStudio() {
	captureAnalyticsEvent(analyticsEventNames.CTA_STUDIO_CLICK, {
		surface: 'product-hero',
	});
}

export const ProductClientPage = () => (
	<main>
		<section className="section-padding hero-gradient border-border/70 border-b">
			<div className="editorial-shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
				<div className="space-y-6">
					<p className="editorial-kicker">Product overview</p>
					<h1 className="editorial-title max-w-4xl">
						An open system for keeping AI-native products coherent.
					</h1>
					<p className="editorial-subtitle">
						ContractSpec is not one narrow generator. It is the explicit layer
						that lets teams define system behavior, keep multiple surfaces
						aligned, regenerate safely, and move into Studio when they want the
						operating product.
					</p>
					<div className="flex flex-col gap-3 sm:flex-row">
						<Link
							href="/install"
							className="btn-primary"
							onClick={trackInstall}
						>
							Start with OSS <ArrowRight className="ml-2 h-4 w-4" />
						</Link>
						<Link
							href="https://www.contractspec.studio"
							className="btn-ghost"
							onClick={trackStudio}
						>
							Explore Studio
						</Link>
					</div>
				</div>
				<div className="editorial-panel space-y-5">
					<p className="editorial-kicker">What the category really is</p>
					<h2 className="editorial-panel-title">
						Lead with the system, not just the generation step.
					</h2>
					<p className="text-muted-foreground text-sm leading-7">
						Generation matters, but it is not the whole story. The real value is
						that contracts, runtime adapters, proof surfaces, and the Studio
						operating loop all remain legible as parts of the same product
						system.
					</p>
					<div className="editorial-divider" />
					<div className="grid gap-4 md:grid-cols-2">
						<div className="rounded-[24px] border border-border/70 bg-muted/45 p-4">
							<p className="editorial-label">Better umbrella</p>
							<p className="mt-2 font-medium text-sm">
								Open spec system for AI-native software
							</p>
						</div>
						<div className="rounded-[24px] border border-border/70 bg-muted/45 p-4">
							<p className="editorial-label">Where “compiler” belongs</p>
							<p className="mt-2 font-medium text-sm">
								Inside the technical proof, not as the whole company category
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section className="editorial-section">
			<div className="editorial-shell space-y-8">
				<div className="max-w-3xl space-y-4">
					<p className="editorial-kicker">Architecture by layer</p>
					<h2 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
						Each layer exists to keep the next one from drifting.
					</h2>
					<p className="editorial-copy">
						The repo structure already tells the right story: lower layers
						define explicit behavior, higher layers compose that behavior into
						working surfaces, and apps stay thin.
					</p>
				</div>
				<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
					{layers.map((layer) => (
						<div key={layer.name} className="editorial-panel">
							<layer.icon className="h-5 w-5 text-[color:var(--rust)]" />
							<h3 className="mt-5 font-serif text-2xl tracking-[-0.03em]">
								{layer.name}
							</h3>
							<p className="mt-3 text-muted-foreground text-sm leading-7">
								{layer.copy}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>

		<section className="editorial-section bg-striped">
			<div className="editorial-shell grid gap-8 lg:grid-cols-2">
				{comparison.map((column) => (
					<div key={column.label} className="editorial-panel">
						<p className="editorial-kicker">{column.label}</p>
						<h2 className="mt-3 font-serif text-3xl tracking-[-0.04em]">
							{column.label === 'OSS/Core'
								? 'Adopt the open foundation first'
								: 'Add the operating product when the team is ready'}
						</h2>
						<ul className="editorial-list mt-6">
							{column.points.map((point) => (
								<li key={point}>
									<CheckCircle2 className="mt-1.5 h-4 w-4 shrink-0 text-[color:var(--success)]" />
									<span>{point}</span>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</section>

		<section className="editorial-section">
			<div className="editorial-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
				<div className="space-y-4">
					<p className="editorial-kicker">Proof points</p>
					<h2 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
						What should feel different after adoption.
					</h2>
					<p className="editorial-copy">
						The point is not just faster output. The point is that regeneration,
						refactoring, and agent behavior stop feeling opaque because the team
						has an explicit layer it can inspect and trust.
					</p>
				</div>
				<div className="grid gap-5 md:grid-cols-2">
					{proofs.map((proof) => {
						const Icon = proof.icon;
						return (
							<div key={proof.label} className="editorial-panel">
								<Icon className="h-5 w-5 text-[color:var(--blue)]" />
								<p className="mt-5 font-medium text-lg">{proof.label}</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>

		<section className="section-padding">
			<div className="editorial-shell">
				<div className="editorial-panel flex flex-col gap-8 rounded-[38px] border-dashed md:flex-row md:items-end md:justify-between">
					<div className="max-w-3xl space-y-4">
						<p className="editorial-kicker">Next step</p>
						<h2 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
							Use the OSS layer when you want control. Use Studio when you want
							the operating loop.
						</h2>
						<p className="editorial-copy">
							That is the cleanest product split for both technical adopters and
							teams buying the packaged surface later.
						</p>
					</div>
					<div className="flex flex-col gap-3 sm:flex-row md:flex-col">
						<Link
							href="/install"
							className="btn-primary"
							onClick={trackInstall}
						>
							Start with OSS
						</Link>
						<Link
							href="https://www.contractspec.studio"
							className="btn-ghost"
							onClick={trackStudio}
						>
							Explore Studio
						</Link>
					</div>
				</div>
			</div>
		</section>
	</main>
);
