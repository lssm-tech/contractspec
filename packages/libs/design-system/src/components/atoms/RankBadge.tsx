'use client';

import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
	'inline-flex items-center justify-center gap-1 rounded-md font-semibold tabular-nums',
	{
		variants: {
			size: {
				sm: 'h-6 min-w-6 px-1.5 text-xs',
				md: 'h-8 min-w-8 px-2 text-sm',
				lg: 'h-10 min-w-10 px-3 text-base',
			},
		},
		defaultVariants: { size: 'md' },
	}
);

export type RankBadgeProps = VariantProps<typeof badgeVariants> & {
	rank: number;
	previousRank?: number | null;
	className?: string;
};

function rankStyle(rank: number): string {
	if (rank === 1)
		return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
	if (rank === 2)
		return 'bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300';
	if (rank === 3)
		return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
	return 'bg-muted text-muted-foreground';
}

function TrendIndicator({
	rank,
	previousRank,
}: {
	rank: number;
	previousRank: number;
}) {
	const diff = previousRank - rank;
	if (diff > 0) {
		return (
			<span
				className="text-green-600 text-xs dark:text-green-400"
				aria-label={`Up ${diff}`}
			>
				▲
			</span>
		);
	}
	if (diff < 0) {
		return (
			<span
				className="text-red-600 text-xs dark:text-red-400"
				aria-label={`Down ${Math.abs(diff)}`}
			>
				▼
			</span>
		);
	}
	return (
		<span className="text-muted-foreground text-xs" aria-label="Unchanged">
			–
		</span>
	);
}

export function RankBadge({
	rank,
	previousRank,
	size,
	className,
}: RankBadgeProps) {
	return (
		<span className={cn(badgeVariants({ size }), rankStyle(rank), className)}>
			<span>#{rank}</span>
			{previousRank != null && (
				<TrendIndicator rank={rank} previousRank={previousRank} />
			)}
		</span>
	);
}
