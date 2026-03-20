'use client';

import Link from 'next/link';

const COFOUNDER_EMAIL = 'tboutron@contractspec.io';
const APPLY_SUBJECT = 'Co-founder application: ContractSpec';
const APPLY_BODY = `Hi Theo,

I am reaching out about co-founding ContractSpec.

LinkedIn: [your link]
Proof of work #1: [link]
Proof of work #2: [link]

Why ContractSpec:
[your answer]

What I would own in the first 90 days:
[your answer]
`;

const mailtoLink = `mailto:${COFOUNDER_EMAIL}?subject=${encodeURIComponent(APPLY_SUBJECT)}&body=${encodeURIComponent(APPLY_BODY)}`;

const tracks = [
	{
		title: 'GTM / partnerships',
		copy: 'Own the design partner pipeline, sharpen messaging, and turn market feedback into product signal.',
	},
	{
		title: 'Product / design',
		copy: 'Own the Studio surface, shape the interaction model, and turn live user behavior into clearer workflows.',
	},
];

export function CofounderPage() {
	return (
		<main>
			<section className="section-padding hero-gradient border-border/70 border-b">
				<div className="editorial-shell grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
					<div className="space-y-5">
						<p className="editorial-kicker">Co-founder search</p>
						<h1 className="editorial-title max-w-4xl">
							Looking for a co-founder who wants to build an open system and the
							product on top of it.
						</h1>
						<p className="editorial-subtitle">
							ContractSpec already has the early stack shape: explicit
							contracts, runtimes, harnesses, examples, and the first Studio
							operating loops. The next phase needs someone who can own either
							GTM or product depth with real execution energy.
						</p>
					</div>
					<div className="editorial-panel space-y-5">
						<p className="editorial-kicker">What exists now</p>
						<ul className="editorial-list">
							<li>
								<span className="editorial-list-marker" />
								<span>
									Open-source package ecosystem and working website/docs
									surface.
								</span>
							</li>
							<li>
								<span className="editorial-list-marker" />
								<span>
									Studio product direction with live operating workflows.
								</span>
							</li>
							<li>
								<span className="editorial-list-marker" />
								<span>
									Founder-led product, bootstrapped, still early enough to
									shape.
								</span>
							</li>
						</ul>
						<Link href={mailtoLink} className="btn-primary">
							Talk about co-founding
						</Link>
					</div>
				</div>
			</section>

			<section className="editorial-section">
				<div className="editorial-shell grid gap-6 lg:grid-cols-2">
					{tracks.map((track) => (
						<div key={track.title} className="editorial-panel">
							<p className="editorial-kicker">{track.title}</p>
							<h2 className="mt-3 font-serif text-4xl tracking-[-0.04em]">
								{track.title}
							</h2>
							<p className="mt-4 text-muted-foreground text-sm leading-7">
								{track.copy}
							</p>
						</div>
					))}
				</div>
			</section>

			<section className="editorial-section bg-striped">
				<div className="editorial-shell grid gap-8 lg:grid-cols-2">
					<div className="editorial-panel">
						<p className="editorial-kicker">What good looks like</p>
						<ul className="editorial-list mt-6">
							<li>
								<span className="editorial-list-marker" />
								<span>You have proof of work, not just interest.</span>
							</li>
							<li>
								<span className="editorial-list-marker" />
								<span>
									You can own a whole surface and move without waiting for
									permission.
								</span>
							</li>
							<li>
								<span className="editorial-list-marker" />
								<span>
									You like written clarity, sharp product taste, and direct
									feedback.
								</span>
							</li>
						</ul>
					</div>
					<div className="editorial-panel">
						<p className="editorial-kicker">Apply</p>
						<p className="text-muted-foreground text-sm leading-7">
							Send links that prove how you think and how you ship. The best
							applications make it obvious what you would own in the first 90
							days and why this problem is worth years of your attention.
						</p>
						<div className="mt-6 flex flex-col gap-3 sm:flex-row">
							<Link href={mailtoLink} className="btn-primary">
								Email application
							</Link>
							<Link href="/contact" className="btn-ghost">
								Start with a conversation
							</Link>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
