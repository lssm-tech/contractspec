'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { StudioSignupSection } from './studio-signup-section';

const faqs = [
	{
		question: 'What stays free?',
		answer:
			'The OSS foundation stays free. Teams can adopt contracts, generation, runtime adapters, and the core package ecosystem without crossing into a paid product loop.',
	},
	{
		question: 'What is Studio charging for?',
		answer:
			'Studio is the operating layer: the packaged workflow for evidence, drafts, review, export, and follow-up on top of the same open system.',
	},
	{
		question: 'Why not price the OSS layer?',
		answer:
			'The GTM works better when technical adopters can prove the foundation in the open, keep their leverage, and only pay when the operating product removes enough operational work.',
	},
	{
		question: 'Who should talk to you now?',
		answer:
			'Teams already running AI-heavy product or ops workflows, especially those who feel drift, unsafe regeneration, or coordination pain across multiple surfaces.',
	},
];

const packages = [
	{
		name: 'OSS/Core',
		subtitle: 'Free and open',
		description:
			'Use the open system when you want explicit contracts, safe regeneration, and standard outputs the team owns.',
		items: [
			'Contracts, generation, runtime adapters, harnesses, and agent tooling',
			'Incremental adoption inside existing codebases',
			'Local and CI-friendly workflows',
			'No forced hosted runtime or locked delivery path',
		],
		cta: {
			label: 'Start with OSS',
			href: '/install',
			className: 'btn-primary',
		},
	},
	{
		name: 'Studio',
		subtitle: 'Operating product',
		description:
			'Use Studio when you want the product layer for evidence, drafting, review, exports, and follow-up.',
		items: [
			'Packaged operating loop on top of the same open system',
			'Opinionated team workflows and governance surfaces',
			'Faster coordination for teams running real product or ops loops',
			'Design partner and rollout paths for teams with live complexity',
		],
		cta: {
			label: 'Explore Studio',
			href: 'https://www.contractspec.studio',
			className: 'btn-ghost',
		},
	},
];

export function PricingClient() {
	const [openFaq, setOpenFaq] = useState<number | null>(0);

	return (
		<main>
			<section className="section-padding hero-gradient border-border/70 border-b">
				<div className="editorial-shell grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
					<div className="space-y-6">
						<p className="editorial-kicker">Packaging, not upsell fog</p>
						<h1 className="editorial-title max-w-4xl">
							The open system is how teams start. Studio is how some teams
							operate.
						</h1>
						<p className="editorial-subtitle">
							Pricing should reflect the product split honestly. The OSS layer
							is the open foundation. Studio is the paid operating surface when
							the team wants a packaged workflow on top.
						</p>
						<div className="flex flex-col gap-3 sm:flex-row">
							<Link href="/install" className="btn-primary">
								Start with OSS <ChevronRight className="ml-2 h-4 w-4" />
							</Link>
							<Link
								href="https://www.contractspec.studio"
								className="btn-ghost"
							>
								Explore Studio
							</Link>
						</div>
					</div>
					<div className="editorial-panel space-y-5">
						<p className="editorial-kicker">Current GTM</p>
						<h2 className="editorial-panel-title">
							Earn trust in the open, then earn the right to sell the operating
							product.
						</h2>
						<p className="text-muted-foreground text-sm leading-7">
							This page should make the ladder clear: prove the OSS foundation
							first, then package the workflow that removes operational drag for
							teams that need more.
						</p>
					</div>
				</div>
			</section>

			<section className="editorial-section">
				<div className="editorial-shell grid gap-6 lg:grid-cols-2">
					{packages.map((pkg) => (
						<div key={pkg.name} className="editorial-panel space-y-6">
							<div className="space-y-3">
								<p className="editorial-kicker">{pkg.subtitle}</p>
								<h2 className="font-serif text-4xl tracking-[-0.04em]">
									{pkg.name}
								</h2>
								<p className="text-muted-foreground text-sm leading-7">
									{pkg.description}
								</p>
							</div>
							<ul className="editorial-list">
								{pkg.items.map((item) => (
									<li key={item}>
										<span className="editorial-list-marker" />
										<span>{item}</span>
									</li>
								))}
							</ul>
							<Link href={pkg.cta.href} className={pkg.cta.className}>
								{pkg.cta.label}
							</Link>
						</div>
					))}
				</div>
			</section>

			<section className="editorial-section bg-striped">
				<div className="editorial-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
					<div className="space-y-4">
						<p className="editorial-kicker">Design partner path</p>
						<h2 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
							For teams already carrying real AI-native complexity.
						</h2>
						<p className="editorial-copy">
							The design partner path exists for teams that need the operating
							layer now and are willing to shape it with us. That is not
							“enterprise later” positioning. It is a practical way to learn
							from the hardest live workflows first.
						</p>
						<Link href="/design-partner" className="btn-primary">
							Apply as a design partner
						</Link>
					</div>
					<StudioSignupSection />
				</div>
			</section>

			<section className="editorial-section">
				<div className="editorial-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
					<div className="space-y-4">
						<p className="editorial-kicker">FAQ</p>
						<h2 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
							Questions teams usually ask before they pick a side.
						</h2>
					</div>
					<div className="space-y-3">
						{faqs.map((faq, index) => {
							const isOpen = openFaq === index;

							return (
								<div key={faq.question} className="editorial-panel p-5">
									<button
										type="button"
										onClick={() => setOpenFaq(isOpen ? null : index)}
										className="flex w-full items-center justify-between gap-4 text-left"
									>
										<span className="font-medium text-lg">{faq.question}</span>
										<ChevronDown
											className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
												isOpen ? 'rotate-180' : ''
											}`}
										/>
									</button>
									{isOpen ? (
										<p className="mt-4 text-muted-foreground text-sm leading-7">
											{faq.answer}
										</p>
									) : null}
								</div>
							);
						})}
					</div>
				</div>
			</section>
		</main>
	);
}
