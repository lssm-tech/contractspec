import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Design Partner | ContractSpec',
	description:
		'Work directly with the ContractSpec team if you are shaping a live AI-native product or operations workflow.',
};

const steps = [
	{
		title: 'Run the open system against a live problem',
		copy: 'Bring one workflow or module that already feels risky, inconsistent, or hard to regenerate safely.',
	},
	{
		title: 'Use Studio where packaged coordination helps',
		copy: 'We focus on the parts of your loop where an operating product materially reduces friction for the team.',
	},
	{
		title: 'Feed real constraints back into the product',
		copy: 'The partnership is valuable when your live complexity changes what we should build next.',
	},
];

export function DesignPartnerPage() {
	return (
		<main>
			<section className="section-padding hero-gradient border-border/70 border-b">
				<div className="editorial-shell grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
					<div className="space-y-5">
						<p className="editorial-kicker">Design partner program</p>
						<h1 className="editorial-title max-w-4xl">
							Shape the operating product from real AI-native workflow pressure.
						</h1>
						<p className="editorial-subtitle">
							The design partner path is for teams whose complexity is already
							real: multiple surfaces, live signals, coordination cost, and
							unsafe regeneration pain. We use that pressure to sharpen both the
							open foundation and the Studio layer on top.
						</p>
					</div>
					<div className="editorial-panel space-y-5">
						<p className="editorial-kicker">Who this is for</p>
						<ul className="editorial-list">
							<li>
								<span className="editorial-list-marker" />
								<span>
									Small teams already shipping AI-assisted products or ops
									loops.
								</span>
							</li>
							<li>
								<span className="editorial-list-marker" />
								<span>
									Builders who want direct access to the product team.
								</span>
							</li>
							<li>
								<span className="editorial-list-marker" />
								<span>Teams comfortable shaping a product in motion.</span>
							</li>
						</ul>
						<Link
							href="mailto:partners@contractspec.io"
							className="btn-primary"
						>
							Contact partner team
						</Link>
					</div>
				</div>
			</section>

			<section className="editorial-section">
				<div className="editorial-shell grid gap-5 md:grid-cols-3">
					{steps.map((step, index) => (
						<div key={step.title} className="editorial-panel space-y-4">
							<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(162_79_42_/_0.12)] font-mono text-[color:var(--rust)] text-xs">
								0{index + 1}
							</div>
							<h2 className="font-serif text-3xl tracking-[-0.04em]">
								{step.title}
							</h2>
							<p className="text-muted-foreground text-sm leading-7">
								{step.copy}
							</p>
						</div>
					))}
				</div>
			</section>

			<section className="editorial-section bg-striped">
				<div className="editorial-shell grid gap-8 lg:grid-cols-2">
					<div className="editorial-panel">
						<p className="editorial-kicker">What you get</p>
						<ul className="editorial-list mt-6">
							<li>
								<span className="editorial-list-marker" />
								<span>
									Direct access to the builders instead of generic support
									routing.
								</span>
							</li>
							<li>
								<span className="editorial-list-marker" />
								<span>
									Faster feedback cycles around the workflows that matter to
									you.
								</span>
							</li>
							<li>
								<span className="editorial-list-marker" />
								<span>
									Input into how OSS and Studio packaging should evolve
									together.
								</span>
							</li>
						</ul>
					</div>
					<div className="editorial-panel">
						<p className="editorial-kicker">How to start</p>
						<p className="text-muted-foreground text-sm leading-7">
							Bring one concrete workflow, the current points of drift or
							instability, and the team context around it. That is enough to
							tell whether the right next step is open-system adoption, a Studio
							pilot, or a deeper partnership.
						</p>
						<div className="mt-6 flex flex-col gap-3 sm:flex-row">
							<Link
								href="https://www.contractspec.studio"
								className="btn-primary"
							>
								Explore Studio
							</Link>
							<Link href="/contact" className="btn-ghost">
								Book a conversation
							</Link>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
