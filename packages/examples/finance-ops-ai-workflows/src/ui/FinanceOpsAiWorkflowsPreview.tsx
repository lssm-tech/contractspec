'use client';

import { Box, VStack } from '@contractspec/lib.design-system/layout';
import { Text } from '@contractspec/lib.design-system/typography';
import { useMemo, useReducer } from 'react';
import { financeOpsDemoScenarios } from '../fixtures';
import { DemoCommandBar } from './FinanceOpsPreviewParts';
import { FinanceOpsPreviewRouter } from './FinanceOpsPreviewRouter';
import { WorkflowRail } from './FinanceOpsWorkflowRail';
import {
	createFinanceOpsDemoSession,
	financeOpsDemoSessionReducer,
	getActiveWorkflowId,
} from './finance-ops-ai-workflows-demo-session';
import { buildFinanceOpsPreviewModel } from './finance-ops-ai-workflows-preview.model';

export function FinanceOpsAiWorkflowsPreview() {
	const [session, dispatch] = useReducer(
		financeOpsDemoSessionReducer,
		'pme-recovery',
		createFinanceOpsDemoSession
	);
	const model = useMemo(
		() => buildFinanceOpsPreviewModel(session.scenarioId),
		[session.scenarioId]
	);
	const activeWorkflow = getActiveWorkflowId(session.activeScreen);
	const activeWorkflowLabel =
		model.screens.find((screen) => screen.id === activeWorkflow)?.label ??
		activeWorkflow;

	return (
		<VStack as="section" gap="lg" className="p-4 sm:p-5">
			<Box
				align="start"
				justify="start"
				className="!grid grid-cols-1 gap-4 xl:grid-cols-2"
				style={{ display: 'grid' }}
			>
				<VStack gap="xs" className="min-w-0 flex-1">
					<Text className="font-semibold text-muted-foreground text-xs uppercase">
						{model.scenario.label}
					</Text>
					<Text className="min-h-[3.5rem] font-semibold text-2xl leading-tight">
						{model.scenario.oneLine}
					</Text>
				</VStack>
				<Text className="max-w-md rounded-lg border border-border bg-card p-3 text-muted-foreground text-xs leading-5 xl:justify-self-end">
					{model.scenario.clientProfile}
				</Text>
			</Box>

			<DemoCommandBar
				activeScreen={session.activeScreen}
				onResetReplay={() => dispatch({ type: 'reset_replay' })}
				onRunWorkflow={(workflow) =>
					dispatch({ type: 'run_workflow', workflow })
				}
				onSelectScenario={(scenarioId) =>
					dispatch({ type: 'select_scenario', scenarioId })
				}
				scenarioId={session.scenarioId}
				scenarios={financeOpsDemoScenarios}
				status={session.draftStatuses[activeWorkflow]}
				workflowLabel={activeWorkflowLabel}
			/>

			<div className="flex min-w-0 flex-col gap-4 lg:flex-row">
				<div className="min-w-0 lg:w-64 lg:shrink-0">
					<WorkflowRail
						activeWorkflow={activeWorkflow}
						draftStatuses={session.draftStatuses}
						onSelect={(screen) => dispatch({ type: 'select_screen', screen })}
						screens={model.screens}
					/>
				</div>
				<div className="min-w-0 flex-1">
					<FinanceOpsPreviewRouter
						activeScreen={session.activeScreen}
						dispatch={dispatch}
						model={model}
						session={session}
					/>
				</div>
			</div>
		</VStack>
	);
}
