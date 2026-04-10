import Link from '@contractspec/lib.ui-link';

const studioAdds = [
	'decision workflows that turn product evidence into proposed spec changes',
	'governed execution loops and task packs on top of the OSS contract layer',
	'operator surfaces for teams that need a managed workflow instead of raw building blocks',
	'deeper product-facing workflows that sit above the open system without replacing it',
];

export function StudioOverviewPage() {
	return (
		<main className="space-y-10">
			<section className="space-y-3">
				<p className="editorial-kicker">Studio bridge</p>
				<h1 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
					Studio is the operating layer built on top of OSS ContractSpec.
				</h1>
				<p className="max-w-3xl text-lg text-muted-foreground leading-8">
					Start with the open system first: contracts, generated surfaces,
					runtimes, integrations, and safe regeneration. Move to Studio when a
					team wants the product-facing workflow, decision loop, and managed
					operator surface on top of that foundation.
				</p>
			</section>

			<section className="editorial-proof-strip">
				<div className="editorial-stat">
					<span className="editorial-label">What stays open</span>
					<span className="editorial-stat-value">
						contracts, code, generated surfaces
					</span>
				</div>
				<p className="max-w-2xl text-muted-foreground text-sm leading-7">
					Studio is additive. It does not replace the OSS source of truth or ask
					teams to abandon their contract layer.
				</p>
			</section>

			<section className="grid gap-4 md:grid-cols-2">
				<article className="editorial-panel space-y-4">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						Start with OSS when you need:
					</h2>
					<ul className="editorial-list">
						<li>
							<span className="editorial-list-marker" />
							<span>
								explicit contracts and generated surfaces you still own
							</span>
						</li>
						<li>
							<span className="editorial-list-marker" />
							<span>incremental adoption inside an existing codebase</span>
						</li>
						<li>
							<span className="editorial-list-marker" />
							<span>
								runtime governance, integrations, and safe regeneration without
								a managed operating product
							</span>
						</li>
					</ul>
				</article>

				<article className="editorial-panel space-y-4">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						Adopt Studio when you need:
					</h2>
					<ul className="editorial-list">
						{studioAdds.map((item) => (
							<li key={item}>
								<span className="editorial-list-marker" />
								<span>{item}</span>
							</li>
						))}
					</ul>
				</article>
			</section>

			<section className="editorial-panel space-y-4">
				<h2 className="font-serif text-3xl tracking-[-0.03em]">
					Builder is the governed authoring layer
				</h2>
				<p className="text-muted-foreground text-sm leading-7">
					If your team wants a concrete authoring control plane on top of the
					OSS foundation, start with the Builder control-plane docs and the
					workbench host guide before you dive into the larger Studio product
					surface.
				</p>
				<div className="flex flex-wrap gap-3">
					<Link
						href="/docs/specs/builder-control-plane"
						className="btn-primary"
					>
						Builder control plane
					</Link>
					<Link
						href="/docs/guides/host-builder-workbench"
						className="btn-ghost"
					>
						Host the Builder workbench
					</Link>
				</div>
			</section>

			<section className="editorial-panel space-y-4">
				<h2 className="font-serif text-3xl tracking-[-0.03em]">
					Go to the Studio product docs for the full product surface
				</h2>
				<p className="text-muted-foreground text-sm leading-7">
					The OSS site keeps this section intentionally short. Deep Studio
					product guidance belongs in the Studio app docs.
				</p>
				<div className="flex flex-wrap gap-3">
					<Link href="https://www.contractspec.studio" className="btn-primary">
						Open Studio
					</Link>
					<Link
						href="https://www.contractspec.studio/docs"
						className="btn-ghost"
					>
						Read Studio docs
					</Link>
				</div>
			</section>
		</main>
	);
}
