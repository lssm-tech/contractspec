import Link from 'next/link';

const contributionTracks = [
	{
		title: 'Contracts and runtime behavior',
		copy: 'Improve the core system surfaces that keep APIs, UI, data, and tools aligned.',
	},
	{
		title: 'Examples and templates',
		copy: 'Show how the open system behaves in realistic verticals and team workflows.',
	},
	{
		title: 'Docs and agent-facing guidance',
		copy: 'Tighten the human and machine-readable guides that explain how the stack actually works.',
	},
	{
		title: 'Integrations and ecosystem',
		copy: 'Expand the bridges that make the system usable in more real-world environments.',
	},
];

export function ContributePage() {
	return (
		<main>
			<section className="section-padding hero-gradient border-border/70 border-b">
				<div className="editorial-shell grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
					<div className="space-y-5">
						<p className="editorial-kicker">Open source</p>
						<h1 className="editorial-title max-w-4xl">
							Contribute to the open system, not a black box.
						</h1>
						<p className="editorial-subtitle">
							ContractSpec should stay legible, standards-first, and useful in
							real workflows. Contributions matter most when they sharpen that
							clarity instead of adding abstraction for its own sake.
						</p>
					</div>
					<div className="editorial-panel space-y-5">
						<p className="editorial-kicker">Fastest path</p>
						<ol className="space-y-4 text-muted-foreground text-sm leading-7">
							<li>Read the contribution guide and pick a tractable scope.</li>
							<li>Open a draft PR early so maintainers can steer the work.</li>
							<li>
								Ship one clear improvement with tests or validation evidence.
							</li>
						</ol>
						<div className="flex flex-col gap-3 sm:flex-row">
							<Link
								href="https://github.com/lssm-tech/contractspec/blob/main/CONTRIBUTING.md"
								className="btn-primary"
								target="_blank"
								rel="noopener noreferrer"
							>
								Read CONTRIBUTING
							</Link>
							<Link
								href="https://github.com/lssm-tech/contractspec/issues"
								className="btn-ghost"
								target="_blank"
								rel="noopener noreferrer"
							>
								Open issues
							</Link>
						</div>
					</div>
				</div>
			</section>

			<section className="editorial-section">
				<div className="editorial-shell space-y-8">
					<div className="max-w-3xl space-y-4">
						<p className="editorial-kicker">Where contributions matter most</p>
						<h2 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
							Work on the parts that make the system clearer and safer.
						</h2>
					</div>
					<div className="editorial-grid">
						{contributionTracks.map((track) => (
							<div key={track.title} className="editorial-panel">
								<h3 className="font-serif text-2xl tracking-[-0.03em]">
									{track.title}
								</h3>
								<p className="mt-3 text-muted-foreground text-sm leading-7">
									{track.copy}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="editorial-section bg-striped">
				<div className="editorial-shell grid gap-8 lg:grid-cols-2">
					<div className="editorial-panel">
						<p className="editorial-kicker">Quality bar</p>
						<h2 className="font-serif text-4xl tracking-[-0.04em]">
							The contribution should make the repo easier to trust.
						</h2>
						<ul className="editorial-list mt-6">
							<li>
								<span className="editorial-list-marker" />
								<span>Use strict TypeScript and keep changes explicit.</span>
							</li>
							<li>
								<span className="editorial-list-marker" />
								<span>
									Include tests or other concrete validation where behavior
									changes.
								</span>
							</li>
							<li>
								<span className="editorial-list-marker" />
								<span>Prefer one coherent concern per PR.</span>
							</li>
							<li>
								<span className="editorial-list-marker" />
								<span>
									Document the public or agent-facing impact when it exists.
								</span>
							</li>
						</ul>
					</div>
					<div className="editorial-panel">
						<p className="editorial-kicker">Governance and security</p>
						<h2 className="font-serif text-4xl tracking-[-0.04em]">
							Clarity first, private disclosure when the issue is sensitive.
						</h2>
						<p className="mt-5 text-muted-foreground text-sm leading-7">
							Architecture and roadmap decisions stay founder-led for now, but
							the reasoning should stay inspectable in issues, PRs, and docs. If
							you find a security issue, do not open a public ticket. Use{' '}
							<Link
								href="mailto:security@contractspec.io"
								className="underline"
							>
								security@contractspec.io
							</Link>{' '}
							instead.
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}
