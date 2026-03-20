'use client';

import {
	ArrowRight,
	Blocks,
	Bot,
	Braces,
	ChartColumn,
	Database,
	GitBranch,
	ShieldCheck,
	Sparkles,
	Workflow,
} from 'lucide-react';
import Link from 'next/link';

const failureModes = [
	{
		title: 'Implicit rules drift first',
		description:
			'Prompt chains and AI edits move faster than the product rules they are supposed to respect.',
	},
	{
		title: 'Surfaces stop agreeing',
		description:
			'API, UI, database, events, and MCP tools evolve independently unless something explicit keeps them aligned.',
	},
	{
		title: 'Teams lose safe regeneration',
		description:
			'Without a stable contract layer, every regeneration feels like rewriting production in the dark.',
	},
];

const systemSurfaces = [
	{
		label: 'Contracts and generation',
		description:
			'Define the canonical behavior once and derive the implementation surfaces from it.',
		icon: Braces,
	},
	{
		label: 'Runtime adapters',
		description:
			'Bind the same source of truth to REST, GraphQL, React, MCP, and operational flows.',
		icon: Workflow,
	},
	{
		label: 'Harness and proof',
		description:
			'Replay, evaluate, inspect, and verify how the system behaves before you trust automation with more.',
		icon: ChartColumn,
	},
	{
		label: 'Studio operating layer',
		description:
			'Run the opinionated product loop when you want coordination, governance, and a packaged operating surface.',
		icon: Sparkles,
	},
];

const outputs = [
	{
		title: 'APIs',
		copy: 'Typed endpoints and schemas stay aligned with the same contract language the team edits.',
		icon: GitBranch,
	},
	{
		title: 'Data',
		copy: 'Schema, validation, and migrations are shaped by the same product rules instead of scattered implementations.',
		icon: Database,
	},
	{
		title: 'Interfaces',
		copy: 'Forms, presentations, and client types inherit the same system boundaries instead of drifting from the backend.',
		icon: Blocks,
	},
	{
		title: 'Agents and tools',
		copy: 'MCP tools and agent-facing surfaces are generated from explicit contracts rather than guessed from code.',
		icon: Bot,
	},
];

const adoptionSteps = [
	'Start with one module that is already drifting or feels unsafe to regenerate.',
	'Define explicit contracts, then bring API, UI, data, and tools back into alignment.',
	'Adopt Studio when the team wants an operating surface on top of the open system.',
];

export function LandingPage() {
	return (
		<main>
			<section className="section-padding hero-gradient border-border/70 border-b">
				<div className="editorial-shell">
					<div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
						<div className="space-y-7">
							<div className="badge">
								<ShieldCheck size={14} />
								Open system, explicit control
							</div>
							<div className="space-y-5">
								<p className="editorial-kicker">
									ContractSpec for AI-native teams
								</p>
								<h1 className="editorial-title max-w-5xl">
									Build and run AI-native systems on explicit contracts.
								</h1>
								<p className="editorial-subtitle">
									ContractSpec gives teams an open spec system for defining
									behavior, aligning every surface, and regenerating safely. The
									OSS foundation stays yours. Studio is the operating layer when
									you want a product on top.
								</p>
							</div>
							<div className="flex flex-col gap-3 sm:flex-row">
								<Link href="/install" className="btn-primary">
									Start with OSS <ArrowRight className="ml-2 h-4 w-4" />
								</Link>
								<Link
									href="https://www.contractspec.studio"
									className="btn-ghost"
								>
									Explore Studio
								</Link>
								<Link href="/product" className="btn-ghost">
									See the architecture
								</Link>
							</div>
							<div className="editorial-proof-strip">
								<div className="editorial-stat">
									<span className="editorial-stat-value">1</span>
									<span className="editorial-label">
										explicit system source
									</span>
								</div>
								<div className="editorial-stat">
									<span className="editorial-stat-value">4+</span>
									<span className="editorial-label">
										aligned surface families
									</span>
								</div>
								<div className="editorial-stat">
									<span className="editorial-stat-value">0</span>
									<span className="editorial-label">required lock-in</span>
								</div>
							</div>
						</div>

						<div className="editorial-panel space-y-6">
							<p className="editorial-kicker">
								What the site should make clear
							</p>
							<div className="space-y-4">
								<h2 className="editorial-panel-title">
									This is not “yet another AI builder.”
								</h2>
								<p className="editorial-copy text-sm">
									ContractSpec exists for teams that already know AI can write a
									lot of software, but need explicit control over what that
									software is allowed to become over time.
								</p>
							</div>
							<ul className="editorial-list">
								<li>
									<span className="editorial-list-marker" />
									<span>Keep the code and the standards you already use.</span>
								</li>
								<li>
									<span className="editorial-list-marker" />
									<span>
										Stabilize one module at a time instead of rewriting your
										app.
									</span>
								</li>
								<li>
									<span className="editorial-list-marker" />
									<span>
										Move into Studio only when you want the operating product.
									</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</section>

			<section className="editorial-section">
				<div className="editorial-shell space-y-10">
					<div className="max-w-3xl space-y-4">
						<p className="editorial-kicker">Why teams end up here</p>
						<h2 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
							AI speed is not the problem. Implicit systems are.
						</h2>
						<p className="editorial-copy">
							Once a team depends on prompts, AI edits, and generated code
							across multiple surfaces, the real failure mode is not “AI wrote
							bad code.” It is that nobody can state the system rules precisely
							enough to keep regeneration safe.
						</p>
					</div>
					<div className="editorial-grid xl:grid-cols-3">
						{failureModes.map((item) => (
							<div key={item.title} className="editorial-panel">
								<p className="editorial-kicker">{item.title}</p>
								<p className="mt-4 text-base text-muted-foreground leading-8">
									{item.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="editorial-section bg-striped">
				<div className="editorial-shell space-y-10">
					<div className="max-w-3xl space-y-4">
						<p className="editorial-kicker">The open system</p>
						<h2 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
							One explicit layer that keeps the whole stack honest.
						</h2>
						<p className="editorial-copy">
							ContractSpec is broader than generation. It is the contract layer,
							the runtime bridges, the proof surfaces, and the adoption path
							that lets teams move from OSS control to an operating product
							without pretending they are different systems.
						</p>
					</div>
					<div className="editorial-grid">
						{systemSurfaces.map((surface) => (
							<div key={surface.label} className="editorial-panel">
								<surface.icon className="h-5 w-5 text-[color:var(--rust)]" />
								<h3 className="mt-5 font-serif text-2xl tracking-[-0.03em]">
									{surface.label}
								</h3>
								<p className="mt-3 text-muted-foreground text-sm leading-7">
									{surface.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="editorial-section">
				<div className="editorial-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
					<div className="space-y-4">
						<p className="editorial-kicker">
							What the OSS layer actually gives you
						</p>
						<h2 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
							Explicit contracts show up where teams usually lose control.
						</h2>
						<p className="editorial-copy">
							The promise is not magic generation. The promise is that the same
							product rules can shape APIs, data, interfaces, and agent tools
							without each surface inventing its own truth.
						</p>
					</div>
					<div className="grid gap-5 md:grid-cols-2">
						{outputs.map((output) => (
							<div key={output.title} className="editorial-panel">
								<output.icon className="h-5 w-5 text-[color:var(--blue)]" />
								<h3 className="mt-5 font-serif text-2xl tracking-[-0.03em]">
									{output.title}
								</h3>
								<p className="mt-3 text-muted-foreground text-sm leading-7">
									{output.copy}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="editorial-section bg-striped">
				<div className="editorial-shell grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
					<div className="editorial-panel space-y-6">
						<p className="editorial-kicker">Adoption path</p>
						<h2 className="editorial-panel-title">
							Start where the risk is highest, not where the marketing says to
							start.
						</h2>
						<ol className="space-y-4">
							{adoptionSteps.map((step, index) => (
								<li key={step} className="flex gap-4">
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgb(162_79_42_/_0.12)] font-mono text-[color:var(--rust)] text-xs">
										0{index + 1}
									</div>
									<p className="text-muted-foreground text-sm leading-7">
										{step}
									</p>
								</li>
							))}
						</ol>
					</div>

					<div className="editorial-panel space-y-6">
						<p className="editorial-kicker">Studio on top</p>
						<h2 className="editorial-panel-title">
							Studio is the operating surface, not a replacement identity.
						</h2>
						<p className="text-muted-foreground text-sm leading-7">
							Use Studio when your team wants a packaged loop for evidence,
							drafting, review, export, and follow-up. The relationship should
							feel like the best application built on top of the same open
							system, not a bait-and-switch away from it.
						</p>
						<div className="editorial-divider" />
						<div className="grid gap-4 text-muted-foreground text-sm">
							<p>
								<span className="font-medium text-foreground">OSS/Core:</span>{' '}
								contracts, generation, runtimes, harnesses, agent tooling.
							</p>
							<p>
								<span className="font-medium text-foreground">Studio:</span> the
								opinionated operating loop when a team wants the product.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="section-padding">
				<div className="editorial-shell">
					<div className="editorial-panel flex flex-col gap-8 rounded-[40px] border-dashed px-6 py-8 md:px-10 md:py-10 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-3xl space-y-4">
							<p className="editorial-kicker">Choose your path</p>
							<h2 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
								Adopt the open system first. Evaluate Studio when the team is
								ready for the operating layer.
							</h2>
							<p className="editorial-copy">
								That is the product story the site should tell everywhere: open
								foundation, explicit contracts, safe regeneration, then an
								opinionated surface on top for teams that want it.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
							<Link href="/install" className="btn-primary">
								Start with OSS
							</Link>
							<Link
								href="https://www.contractspec.studio"
								className="btn-ghost"
							>
								Explore Studio
							</Link>
							<Link href="/pricing" className="btn-ghost">
								See packaging
							</Link>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
