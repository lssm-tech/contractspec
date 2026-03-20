'use client';

import { Button, Input } from '@contractspec/lib.design-system';
/**
 * CreateAgentModal - Form for creating a new AI agent
 *
 * Wires to CreateAgentCommand via useAgentMutations hook.
 */
import { useState } from 'react';

// Local type definition for modal props
export interface CreateAgentInput {
	name: string;
	description?: string;
	modelProvider: string;
	modelName: string;
	systemPrompt?: string;
}

interface CreateAgentModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (input: CreateAgentInput) => Promise<void>;
	isLoading?: boolean;
}

const MODEL_PROVIDERS = [
	{
		value: 'openai',
		label: 'OpenAI',
		models: ['gpt-5.4', 'gpt-5-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
	},
	{
		value: 'anthropic',
		label: 'Anthropic',
		models: ['claude-sonnet-4-6', 'claude-opus-4-6', 'claude-haiku-4-5'],
	},
	{
		value: 'google',
		label: 'Google',
		models: [
			'gemini-2.5-flash',
			'gemini-2.5-pro',
			'gemini-pro',
			'gemini-ultra',
		],
	},
	{
		value: 'mistral',
		label: 'Mistral',
		models: [
			'mistral-large-2512',
			'mistral-large-latest',
			'mistral-medium-latest',
			'mistral-small-latest',
		],
	},
] as const;

type ModelProvider = (typeof MODEL_PROVIDERS)[number]['value'];

export function CreateAgentModal({
	isOpen,
	onClose,
	onSubmit,
	isLoading = false,
}: CreateAgentModalProps) {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [modelProvider, setModelProvider] = useState<ModelProvider>('openai');
	const [modelName, setModelName] = useState('gpt-5.4');
	const [systemPrompt, setSystemPrompt] = useState('');
	const [error, setError] = useState<string | null>(null);

	const selectedProvider = MODEL_PROVIDERS.find(
		(p) => p.value === modelProvider
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		// Validation
		if (!name.trim()) {
			setError('Agent name is required');
			return;
		}

		try {
			await onSubmit({
				name: name.trim(),
				description: description.trim() || undefined,
				modelProvider,
				modelName,
				systemPrompt: systemPrompt.trim() || undefined,
			});

			// Reset form
			setName('');
			setDescription('');
			setModelProvider('openai');
			setModelName('gpt-5.4');
			setSystemPrompt('');
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to create agent');
		}
	};

	// Update model when provider changes
	const handleProviderChange = (provider: ModelProvider) => {
		setModelProvider(provider);
		const providerConfig = MODEL_PROVIDERS.find((p) => p.value === provider);
		if (providerConfig) {
			setModelName(providerConfig.models[0]);
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
			<div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-xl">
				<h2 className="mb-4 font-semibold text-xl">Create New Agent</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Agent Name */}
					<div>
						<label
							htmlFor="agent-name"
							className="mb-1 block font-medium text-muted-foreground text-sm"
						>
							Agent Name *
						</label>
						<Input
							id="agent-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g., Customer Support Bot"
							disabled={isLoading}
						/>
					</div>

					{/* Description */}
					<div>
						<label
							htmlFor="agent-description"
							className="mb-1 block font-medium text-muted-foreground text-sm"
						>
							Description
						</label>
						<textarea
							id="agent-description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Describe what this agent does..."
							rows={2}
							disabled={isLoading}
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
						/>
					</div>

					{/* Model Provider & Model */}
					<div className="flex gap-3">
						<div className="flex-1">
							<label
								htmlFor="model-provider"
								className="mb-1 block font-medium text-muted-foreground text-sm"
							>
								Provider *
							</label>
							<select
								id="model-provider"
								value={modelProvider}
								onChange={(e) =>
									handleProviderChange(e.target.value as ModelProvider)
								}
								disabled={isLoading}
								className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
							>
								{MODEL_PROVIDERS.map((p) => (
									<option key={p.value} value={p.value}>
										{p.label}
									</option>
								))}
							</select>
						</div>
						<div className="flex-1">
							<label
								htmlFor="model-name"
								className="mb-1 block font-medium text-muted-foreground text-sm"
							>
								Model *
							</label>
							<select
								id="model-name"
								value={modelName}
								onChange={(e) => setModelName(e.target.value)}
								disabled={isLoading}
								className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
							>
								{selectedProvider?.models.map((m) => (
									<option key={m} value={m}>
										{m}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* System Prompt */}
					<div>
						<label
							htmlFor="system-prompt"
							className="mb-1 block font-medium text-muted-foreground text-sm"
						>
							System Prompt
						</label>
						<textarea
							id="system-prompt"
							value={systemPrompt}
							onChange={(e) => setSystemPrompt(e.target.value)}
							placeholder="You are a helpful assistant that..."
							rows={4}
							disabled={isLoading}
							className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
						/>
						<p className="mt-1 text-muted-foreground text-xs">
							Instructions that define the agent's behavior
						</p>
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
							{isLoading ? 'Creating...' : 'Create Agent'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
