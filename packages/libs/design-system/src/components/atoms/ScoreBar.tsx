'use client';

import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const sizeVariants = cva('rounded-full', {
	variants: {
		size: {
			sm: 'h-2',
			md: 'h-3',
			lg: 'h-4',
		},
	},
	defaultVariants: { size: 'md' },
});

export type ScoreBarProps = VariantProps<typeof sizeVariants> & {
	score: number;
	label?: string;
	maxScore?: number;
	showValue?: boolean;
	className?: string;
};

function scoreColor(pct: number): string {
	if (pct >= 75) return 'bg-green-500';
	if (pct >= 50) return 'bg-yellow-500';
	if (pct >= 25) return 'bg-orange-500';
	return 'bg-red-500';
}

export function ScoreBar({
	score,
	label,
	maxScore = 100,
	showValue = true,
	size,
	className,
}: ScoreBarProps) {
	const pct = Math.max(0, Math.min(100, (score / maxScore) * 100));

	return (
		<div className={cn('flex flex-col gap-1', className)}>
			{(label || showValue) && (
				<div className="flex items-center justify-between text-sm">
					{label && (
						<span className="text-muted-foreground capitalize">{label}</span>
					)}
					{showValue && (
						<span className="font-medium tabular-nums">
							{Math.round(score * 10) / 10}
						</span>
					)}
				</div>
			)}
			<div
				className={cn(
					'w-full overflow-hidden bg-muted',
					sizeVariants({ size })
				)}
				role="progressbar"
				aria-valuenow={score}
				aria-valuemin={0}
				aria-valuemax={maxScore}
				aria-label={label ?? 'Score'}
			>
				<div
					className={cn(
						'h-full transition-all duration-300',
						sizeVariants({ size }),
						scoreColor(pct)
					)}
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
}
