'use client';

import {
	type ComponentType,
	type LazyExoticComponent,
	lazy,
	Suspense,
} from 'react';
import {
	type ExamplePreviewSurface,
	getExamplePreviewSurface,
} from '../preview-catalog';
import { listInlineExamplePreviews } from './previews';

const PREVIEW_COMPONENTS = Object.fromEntries(
	listInlineExamplePreviews().map((preview) => [
		preview.key,
		lazy(async () => {
			const module = await preview.loadModule();
			return { default: module[preview.exportName] as ComponentType };
		}),
	])
) as Record<string, LazyExoticComponent<ComponentType>>;

export interface ExampleWebPreviewProps {
	exampleKey: string;
	title?: string;
	description?: string;
}

export interface ExamplePreviewFallbackProps {
	surface: ExamplePreviewSurface;
}

export function ExamplePreviewFallback({
	surface,
}: ExamplePreviewFallbackProps) {
	const links = [
		{ href: surface.docsHref, label: 'Open docs', kind: 'primary' },
		{ href: surface.sandboxHref, label: 'Open sandbox', kind: 'ghost' },
		{ href: surface.llmsHref, label: 'LLMS page', kind: 'ghost' },
		{ href: surface.sourceHref, label: 'Source', kind: 'ghost' },
	].filter((link): link is { href: string; label: string; kind: string } =>
		Boolean(link.href)
	);

	return (
		<section className="space-y-6">
			<div className="grid gap-4 md:grid-cols-3">
				<div className="space-y-1">
					<p className="font-medium text-sm">Package</p>
					<p className="break-words font-mono text-muted-foreground text-xs">
						{surface.packageName}
					</p>
				</div>
				<div className="space-y-1">
					<p className="font-medium text-sm">Visibility</p>
					<p className="text-muted-foreground text-sm">{surface.visibility}</p>
				</div>
				<div className="space-y-1">
					<p className="font-medium text-sm">Stability</p>
					<p className="text-muted-foreground text-sm">{surface.stability}</p>
				</div>
			</div>

			{surface.tags.length > 0 ? (
				<div className="flex flex-wrap gap-2">
					{surface.tags.map((tag) => (
						<span
							key={tag}
							className="rounded-full border border-border bg-muted px-3 py-1 text-muted-foreground text-xs"
						>
							{tag}
						</span>
					))}
				</div>
			) : null}

			<div className="flex flex-wrap gap-3">
				{links.map((link) => (
					<a
						key={`${link.href}-${link.label}`}
						className={link.kind === 'primary' ? 'btn-primary' : 'btn-ghost'}
						href={link.href}
					>
						{link.label}
					</a>
				))}
			</div>
		</section>
	);
}

export function ExampleWebPreview({
	exampleKey,
	title,
	description,
}: ExampleWebPreviewProps) {
	const surface = getExamplePreviewSurface(exampleKey);

	if (!surface) {
		return null;
	}

	const PreviewComponent = PREVIEW_COMPONENTS[surface.key];
	const resolvedTitle = title ?? surface.title;
	const resolvedDescription = description ?? surface.description;

	return (
		<div className="space-y-6">
			<header className="rounded-2xl border border-border bg-card p-6 shadow-sm">
				<p className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
					ContractSpec Example
				</p>
				<h1 className="font-bold text-3xl">{resolvedTitle}</h1>
				{resolvedDescription ? (
					<p className="mt-2 max-w-2xl text-muted-foreground text-sm">
						{resolvedDescription}
					</p>
				) : null}
			</header>
			<main className="space-y-4 p-2">
				{surface.supportsInlinePreview && PreviewComponent ? (
					<Suspense
						fallback={
							<div className="rounded border bg-muted p-4 text-muted-foreground text-sm">
								Loading preview...
							</div>
						}
					>
						<PreviewComponent />
					</Suspense>
				) : (
					<ExamplePreviewFallback surface={surface} />
				)}
			</main>
		</div>
	);
}
