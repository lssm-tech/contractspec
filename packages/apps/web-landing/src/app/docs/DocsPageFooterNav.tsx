'use client';

import {
	getDocsNextPrevious,
	getDocsPageByHref,
	getSecondaryDocsPages,
} from '@contractspec/bundle.library/components/docs/docsManifest';
import Link from '@contractspec/lib.ui-link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function DocsPageFooterNav() {
	const pathname = usePathname();
	const page = getDocsPageByHref(pathname);
	const { previous, next } = getDocsNextPrevious(pathname);
	const secondary = getSecondaryDocsPages().slice(0, 3);

	if (!page && !previous && !next) {
		return null;
	}

	return (
		<div className="space-y-6 border-border/70 border-t pt-10">
			<div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
				<span className="badge">OSS docs</span>
				{page?.section ? <span>{page.section}</span> : null}
				{page?.audience === 'studio-bridge' ? (
					<span>Studio is additive to OSS, not the source of truth.</span>
				) : (
					<span>
						Start with OSS. Adopt Studio when you want the operating layer.
					</span>
				)}
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{previous ? (
					<Link href={previous.href} className="docs-footer-link">
						<div className="flex items-center gap-3 text-muted-foreground text-sm">
							<ArrowLeft size={16} />
							<span>Previous</span>
						</div>
						<div>
							<h3 className="font-semibold text-lg">{previous.title}</h3>
							<p className="mt-1 text-muted-foreground text-sm">
								{previous.description}
							</p>
						</div>
					</Link>
				) : (
					<div className="hidden md:block" />
				)}

				{next ? (
					<Link href={next.href} className="docs-footer-link md:text-right">
						<div className="flex items-center justify-start gap-3 text-muted-foreground text-sm md:justify-end">
							<span>Next</span>
							<ArrowRight size={16} />
						</div>
						<div>
							<h3 className="font-semibold text-lg">{next.title}</h3>
							<p className="mt-1 text-muted-foreground text-sm">
								{next.description}
							</p>
						</div>
					</Link>
				) : null}
			</div>

			<div className="docs-secondary-strip">
				<div>
					<p className="font-mono text-[11px] text-[color:var(--rust)] uppercase tracking-[0.24em]">
						Why ContractSpec
					</p>
					<p className="mt-2 max-w-2xl text-muted-foreground text-sm">
						Keep educational and comparison content reachable without letting it
						define the primary OSS learning path.
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					{secondary.map((item) => (
						<Link key={item.href} href={item.href} className="docs-chip-link">
							{item.title}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
