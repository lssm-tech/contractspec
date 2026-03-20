export interface ChangelogEntry {
	version: string;
	date: string;
	isBreaking: boolean;
	packages: {
		name: string;
		changes: string[];
	}[];
}

interface ChangelogPageProps {
	entries: ChangelogEntry[];
}

export function ChangelogPage({ entries }: ChangelogPageProps) {
	return (
		<main>
			{/* Hero */}
			<section className="section-padding hero-gradient relative border-border border-b">
				<div className="mx-auto max-w-4xl space-y-6 text-center">
					<h1 className="font-bold text-5xl leading-tight md:text-6xl">
						Changelog
					</h1>
					<p className="text-lg text-muted-foreground">
						Latest releases and improvements to ContractSpec.
					</p>
				</div>
			</section>

			{/* Timeline */}
			<section className="section-padding">
				<div className="mx-auto max-w-3xl space-y-8">
					{entries.map((entry, i) => (
						<div
							key={i}
							className="card-subtle flex flex-col gap-6 p-8 md:flex-row md:items-start"
						>
							{/* Left: Version & Date */}
							<div className="md:w-48 md:flex-shrink-0">
								<div className="sticky top-24">
									<h3 className="font-bold text-2xl tracking-tight">
										{entry.version}
									</h3>
									<time className="mt-1 block font-medium text-muted-foreground text-sm">
										{entry.date}
									</time>
									{entry.isBreaking && (
										<span className="mt-2 inline-flex items-center rounded-full border border-red-500/50 bg-red-500/10 px-2.5 py-0.5 font-semibold text-red-500 text-xs">
											Breaking Change
										</span>
									)}
								</div>
							</div>

							{/* Right: Changes per package */}
							<div className="flex-1 space-y-6">
								{entry.packages.map((pkg, j) => (
									<div key={j} className="space-y-3">
										<h4 className="font-mono font-semibold text-sm text-violet-400">
											{pkg.name}
										</h4>
										<ul className="space-y-2">
											{pkg.changes.map((change, k) => (
												<li
													key={k}
													className="flex items-start gap-3 text-base text-muted-foreground leading-relaxed"
												>
													<span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-violet-500/50" />
													<span>{change}</span>
												</li>
											))}
										</ul>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}
