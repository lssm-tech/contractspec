'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface StudioSignupSectionProps {
	variant?: 'default' | 'compact';
}

const studioUrl = 'https://www.contractspec.studio';
const studioDocsUrl = 'https://www.contractspec.studio/docs';

export function StudioSignupSection({
	variant = 'default',
}: StudioSignupSectionProps) {
	const isCompact = variant === 'compact';

	return (
		<div
			id="studio-signup"
			className={`${isCompact ? 'space-y-5 rounded-[28px] border border-border bg-card p-6' : 'editorial-panel space-y-6'}`}
		>
			<div className="space-y-4">
				<div className="badge">
					<Sparkles size={14} />
					Studio on top
				</div>
				<h2
					className={
						isCompact
							? 'font-serif text-3xl tracking-[-0.04em]'
							: 'font-serif text-4xl tracking-[-0.04em]'
					}
				>
					See the operating layer built on top of the open system.
				</h2>
				<p className="text-muted-foreground text-sm leading-7">
					Studio packages the workflow for evidence, drafting, review, export,
					and follow-up. It should feel like the best product built on top of
					ContractSpec, not a different story.
				</p>
			</div>

			<div className="grid gap-3 sm:grid-cols-2">
				<Link href={studioUrl} className="btn-primary">
					Explore Studio <ArrowRight className="ml-2 h-4 w-4" />
				</Link>
				<Link href={studioDocsUrl} className="btn-ghost">
					Read Studio docs
				</Link>
			</div>
		</div>
	);
}
