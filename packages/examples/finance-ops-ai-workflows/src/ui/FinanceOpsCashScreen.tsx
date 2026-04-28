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

export function CashAgingScreen({
	model,
	onMarkReady,
	onRequestChanges,
	onSelectInvoice,
	selectedInvoiceId,
	status,
}: {
	model: FinanceOpsPreviewModel;
	onMarkReady: () => void;
	onRequestChanges: () => void;
	onSelectInvoice: (invoiceId: string) => void;
	selectedInvoiceId: string;
	status: FinanceOpsDraftStatus;
}) {
	const selected =
		model.cash.priorities.find(
			(priority) => priority.invoiceId === selectedInvoiceId
		) ?? model.cash.priorities[0];
	const selectedAction = model.cash.actions.find(
		(action) => readString(action, 'invoiceId') === selected?.invoiceId
	);

	return (
		<WorkflowWorkspace
			detail={
				<DetailPanel
					eyebrow="Selected detail"
					onMarkReady={onMarkReady}
					onRequestChanges={onRequestChanges}
					status={status}
					title={selected?.invoiceId ?? 'Invoice'}
				>
					<DetailField label="Client" value={selected?.clientName ?? ''} />
					<DetailField label="Amount" value={selected?.amountLabel ?? ''} />
					<DetailField label="Owner" value={selected?.owner ?? ''} />
					<DetailField
						label="Dispute"
						value={
							selected?.priority === 'dispute'
								? 'Pricing or scope dispute to clarify before collection.'
								: 'No dispute flagged in the synthetic aging row.'
						}
					/>
					<DetailField
						label="Follow-up"
						value={readString(
							selectedAction ?? {},
							'action',
							selected?.action ?? ''
						)}
					/>
					<DetailField
						label="Evidence"
						value="Confirm invoice, owner note, due date and client promise before sending anything."
					/>
				</DetailPanel>
			}
			list={model.cash.priorities.map((priority) => (
				<SelectableRow
					badge={priority.priority}
					key={priority.invoiceId}
					label={priority.invoiceId}
					meta={`${priority.clientName} · ${priority.owner}`}
					onSelect={() => onSelectInvoice(priority.invoiceId)}
					selected={priority.invoiceId === selected?.invoiceId}
					value={priority.amountLabel}
				/>
			))}
			listTitle="Aging priorities"
			metrics={[
				{
					label: 'Total exposure',
					value: formatMoney(
						model.cash.result.totalExposure,
						model.cash.result.currency
					),
				},
				{
					label: 'Overdue',
					value: formatMoney(
						model.cash.result.overdueExposure,
						model.cash.result.currency
					),
				},
				{
					label: 'Disputed',
					value: formatMoney(
						model.cash.result.disputedExposure,
						model.cash.result.currency
					),
				},
				{ label: 'Decision', value: model.cash.result.workflowDecision },
			]}
			status={status}
			summary={model.cash.result.executiveSummary}
			title="Cash aging"
		/>
	);
}
