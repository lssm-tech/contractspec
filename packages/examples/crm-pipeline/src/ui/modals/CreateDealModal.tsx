'use client';

import { Button, Input } from '@contractspec/lib.design-system';
/**
 * CreateDealModal - Form for creating a new deal
 *
 * Wires to CreateDealContract via useDealMutations hook.
 */
import { useState } from 'react';

// Local type definition for modal props
export interface CreateDealInput {
	name: string;
	value: number;
	currency: string;
	pipelineId: string;
	stageId: string;
	expectedCloseDate?: Date;
	contactId?: string;
	companyId?: string;
}

interface CreateDealModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (input: CreateDealInput) => Promise<void>;
	stages: { id: string; name: string }[];
	isLoading?: boolean;
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD'];
const DEFAULT_PIPELINE_ID = 'pipeline-1';

export function CreateDealModal({
	isOpen,
	onClose,
	onSubmit,
	stages,
	isLoading = false,
}: CreateDealModalProps) {
	const [name, setName] = useState('');
	const [value, setValue] = useState('');
	const [currency, setCurrency] = useState('USD');
	const [stageId, setStageId] = useState(stages[0]?.id ?? '');
	const [expectedCloseDate, setExpectedCloseDate] = useState('');
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		// Validation
		if (!name.trim()) {
			setError('Deal name is required');
			return;
		}

		const numericValue = parseFloat(value);
		if (isNaN(numericValue) || numericValue <= 0) {
			setError('Value must be a positive number');
			return;
		}

		if (!stageId) {
			setError('Please select a pipeline stage');
			return;
		}

		try {
			await onSubmit({
				name: name.trim(),
				value: numericValue,
				currency,
				pipelineId: DEFAULT_PIPELINE_ID,
				stageId,
				expectedCloseDate: expectedCloseDate
					? new Date(expectedCloseDate)
					: undefined,
			});

			// Reset form
			setName('');
			setValue('');
			setCurrency('USD');
			setStageId(stages[0]?.id ?? '');
			setExpectedCloseDate('');
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to create deal');
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-background/80 backdrop-blur-sm"
				onClick={onClose}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') onClose();
				}}
				aria-label="Close modal"
			/>

			{/* Modal */}
			<div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
				<h2 className="mb-4 font-semibold text-xl">Create New Deal</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Deal Name */}
					<div>
						<label
							htmlFor="deal-name"
							className="mb-1 block font-medium text-muted-foreground text-sm"
						>
							Deal Name *
						</label>
						<Input
							id="deal-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g., Enterprise License - Acme Corp"
							disabled={isLoading}
						/>
					</div>

					{/* Value & Currency */}
					<div className="flex gap-3">
						<div className="flex-1">
							<label
								htmlFor="deal-value"
								className="mb-1 block font-medium text-muted-foreground text-sm"
							>
								Value *
							</label>
							<Input
								id="deal-value"
								type="number"
								min="0"
								step="0.01"
								value={value}
								onChange={(e) => setValue(e.target.value)}
								placeholder="50000"
								disabled={isLoading}
							/>
						</div>
						<div className="w-24">
							<label
								htmlFor="deal-currency"
								className="mb-1 block font-medium text-muted-foreground text-sm"
							>
								Currency
							</label>
							<select
								id="deal-currency"
								value={currency}
								onChange={(e) => setCurrency(e.target.value)}
								disabled={isLoading}
								className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
							>
								{CURRENCIES.map((c) => (
									<option key={c} value={c}>
										{c}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Stage */}
					<div>
						<label
							htmlFor="deal-stage"
							className="mb-1 block font-medium text-muted-foreground text-sm"
						>
							Pipeline Stage *
						</label>
						<select
							id="deal-stage"
							value={stageId}
							onChange={(e) => setStageId(e.target.value)}
							disabled={isLoading}
							className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
						>
							{stages.map((stage) => (
								<option key={stage.id} value={stage.id}>
									{stage.name}
								</option>
							))}
						</select>
					</div>

					{/* Expected Close Date */}
					<div>
						<label
							htmlFor="deal-close-date"
							className="mb-1 block font-medium text-muted-foreground text-sm"
						>
							Expected Close Date
						</label>
						<Input
							id="deal-close-date"
							type="date"
							value={expectedCloseDate}
							onChange={(e) => setExpectedCloseDate(e.target.value)}
							disabled={isLoading}
						/>
					</div>

					{/* Error Message */}
					{error && (
						<div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
							{error}
						</div>
					)}

					{/* Actions */}
					<div className="flex justify-end gap-3 pt-2">
						<Button
							type="button"
							variant="ghost"
							onPress={onClose}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? 'Creating...' : 'Create Deal'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
