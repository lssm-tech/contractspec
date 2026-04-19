import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
	getChangelogReleaseByVersion,
	getChangelogVersions,
} from '@/lib/changelog';

interface PageProps {
	params: Promise<{ version: string }>;
}

export const dynamicParams = false;

function formatDate(date: string): string {
	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) {
		return date;
	}

	return parsed.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
	});
}

export async function generateStaticParams() {
	const versions = await getChangelogVersions();
	return versions.map((version) => ({ version }));
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { version } = await params;
	const release = await getChangelogReleaseByVersion(version);

	if (!release) {
		return {
			title: 'Release Not Found | ContractSpec',
		};
	}

	return {
		title: `Changelog ${release.version} | ContractSpec`,
		description: `${release.changeCount} unique changes across ${release.packageCount} packages and ${release.releaseCount} release entries.`,
	};
}

export default async function ChangelogVersionPage({ params }: PageProps) {
	const { version } = await params;
	const release = await getChangelogReleaseByVersion(version);

	if (!release) {
		notFound();
	}

	return (
		<main>
			<section className="section-padding hero-gradient relative border-border border-b">
				<div className="mx-auto max-w-5xl space-y-4">
					<Link
						href="/changelog"
						className="text-muted-foreground text-sm hover:underline"
					>
						Back to changelog index
					</Link>
					<h1 className="font-bold text-5xl leading-tight md:text-6xl">
						{release.version}
					</h1>
					<p className="text-lg text-muted-foreground">
						{formatDate(release.date)} · {release.packageCount} packages ·{' '}
						{release.changeCount} unique changes · {release.releaseCount}{' '}
						release {release.releaseCount === 1 ? 'entry' : 'entries'}
					</p>
					<div className="flex flex-wrap gap-2">
						{release.layers.map((layer) => (
							<span
								key={`${release.version}-${layer}`}
								className="rounded-full border border-border px-2 py-0.5 text-muted-foreground text-xs"
							>
								{layer}
							</span>
						))}
						{release.isBreaking && (
							<span className="inline-flex items-center rounded-full border border-red-500/50 bg-red-500/10 px-2 py-0.5 font-semibold text-red-500 text-xs">
								Breaking changes
							</span>
						)}
					</div>
				</div>
			</section>

			<section className="section-padding">
				<div className="mx-auto max-w-5xl space-y-6">
					<article className="card-subtle space-y-4 p-6">
						<h2 className="font-semibold text-xl">Release summaries</h2>
						<ul className="space-y-4">
							{release.releases.map((entry) => (
								<li
									key={`${release.version}-${entry.slug}`}
									className="space-y-2 rounded-md border border-border p-4"
								>
									<p className="font-medium text-muted-foreground text-sm uppercase tracking-[0.2em]">
										{entry.slug}
									</p>
									<p className="text-base leading-relaxed">{entry.summary}</p>
									{entry.audiences.length > 0 && (
										<div className="grid gap-3 md:grid-cols-3">
											{entry.audiences.map((audience) => (
												<div
													key={`${entry.slug}-${audience.kind}`}
													className="rounded-md border border-border p-3"
												>
													<p className="font-semibold text-sm capitalize">
														{audience.kind}
													</p>
													<p className="mt-2 text-muted-foreground text-sm leading-relaxed">
														{audience.summary}
													</p>
												</div>
											))}
										</div>
									)}
								</li>
							))}
						</ul>
					</article>

					{release.deprecations.length > 0 && (
						<article className="card-subtle space-y-4 p-6">
							<h2 className="font-semibold text-xl">Deprecations</h2>
							<ul className="space-y-2">
								{release.deprecations.map((deprecation) => (
									<li
										key={`${release.version}-${deprecation}`}
										className="text-sm leading-relaxed"
									>
										- {deprecation}
									</li>
								))}
							</ul>
						</article>
					)}

					{release.migrationInstructions.length > 0 && (
						<article className="card-subtle space-y-4 p-6">
							<h2 className="font-semibold text-xl">Migration guide</h2>
							<ul className="space-y-4">
								{release.migrationInstructions.map((instruction) => (
									<li
										key={`${release.version}-${instruction.id}`}
										className="space-y-2 rounded-md border border-border p-4"
									>
										<div className="flex flex-wrap items-center gap-2">
											<p className="font-semibold text-sm">
												{instruction.title}
											</p>
											{instruction.required && (
												<span className="rounded-full border border-amber-500/50 bg-amber-500/10 px-2 py-0.5 font-semibold text-amber-500 text-xs">
													Required
												</span>
											)}
										</div>
										<p className="text-muted-foreground text-sm leading-relaxed">
											{instruction.summary}
										</p>
										{instruction.when && (
											<p className="text-muted-foreground text-xs">
												When: {instruction.when}
											</p>
										)}
										{instruction.steps.length > 0 && (
											<ol className="space-y-2 text-sm">
												{instruction.steps.map((step) => (
													<li key={`${instruction.id}-${step}`}>{step}</li>
												))}
											</ol>
										)}
									</li>
								))}
							</ul>
						</article>
					)}

					{release.upgradeSteps.length > 0 && (
						<article className="card-subtle space-y-4 p-6">
							<h2 className="font-semibold text-xl">Upgrade steps</h2>
							<ul className="space-y-4">
								{release.upgradeSteps.map((step) => (
									<li
										key={`${release.version}-${step.id}`}
										className="space-y-2 rounded-md border border-border p-4"
									>
										<div className="flex flex-wrap items-center gap-2">
											<p className="font-semibold text-sm">{step.title}</p>
											<span className="rounded-full border border-border px-2 py-0.5 text-muted-foreground text-xs uppercase">
												{step.level}
											</span>
										</div>
										<p className="text-muted-foreground text-sm leading-relaxed">
											{step.summary}
										</p>
										{step.packages.length > 0 && (
											<p className="text-muted-foreground text-xs">
												Packages: {step.packages.join(', ')}
											</p>
										)}
										{step.instructions.length > 0 && (
											<ol className="space-y-2 text-sm">
												{step.instructions.map((instruction) => (
													<li key={`${step.id}-${instruction}`}>
														{instruction}
													</li>
												))}
											</ol>
										)}
									</li>
								))}
							</ul>
						</article>
					)}

					<article className="card-subtle space-y-4 p-6">
						<h2 className="font-semibold text-xl">Unique release changes</h2>
						<ul className="space-y-3">
							{release.changes.map((change) => (
								<li
									key={`${release.version}-${change.text}`}
									className="space-y-2"
								>
									<p className="text-sm leading-relaxed">- {change.text}</p>
									<p className="text-muted-foreground text-xs">
										{change.packages.length} packages · {change.occurrences}{' '}
										occurrences
									</p>
								</li>
							))}
						</ul>
					</article>

					<article className="card-subtle space-y-4 p-6">
						<h2 className="font-semibold text-xl">Impacted packages</h2>
						<ul className="grid gap-3 md:grid-cols-2">
							{release.packages.map((pkg) => (
								<li
									key={`${release.version}-${pkg.name}`}
									className="rounded-md border border-border p-3"
								>
									<p className="font-mono text-sm">{pkg.name}</p>
									<p className="mt-1 text-muted-foreground text-xs">
										Layer: {pkg.layer} · {pkg.changes.length} changes
									</p>
								</li>
							))}
						</ul>
					</article>
				</div>
			</section>
		</main>
	);
}
