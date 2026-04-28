'use client';

import { Button } from '@contractspec/lib.design-system';
import { VStack } from '@contractspec/lib.design-system/layout';
import { Text } from '@contractspec/lib.design-system/typography';
import { StatusBadge } from './FinanceOpsStatusBadge';
import type {
	FinanceOpsDemoSession,
	FinanceOpsWorkflowScreenId,
} from './finance-ops-ai-workflows-demo-session';
import type { FinanceOpsPreviewScreen } from './finance-ops-ai-workflows-preview.model';

export function WorkflowRail({
	activeWorkflow,
	draftStatuses,
	onSelect,
	screens,
}: {
	activeWorkflow: FinanceOpsWorkflowScreenId;
	draftStatuses: FinanceOpsDemoSession['draftStatuses'];
	onSelect: (workflow: FinanceOpsWorkflowScreenId) => void;
	screens: readonly FinanceOpsPreviewScreen[];
}) {
	const workflows = screens.filter(
		(screen): screen is FinanceOpsPreviewScreen & {
			id: FinanceOpsWorkflowScreenId;
		} => screen.id !== 'home'
	);

	return (
		<VStack
			as="nav"
			gap="sm"
			className="min-w-0 rounded-lg border border-border p-3 xl:sticky xl:top-4"
		>
			<Text className="font-semibold text-muted-foreground text-xs uppercase">
				Workflow
			</Text>
			{workflows.map((screen, index) => (
				<Button
					key={screen.id}
					onPress={() => onSelect(screen.id)}
					variant={screen.id === activeWorkflow ? 'default' : 'outline'}
					className={[
						'h-auto min-h-16 w-full min-w-0 justify-start overflow-hidden p-0 text-left',
						screen.id === activeWorkflow
							? ''
							: 'bg-background text-foreground',
					].join(' ')}
				>
					<VStack gap="xs" className="min-w-0 px-3 py-2">
						<Text className="font-semibold text-[0.68rem] uppercase opacity-70">
							{String(index + 1).padStart(2, '0')}
						</Text>
						<Text className="truncate font-semibold text-sm">
							{screen.label}
						</Text>
						<StatusBadge
							status={draftStatuses[screen.id]}
							className={screen.id === activeWorkflow ? 'bg-background/20' : ''}
						/>
					</VStack>
				</Button>
			))}
		</VStack>
	);
}
