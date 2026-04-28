'use client';

import { DetailField, DetailPanel } from './FinanceOpsDetailPanel';
import {
	SelectableRow,
	WorkflowWorkspace,
} from './FinanceOpsCockpitWorkspace';
import type { FinanceOpsDraftStatus } from './finance-ops-ai-workflows-demo-session';
import { formatMoney } from './finance-ops-ai-workflows-preview.format';
import { readString } from './finance-ops-ai-workflows-preview.helpers';
import type { FinanceOpsPreviewModel } from './finance-ops-ai-workflows-preview.model';

export function ReportingNarrativeScreen({
	model,
	onMarkReady,
	onRequestChanges,
	onSelectMetric,
	selectedMetric,
	status,
}: {
	model: FinanceOpsPreviewModel;
	onMarkReady: () => void;
	onRequestChanges: () => void;
	onSelectMetric: (metric: string) => void;
	selectedMetric: string;
	status: FinanceOpsDraftStatus;
}) {
	const selectedHighlight =
		model.reporting.highlights.find(
			(highlight) => readString(highlight, 'metric') === selectedMetric
		) ?? model.reporting.highlights[0];
	const metric = readString(selectedHighlight ?? {}, 'metric');
	const selectedKpi = model.reporting.kpis.find(
		(kpi) => readString(kpi, 'metric') === metric
	);
	const selectedIndex = Math.max(
		0,
		model.reporting.highlights.findIndex(
			(highlight) => readString(highlight, 'metric') === metric
		)
	);

	return (
		<WorkflowWorkspace
			detail={
				<DetailPanel
					eyebrow="Selected detail"
					onMarkReady={onMarkReady}
					onRequestChanges={onRequestChanges}
					status={status}
					title={metric || 'Reporting variance'}
				>
					<DetailField
						label="Current"
						value={formatReportingValue(selectedKpi, 'currentValue', model)}
					/>
					<DetailField
						label="Previous"
						value={formatReportingValue(selectedKpi, 'previousValue', model)}
					/>
					<DetailField
						label="Target"
						value={formatReportingValue(selectedKpi, 'targetValue', model)}
					/>
					<DetailField
						label="Owner"
						value={readString(selectedHighlight ?? {}, 'owner', 'Finance')}
					/>
					<DetailField
						label="Classification"
						value={readString(selectedHighlight ?? {}, 'classification').replaceAll(
							'_',
							' '
						)}
					/>
					<DetailField
						label="Review question"
						value={
							model.reporting.questions[selectedIndex] ??
							model.reporting.questions[0] ??
							'Who owns corrective action?'
						}
					/>
				</DetailPanel>
			}
			list={model.reporting.highlights.map((highlight) => {
				const rowMetric = readString(highlight, 'metric');
				return (
					<SelectableRow
						badge={readString(highlight, 'classification').replaceAll(
							'_',
							' '
						)}
						key={rowMetric}
						label={rowMetric}
						meta={`Owner: ${readString(highlight, 'owner')}`}
						onSelect={() => onSelectMetric(rowMetric)}
						selected={rowMetric === metric}
						value={formatVariance(highlight)}
					/>
				);
			})}
			listTitle="Variance table"
			metrics={[
				{ label: 'Period', value: model.reporting.result.period },
				{ label: 'Audience', value: model.scenario.fixtures.reporting.audience },
				{ label: 'Follow-ups', value: String(model.reporting.followUps.length) },
				{ label: 'Metrics', value: String(model.reporting.highlights.length) },
			]}
			status={status}
			summary={model.reporting.result.executiveSummary}
			title="Reporting narrative"
		/>
	);
}

function formatReportingValue(
	kpi: Record<string, unknown> | undefined,
	key: string,
	model: FinanceOpsPreviewModel
): string {
	if (!kpi) return 'To review';
	const value = kpi[key];
	const unit = readString(kpi, 'unit');
	if (typeof value !== 'number') return 'To review';
	if (unit === 'EUR') return formatMoney(value, model.scenario.fixtures.reporting.currency);
	return `${value} ${unit}`;
}

function formatVariance(highlight: Record<string, unknown>): string {
	const value = highlight.varianceVsTarget;
	return typeof value === 'number' ? String(value) : '';
}
