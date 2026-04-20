'use client';

import { contractspecLandingStory } from '@contractspec/bundle.marketing/content';
import Link from 'next/link';
import { landingIconMap } from './landing-icons';

export function LandingPage() {
	const story = contractspecLandingStory;
	const ArrowRight = landingIconMap['arrow-right'];
	const BadgeIcon = landingIconMap[story.hero.badge.iconKey];

	return (
		<main>
			<section className="section-padding hero-gradient border-border/70 border-b">
				<div className="editorial-shell">
					<div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
						<div className="space-y-7">
							<div className="badge">
								<BadgeIcon size={14} />
								{story.hero.badge.label}
							</div>
							<div className="space-y-5">
								<p className="editorial-kicker">{story.hero.kicker}</p>
								<h1 className="editorial-title max-w-5xl">
									{story.hero.title}
								</h1>
								<p className="editorial-subtitle">{story.hero.subtitle}</p>
							</div>
							<div className="flex flex-col gap-3 sm:flex-row">
								{story.hero.ctas.map((cta, index) => (
									<Link
										key={cta.id}
										href={cta.href}
										className={
											cta.variant === 'primary' ? 'btn-primary' : 'btn-ghost'
										}
									>
										{cta.label}
										{index === 0 ? (
											<ArrowRight className="ml-2 h-4 w-4" />
										) : null}
									</Link>
								))}
							</div>
							<div className="editorial-proof-strip">
								{story.hero.proofStats.map((stat) => (
									<div key={stat.label} className="editorial-stat">
										<span className="editorial-stat-value">{stat.value}</span>
										<span className="editorial-label">{stat.label}</span>
									</div>
								))}
							</div>
						</div>

						<div className="editorial-panel space-y-6">
							<p className="editorial-kicker">{story.clarityPanel.kicker}</p>
							<div className="space-y-4">
								<h2 className="editorial-panel-title">
									{story.clarityPanel.title}
								</h2>
								<p className="editorial-copy text-sm">
									{story.clarityPanel.description}
								</p>
							</div>
							<ul className="editorial-list">
								{story.clarityPanel.points.map((point) => (
									<li key={point}>
										<span className="editorial-list-marker" />
										<span>{point}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</section>

			<section className="editorial-section">
				<div className="editorial-shell space-y-10">
					<div className="max-w-3xl space-y-4">
						<p className="editorial-kicker">{story.failureModes.kicker}</p>
						<h2 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
							{story.failureModes.title}
						</h2>
						<p className="editorial-copy">{story.failureModes.description}</p>
					</div>
					<div className="editorial-grid xl:grid-cols-3">
						{story.failureModes.items.map((item) => (
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
						<p className="editorial-kicker">{story.systemSurfaces.kicker}</p>
						<h2 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
							{story.systemSurfaces.title}
						</h2>
						<p className="editorial-copy">{story.systemSurfaces.description}</p>
					</div>
					<div className="editorial-grid">
						{story.systemSurfaces.items.map((surface) => {
							const Icon = surface.iconKey
								? landingIconMap[surface.iconKey]
								: null;
							return (
								<div key={surface.title} className="editorial-panel">
									{Icon ? (
										<Icon className="h-5 w-5 text-[color:var(--rust)]" />
									) : null}
									<h3 className="mt-5 font-serif text-2xl tracking-[-0.03em]">
										{surface.title}
									</h3>
									<p className="mt-3 text-muted-foreground text-sm leading-7">
										{surface.description}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			<section className="editorial-section">
				<div className="editorial-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
					<div className="space-y-4">
						<p className="editorial-kicker">{story.outputs.kicker}</p>
						<h2 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
							{story.outputs.title}
						</h2>
						<p className="editorial-copy">{story.outputs.description}</p>
					</div>
					<div className="grid gap-5 md:grid-cols-2">
						{story.outputs.items.map((output) => {
							const Icon = output.iconKey
								? landingIconMap[output.iconKey]
								: null;
							return (
								<div key={output.title} className="editorial-panel">
									{Icon ? (
										<Icon className="h-5 w-5 text-[color:var(--blue)]" />
									) : null}
									<h3 className="mt-5 font-serif text-2xl tracking-[-0.03em]">
										{output.title}
									</h3>
									<p className="mt-3 text-muted-foreground text-sm leading-7">
										{output.description}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			<section className="editorial-section bg-striped">
				<div className="editorial-shell grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
					<div className="editorial-panel space-y-6">
						<p className="editorial-kicker">{story.adoptionPath.kicker}</p>
						<h2 className="editorial-panel-title">
							{story.adoptionPath.title}
						</h2>
						<ol className="space-y-4">
							{story.adoptionPath.steps.map((step, index) => (
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
						<p className="editorial-kicker">{story.studio.kicker}</p>
						<h2 className="editorial-panel-title">{story.studio.title}</h2>
						<p className="text-muted-foreground text-sm leading-7">
							{story.studio.description}
						</p>
						<div className="editorial-divider" />
						<div className="grid gap-4 text-muted-foreground text-sm">
							{story.studio.summaries.map((summary) => (
								<p key={summary.label}>
									<span className="font-medium text-foreground">
										{summary.label}:
									</span>{' '}
									{summary.description}
								</p>
							))}
						</div>
					</div>
				</div>
			</section>

			<section className="section-padding">
				<div className="editorial-shell">
					<div className="editorial-panel flex flex-col gap-8 rounded-[40px] border-dashed px-6 py-8 md:px-10 md:py-10 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-3xl space-y-4">
							<p className="editorial-kicker">{story.finalCta.kicker}</p>
							<h2 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
								{story.finalCta.title}
							</h2>
							<p className="editorial-copy">{story.finalCta.description}</p>
						</div>
						<div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
							{story.finalCta.ctas.map((cta) => (
								<Link
									key={cta.id}
									href={cta.href}
									className={
										cta.variant === 'primary' ? 'btn-primary' : 'btn-ghost'
									}
								>
									{cta.label}
								</Link>
							))}
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
