'use client';

import { Button } from '@contractspec/lib.design-system';
import { Box, VStack } from '@contractspec/lib.design-system/layout';
import { Text } from '@contractspec/lib.design-system/typography';
import type { FinanceOpsDemoScenario } from '../fixtures';
import { StatusBadge } from './FinanceOpsStatusBadge';
import {
	type FinanceOpsDraftStatus,
	type FinanceOpsWorkflowScreenId,
	getActiveWorkflowId,
} from './finance-ops-ai-workflows-demo-session';
import type { FinanceOpsPreviewScreenId } from './finance-ops-ai-workflows-preview.model';

export function DemoCommandBar({
	activeScreen,
	onResetReplay,
	onRunWorkflow,
	onSelectScenario,
	scenarioId,
	scenarios,
	status,
	workflowLabel,
}: {
	activeScreen: FinanceOpsPreviewScreenId;
	onResetReplay: () => void;
	onRunWorkflow: (workflow: FinanceOpsWorkflowScreenId) => void;
	onSelectScenario: (scenarioId: FinanceOpsDemoScenario['id']) => void;
	scenarioId: FinanceOpsDemoScenario['id'];
	scenarios: readonly FinanceOpsDemoScenario[];
	status: FinanceOpsDraftStatus;
	workflowLabel: string;
}) {
	const activeWorkflow = getActiveWorkflowId(activeScreen);

	return (
		<Box
			align="stretch"
			justify="between"
			className="!grid grid-cols-1 gap-3 rounded-lg border border-border bg-card p-3 lg:grid-cols-2"
			style={{ display: 'grid' }}
		>
			<VStack gap="xs" className="min-w-0">
				<Text className="font-semibold text-muted-foreground text-xs uppercase">
					Scenario
				</Text>
				<Box
					align="stretch"
					justify="start"
					className="!grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2"
					style={{ display: 'grid' }}
				>
					{scenarios.map((scenario) => (
						<Button
							key={scenario.id}
							onPress={() => onSelectScenario(scenario.id)}
							variant={scenario.id === scenarioId ? 'default' : 'outline'}
							className={[
								'min-h-9 min-w-0 justify-center overflow-hidden px-3',
								scenario.id === scenarioId
									? ''
									: 'bg-background text-foreground',
							].join(' ')}
						>
							<span className="truncate">{scenario.label}</span>
						</Button>
					))}
				</Box>
			</VStack>
			<Box
				align="stretch"
				justify="end"
				className="!grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3"
				style={{ display: 'grid' }}
			>
				<VStack
					gap="xs"
					className="min-w-0 rounded-md border border-border bg-background px-3 py-2"
				>
					<Text className="truncate text-muted-foreground text-xs uppercase">
						{workflowLabel}
					</Text>
					<StatusBadge status={status} />
				</VStack>
				<Button onPress={() => onRunWorkflow(activeWorkflow)}>
					Run draft
				</Button>
				<Button
					onPress={onResetReplay}
					variant="outline"
					className="bg-background text-foreground"
				>
					Reset replay
				</Button>
			</Box>
		</Box>
	);
}

export function formatDraftStatus(status: FinanceOpsDraftStatus): string {
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
