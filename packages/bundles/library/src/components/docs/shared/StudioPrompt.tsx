import Link from '@contractspec/lib.ui-link';

interface StudioPromptProps {
	title?: string;
	body?: string;
	ctaLabel?: string;
	href?: string;
}

export function StudioPrompt({
	title = 'Need the operating layer on top of OSS ContractSpec?',
	body = 'ContractSpec Studio helps teams turn evidence into proposed spec changes, governed delivery loops, and execution-ready task packs while keeping the open contract system as the source of truth.',
	ctaLabel = 'See what Studio adds',
	href = 'https://www.contractspec.studio/docs',
}: StudioPromptProps) {
	return (
		<div className="card-subtle space-y-3 p-6">
			<h3 className="font-semibold text-lg">{title}</h3>
			<p className="text-muted-foreground text-sm">{body}</p>
			<Link href={href} className="btn-primary">
				{ctaLabel}
			</Link>
		</div>
	);
}
