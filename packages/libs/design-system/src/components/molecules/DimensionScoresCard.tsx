'use client';

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { ScoreBar, type ScoreBarProps } from '../atoms/ScoreBar';

export interface DimensionScore {
	score: number;
	confidence: number;
	sources: string[];
}

export interface DimensionScoresCardProps {
	dimensionScores: Partial<Record<string, DimensionScore>>;
	title?: string;
	size?: ScoreBarProps['size'];
	className?: string;
}

const DIMENSION_ORDER = [
	'coding',
	'reasoning',
	'agentic',
	'cost',
	'latency',
	'context',
	'safety',
	'custom',
] as const;

export function DimensionScoresCard({
	dimensionScores,
	title = 'Dimension Scores',
	size = 'md',
	className,
}: DimensionScoresCardProps) {
	const entries = DIMENSION_ORDER.flatMap((dim) => {
		const score = dimensionScores[dim];
		return score ? [{ dimension: dim, ...score }] : [];
	});

	if (entries.length === 0) return null;

	return (
		<Card className={cn('w-full', className)}>
			<CardHeader className="pb-2">
				<CardTitle className="text-base">{title}</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				{entries.map((entry) => (
					<div key={entry.dimension} className="flex flex-col gap-0.5">
						<ScoreBar score={entry.score} label={entry.dimension} size={size} />
						{entry.confidence < 0.5 && (
							<span className="text-muted-foreground text-xs">
								Low confidence ({Math.round(entry.confidence * 100)}%)
							</span>
						)}
					</div>
				))}
			</CardContent>
		</Card>
	);
}
