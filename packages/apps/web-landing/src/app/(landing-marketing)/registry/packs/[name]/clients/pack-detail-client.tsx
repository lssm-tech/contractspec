'use client';

import Link from 'next/link';
import { useState } from 'react';
import type {
	DependencyGraph,
	Pack,
	PackVersion,
	QualityResult,
	ReverseDependency,
	Review,
} from '@/lib/registry-api';

interface PackDetailClientProps {
	pack: Pack;
	readme: string | null;
	versions: PackVersion[];
	reviews: Review[];
	reviewTotal: number;
	averageRating: number | null;
	quality: QualityResult | null;
	dependencyMermaid: string | null;
	dependencyGraph: DependencyGraph | null;
	dependents: ReverseDependency[];
}

/** Render filled/empty stars for a rating (1-5 scale). */
function StarRating({
	rating,
	size = 'sm',
}: {
	rating: number;
	size?: 'sm' | 'lg';
}) {
	const stars = [];
	const cls = size === 'lg' ? 'text-lg' : 'text-sm';
	for (let i = 1; i <= 5; i++) {
		stars.push(
			<span
				key={i}
				className={
					i <= Math.round(rating)
						? 'text-yellow-500'
						: 'text-muted-foreground/30'
				}
			>
				★
			</span>
		);
	}
	return <span className={cls}>{stars}</span>;
}

/** Quality badge with color coding. */
function QualityBadge({ score, badge }: { score: number; badge: string }) {
	const colorCls =
		score >= 80
			? 'bg-green-500/10 text-green-500 border-green-500/20'
			: score >= 60
				? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
				: score >= 40
					? 'bg-yellow-500/10 text-yellow-600 border-yellow-600/20'
					: 'bg-red-500/10 text-red-500 border-red-500/20';

	return (
		<div
			className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 ${colorCls}`}
		>
			<span className="font-bold text-sm">{score}</span>
			<span className="text-xs capitalize">{badge}</span>
		</div>
	);
}

export function PackDetailClient({
	pack,
	readme,
	versions,
	reviews,
	reviewTotal,
	averageRating,
	quality,
	dependencyMermaid,
	dependencyGraph,
	dependents,
}: PackDetailClientProps) {
	const [copiedSnippet, setCopiedSnippet] = useState(false);
	const installSnippet = `{ "packs": ["registry:${pack.name}"] }`;

	function copyInstall() {
		navigator.clipboard.writeText(installSnippet);
		setCopiedSnippet(true);
		setTimeout(() => setCopiedSnippet(false), 2000);
	}

	return (
		<div className="section-padding">
			<div className="mx-auto max-w-4xl">
				{/* Breadcrumb */}
				<nav className="mb-6 text-muted-foreground text-sm">
					<Link href="/registry/packs" className="hover:text-primary">
						Packs
					</Link>
					<span className="mx-2">/</span>
					<span className="text-foreground">{pack.displayName}</span>
				</nav>

				{/* Header */}
				<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<div className="flex items-center gap-2">
							<h1 className="font-bold text-3xl">{pack.displayName}</h1>
							{pack.verified && (
								<span className="rounded bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
									Verified
								</span>
							)}
						</div>
						<p className="mt-1 text-muted-foreground text-sm">
							by {pack.authorName}
						</p>
						<p className="mt-3 text-muted-foreground">{pack.description}</p>

						{/* Rating summary */}
						{averageRating !== null && (
							<div className="mt-2 flex items-center gap-2">
								<StarRating rating={averageRating} size="lg" />
								<span className="font-medium text-foreground text-sm">
									{averageRating.toFixed(1)}
								</span>
								<span className="text-muted-foreground text-sm">
									({reviewTotal} review{reviewTotal !== 1 ? 's' : ''})
								</span>
							</div>
						)}
					</div>

					{/* Stats card */}
					<div className="card-subtle flex-shrink-0 space-y-3 rounded-lg border border-border p-4">
						<div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
							<span className="text-muted-foreground">Downloads</span>
							<span className="font-medium">
								{pack.downloads.toLocaleString()}
							</span>
							<span className="text-muted-foreground">Weekly</span>
							<span className="font-medium">
								{pack.weeklyDownloads.toLocaleString()}
							</span>
							<span className="text-muted-foreground">License</span>
							<span className="font-medium">{pack.license}</span>
						</div>
						{quality && (
							<div className="border-border border-t pt-3">
								<span className="mb-1 block text-muted-foreground text-xs">
									Quality Score
								</span>
								<QualityBadge score={quality.score} badge={quality.badge} />
							</div>
						)}
					</div>
				</div>

				{/* Install snippet */}
				<div className="mb-8">
					<h2 className="mb-2 font-semibold text-lg">Install</h2>
					<div className="flex items-center gap-2 rounded-lg bg-muted/30 p-3">
						<code className="flex-1 text-foreground text-sm">
							{installSnippet}
						</code>
						<button
							type="button"
							onClick={copyInstall}
							className="btn-ghost rounded px-2 py-1 text-xs"
						>
							{copiedSnippet ? 'Copied!' : 'Copy'}
						</button>
					</div>
				</div>

				{/* Metadata */}
				<div className="mb-8 flex flex-wrap gap-6">
					{pack.tags.length > 0 && (
						<div>
							<h3 className="mb-1 font-medium text-muted-foreground text-xs uppercase">
								Tags
							</h3>
							<div className="flex flex-wrap gap-1">
								{pack.tags.map((tag) => (
									<span key={tag} className="badge text-xs">
										{tag}
									</span>
								))}
							</div>
						</div>
					)}
					{pack.targets.length > 0 && (
						<div>
							<h3 className="mb-1 font-medium text-muted-foreground text-xs uppercase">
								Targets
							</h3>
							<div className="flex flex-wrap gap-1">
								{pack.targets.map((target) => (
									<span
										key={target}
										className="rounded bg-muted/50 px-1.5 py-0.5 text-muted-foreground text-xs"
									>
										{target}
									</span>
								))}
							</div>
						</div>
					)}
					{pack.features.length > 0 && (
						<div>
							<h3 className="mb-1 font-medium text-muted-foreground text-xs uppercase">
								Features
							</h3>
							<div className="flex flex-wrap gap-1">
								{pack.features.map((feature) => (
									<span
										key={feature}
										className="rounded bg-muted/50 px-1.5 py-0.5 text-muted-foreground text-xs"
									>
										{feature}
									</span>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Links */}
				<div className="mb-8 flex gap-4 text-sm">
					{pack.homepage && (
						<a
							href={pack.homepage}
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:underline"
						>
							Homepage
						</a>
					)}
					{pack.repository && (
						<a
							href={pack.repository}
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:underline"
						>
							Repository
						</a>
					)}
				</div>

				{/* README */}
				{readme && (
					<div className="mb-8">
						<h2 className="mb-4 font-semibold text-lg">README</h2>
						<div className="prose prose-invert max-w-none rounded-lg border border-border p-6">
							<pre className="whitespace-pre-wrap text-sm">{readme}</pre>
						</div>
					</div>
				)}

				{/* Reviews */}
				<div className="mb-8">
					<h2 className="mb-4 font-semibold text-lg">
						Reviews ({reviewTotal})
					</h2>
					{reviews.length === 0 ? (
						<p className="text-muted-foreground text-sm">
							No reviews yet. Be the first to review this pack!
						</p>
					) : (
						<div className="space-y-4">
							{reviews.map((review) => (
								<div
									key={review.id}
									className="rounded-lg border border-border p-4"
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span className="font-medium text-foreground text-sm">
												{review.username}
											</span>
											<StarRating rating={review.rating} />
										</div>
										<span className="text-muted-foreground text-xs">
											{new Date(review.createdAt).toLocaleDateString()}
										</span>
									</div>
									{review.comment && (
										<p className="mt-2 text-muted-foreground text-sm">
											{review.comment}
										</p>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				{/* Quality breakdown */}
				{quality && (
					<div className="mb-8">
						<h2 className="mb-4 font-semibold text-lg">Quality Breakdown</h2>
						<div className="rounded-lg border border-border p-4">
							<div className="mb-3 flex items-center gap-3">
								<QualityBadge score={quality.score} badge={quality.badge} />
								<span className="text-muted-foreground text-sm">
									{quality.score}/100 points
								</span>
							</div>
							<div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
								<QualityItem
									label="README"
									met={quality.breakdown.hasReadme}
									points={20}
								/>
								<QualityItem
									label="Multi-version"
									met={quality.breakdown.hasMultipleVersions}
									points={10}
								/>
								<QualityItem
									label="License"
									met={quality.breakdown.hasLicense}
									points={10}
								/>
								<QualityItem
									label="Tags"
									met={quality.breakdown.hasTags}
									points={10}
								/>
								<QualityItem
									label="Repository"
									met={quality.breakdown.hasRepository}
									points={5}
								/>
								<QualityItem
									label="Homepage"
									met={quality.breakdown.hasHomepage}
									points={5}
								/>
								<QualityItem
									label="No conflicts"
									met={quality.breakdown.noConflicts}
									points={5}
								/>
								<div className="flex items-center gap-1.5">
									<span className="text-blue-500">◆</span>
									<span className="text-muted-foreground">
										Targets: {quality.breakdown.targetCoverage}/4 (+
										{Math.round((quality.breakdown.targetCoverage / 4) * 20)})
									</span>
								</div>
								<div className="flex items-center gap-1.5">
									<span className="text-blue-500">◆</span>
									<span className="text-muted-foreground">
										Features: {quality.breakdown.featureCount}/5 (+
										{Math.round((quality.breakdown.featureCount / 5) * 15)})
									</span>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Dependency Graph */}
				{dependencyGraph && dependencyGraph.edges.length > 0 && (
					<div className="mb-8">
						<h2 className="mb-4 font-semibold text-lg">
							Dependencies ({dependencyGraph.nodes.length - 1})
						</h2>
						{dependencyMermaid && (
							<div className="mb-4 rounded-lg border border-border p-4">
								<details>
									<summary className="cursor-pointer text-muted-foreground text-sm">
										View Mermaid diagram source
									</summary>
									<pre className="mt-2 overflow-x-auto rounded bg-muted/30 p-3 text-xs">
										{dependencyMermaid}
									</pre>
								</details>
							</div>
						)}
						<div className="rounded-lg border border-border p-4">
							<div className="flex flex-wrap gap-2">
								{dependencyGraph.edges.map((edge, i) => (
									<div
										key={`${edge.from}-${edge.to}-${i}`}
										className="flex items-center gap-1.5 rounded-md bg-muted/30 px-2.5 py-1.5 text-sm"
									>
										<span
											className={
												edge.from === dependencyGraph.root
													? 'font-medium text-primary'
													: 'text-foreground'
											}
										>
											{edge.from}
										</span>
										<span className="text-muted-foreground">→</span>
										<Link
											href={`/registry/packs/${edge.to}`}
											className="text-primary hover:underline"
										>
											{edge.to}
										</Link>
									</div>
								))}
							</div>
							{dependencyGraph.depth > 1 && (
								<p className="mt-3 text-muted-foreground text-xs">
									Dependency depth: {dependencyGraph.depth} levels
								</p>
							)}
						</div>
					</div>
				)}

				{/* Reverse Dependencies (Dependents) */}
				{dependents.length > 0 && (
					<div className="mb-8">
						<h2 className="mb-4 font-semibold text-lg">
							Used By ({dependents.length})
						</h2>
						<div className="space-y-2">
							{dependents.map((dep) => (
								<Link
									key={dep.packName}
									href={`/registry/packs/${dep.packName}`}
									className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:border-primary/50"
								>
									<span className="font-medium text-foreground text-sm">
										{dep.displayName}
									</span>
									<span className="text-muted-foreground text-xs">
										{dep.downloads.toLocaleString()} downloads
									</span>
								</Link>
							))}
						</div>
					</div>
				)}

				{/* Versions */}
				{versions.length > 0 && (
					<div>
						<h2 className="mb-4 font-semibold text-lg">
							Versions ({versions.length})
						</h2>
						<div className="space-y-2">
							{versions.map((v) => (
								<Link
									key={v.version}
									href={`/registry/packs/${pack.name}/versions/${v.version}`}
									className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:border-primary/50"
								>
									<div>
										<span className="font-medium font-mono text-sm">
											v{v.version}
										</span>
										{v.fileSize && (
											<span className="ml-2 text-muted-foreground text-xs">
												{(v.fileSize / 1024).toFixed(1)} KB
											</span>
										)}
									</div>
									<span className="text-muted-foreground text-xs">
										{new Date(v.createdAt).toLocaleDateString()}
									</span>
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

/** Quality item row — checkmark/cross with label and points. */
function QualityItem({
	label,
	met,
	points,
}: {
	label: string;
	met: boolean;
	points: number;
}) {
	return (
		<div className="flex items-center gap-1.5">
			<span className={met ? 'text-green-500' : 'text-red-500/50'}>
				{met ? '✓' : '✗'}
			</span>
			<span className={met ? 'text-foreground' : 'text-muted-foreground'}>
				{label} (+{points})
			</span>
		</div>
	);
}
