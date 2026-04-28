'use client';

import { Text } from '@contractspec/lib.design-system/typography';
import type { FinanceOpsDraftStatus } from './finance-ops-ai-workflows-demo-session';

export function StatusBadge({
	className,
	status,
}: {
	className?: string;
	status: FinanceOpsDraftStatus;
}) {
	return (
		<Text
			className={[
				'inline-flex min-w-0 items-center justify-center rounded-full border px-2.5 py-1 font-semibold text-[0.68rem] uppercase leading-none',
				status === 'marked_ready'
					? 'border-primary/40 bg-primary/10 text-primary'
					: status === 'changes_requested'
						? 'border-destructive/30 bg-destructive/10 text-destructive'
						: status === 'draft_ready'
							? 'border-amber-500/30 bg-amber-500/10 text-amber-700'
							: 'border-border bg-muted text-muted-foreground',
				className,
			]
				.filter(Boolean)
				.join(' ')}
		>
			<span className="truncate">{formatBadgeStatus(status)}</span>
		</Text>
	);
}

function formatBadgeStatus(status: FinanceOpsDraftStatus): string {
	switch (status) {
		case 'draft_ready':
			return 'draft ready';
		case 'changes_requested':
			return 'changes requested';
		case 'marked_ready':
			return 'ready for handoff';
		default:
			return 'not started';
	}
}
