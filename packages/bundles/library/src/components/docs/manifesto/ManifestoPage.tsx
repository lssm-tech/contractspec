export function ManifestoPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-3">
				<p className="editorial-kicker">Why ContractSpec</p>
				<h1 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
					Open system, explicit contracts, incremental adoption.
				</h1>
				<p className="max-w-3xl text-lg text-muted-foreground leading-8">
					ContractSpec exists to make AI-native software more legible and more
					governable. The system should help teams express durable boundaries,
					keep generated surfaces aligned, and still own the code and contracts
					they ship.
				</p>
			</div>

			<div className="space-y-6">
				<section className="editorial-panel space-y-3">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						Open system, not closed platform
					</h2>
					<p className="text-muted-foreground text-sm leading-7">
						The OSS layer should remain useful on its own. Teams need explicit
						contracts, readable code, and outputs they can keep. Studio can sit
						on top of that system, but it should never be the only way to own or
						understand the behavior.
					</p>
				</section>

				<section className="editorial-panel space-y-3">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						Contracts before surface sprawl
					</h2>
					<p className="text-muted-foreground text-sm leading-7">
						AI tooling accelerates surface creation faster than most teams can
						govern it. The answer is not more hidden glue. The answer is a
						durable contract layer that keeps API, UI, data, workflows, and
						operator behavior aligned.
					</p>
				</section>

				<section className="editorial-panel space-y-3">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						Incremental adoption wins
					</h2>
					<p className="text-muted-foreground text-sm leading-7">
						Most teams already have a codebase. The practical path is to
						stabilize one boundary at a time, prove the loop, and grow from
						there. That is why the docs and product should lead with one module,
						one endpoint, one workflow, one unsafe surface at a time.
					</p>
				</section>

				<section className="editorial-panel space-y-3">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						Studio should stay additive
					</h2>
					<p className="text-muted-foreground text-sm leading-7">
						The best operating product can and should exist on top of the open
						system. But the OSS foundation must remain strong enough that
						technical adopters trust it before they ever adopt Studio.
					</p>
				</section>
			</div>
		</div>
	);
}
