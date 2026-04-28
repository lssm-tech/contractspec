import type { normalizeKpiRow } from './finance-ops-ai-workflows.guards';

export function buildProcedureSteps(
	cash: boolean,
	reporting: boolean,
	funding: boolean
): string[] {
	const steps = [
		'Capture request and evidence',
		'Assign owner',
		'Run reviewer checklist',
		'Log exceptions',
		'Confirm management validation',
	];
	if (cash) {
		steps.push(
			'Review aging and payment promises',
			'Escalate overdue disputes'
		);
	}
	if (reporting) {
		steps.push('Reconcile source data', 'Review variances before sign-off');
	}
	if (funding) {
		steps.push('Validate assumptions and evidence before submission');
	}
	return steps;
}

export function buildProcedureControls(
	cash: boolean,
	reporting: boolean,
	funding: boolean
): string[] {
	const controls = [
		'Named validation owner',
		'Evidence archive',
		'Exception log',
		'Management sign-off',
	];
	if (cash) {
		controls.push(
			'Payment promise tracking',
			'Dispute tracking',
			'Escalation threshold to define'
		);
	}
	if (reporting) {
		controls.push(
			'Data source reconciliation',
			'Variance review',
			'Deadline control'
		);
	}
	if (funding) {
		controls.push(
			'Assumption evidence',
			'Submission validation',
			'Owner review'
		);
	}
	return controls;
}

export function buildVarianceHighlight(
	row: ReturnType<typeof normalizeKpiRow>
) {
	const varianceVsTarget =
		row.targetValue === undefined
			? undefined
			: row.currentValue - row.targetValue;
	const varianceVsPrevious =
		row.previousValue === undefined
			? undefined
			: row.currentValue - row.previousValue;
	const targetBase =
		row.targetValue === undefined || row.targetValue === 0
			? undefined
			: Math.abs(row.targetValue);
	const ratio =
		targetBase === undefined || varianceVsTarget === undefined
			? undefined
			: Math.abs(varianceVsTarget) / targetBase;
	let classification:
		| 'above_target'
		| 'below_target'
		| 'stable'
		| 'needs_context';
	if (ratio === undefined || varianceVsTarget === undefined) {
		classification = 'needs_context';
	} else if (ratio >= 0.1 && varianceVsTarget < 0) {
		classification = 'below_target';
	} else if (ratio >= 0.1 && varianceVsTarget > 0) {
		classification = 'above_target';
	} else {
		classification = 'stable';
	}
	return {
		metric: row.metric,
		owner: row.owner,
		classification,
		varianceVsPrevious,
		varianceVsTarget,
		note:
			classification === 'needs_context'
				? 'Needs context; no cause inferred.'
				: row.notes,
	};
}
