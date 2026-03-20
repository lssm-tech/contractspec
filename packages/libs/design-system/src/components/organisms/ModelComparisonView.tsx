'use client';

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { RankBadge } from '../atoms/RankBadge';
import {
	type DimensionScore,
	DimensionScoresCard,
} from '../molecules/DimensionScoresCard';
import { StatCard } from '../molecules/StatCard';

export interface ComparisonModel {
	modelId: string;
	providerKey: string;
	displayName?: string;
	compositeScore: number;
	rank: number;
	previousRank?: number | null;
	dimensionScores: Partial<Record<string, DimensionScore>>;
	updatedAt?: string | Date;
}

export interface ModelComparisonViewProps {
	models: ComparisonModel[];
	title?: string;
	className?: string;
}

export function ModelComparisonView({
	models,
	title = 'Model Comparison',
	className,
}: ModelComparisonViewProps) {
	if (models.length === 0) {
		return (
			<Card className={className}>
				<CardContent className="py-8 text-center">
					<p className="text-muted-foreground">
						No models selected for comparison.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className={cn('flex flex-col gap-4', className)}>
			<h2 className="font-semibold text-xl">{title}</h2>

			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
				{models.map((model) => (
					<StatCard
						key={model.modelId}
						label={model.displayName ?? model.modelId}
						value={Math.round(model.compositeScore * 10) / 10}
						hint={model.providerKey}
						icon={
							<RankBadge
								rank={model.rank}
								previousRank={model.previousRank}
								size="sm"
							/>
						}
					/>
				))}
			</div>

			<div
				className={cn(
					'grid gap-4',
					models.length === 1 && 'grid-cols-1',
					models.length === 2 && 'grid-cols-1 md:grid-cols-2',
					models.length >= 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
				)}
			>
				{models.map((model) => (
					<DimensionScoresCard
						key={model.modelId}
						dimensionScores={model.dimensionScores}
						title={model.displayName ?? model.modelId}
						size="sm"
					/>
				))}
			</div>

			{models.length >= 2 && <ComparisonTable models={models} />}
		</div>
	);
}

function ComparisonTable({ models }: { models: ComparisonModel[] }) {
	const allDimensions = Array.from(
		new Set(models.flatMap((m) => Object.keys(m.dimensionScores)))
	).sort();

	if (allDimensions.length === 0) return null;

	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="text-base">Head-to-Head</CardTitle>
			</CardHeader>
			<CardContent className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b">
							<th className="py-2 text-left font-medium text-muted-foreground">
								Dimension
							</th>
							{models.map((m) => (
								<th
									key={m.modelId}
									className="py-2 text-right font-medium text-muted-foreground"
								>
									{m.displayName ?? m.modelId}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{allDimensions.map((dim) => {
							const scores = models.map(
								(m) => m.dimensionScores[dim]?.score ?? null
							);
							const best = Math.max(
								...scores.filter((s): s is number => s !== null)
							);

							return (
								<tr key={dim} className="border-b last:border-0">
									<td className="py-2 capitalize">{dim}</td>
									{scores.map((score, i) => {
										const model = models[i];
										if (!model) return null;
										return (
											<td
												key={model.modelId}
												className={cn(
													'py-2 text-right tabular-nums',
													score === best &&
														scores.filter((s) => s !== null).length > 1
														? 'font-semibold text-green-600 dark:text-green-400'
														: ''
												)}
											>
												{score != null
													? (Math.round(score * 10) / 10).toFixed(1)
													: '–'}
											</td>
										);
									})}
								</tr>
							);
						})}
						<tr className="border-t-2 font-semibold">
							<td className="py-2">Composite</td>
							{models.map((m) => (
								<td key={m.modelId} className="py-2 text-right tabular-nums">
									{(Math.round(m.compositeScore * 10) / 10).toFixed(1)}
								</td>
							))}
						</tr>
					</tbody>
				</table>
			</CardContent>
		</Card>
	);
}
