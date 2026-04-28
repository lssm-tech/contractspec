'use client';

import { HStack, VStack } from '@contractspec/lib.design-system/layout';
import { Text } from '@contractspec/lib.design-system/typography';
import { useMemo, useState } from 'react';
import type { FinanceOpsDemoScenario } from '../fixtures';
import { FinanceOpsHomeScreen } from './FinanceOpsHomeScreen';
import {
	CashAgingScreen,
	MissionIntakeScreen,
} from './FinanceOpsMissionCashScreens';
import { ReviewRail, ScreenNav } from './FinanceOpsPreviewParts';
import {
	AdoptionRoiScreen,
	ProcedureDraftScreen,
	ReportingNarrativeScreen,
} from './FinanceOpsProcedureReportingAdoptionScreens';
import {
	buildFinanceOpsPreviewModel,
	type FinanceOpsPreviewScreenId,
} from './finance-ops-ai-workflows-preview.model';

export function FinanceOpsAiWorkflowsPreview() {
	const [scenarioId, setScenarioId] =
		useState<FinanceOpsDemoScenario['id']>('pme-recovery');
	const [activeScreen, setActiveScreen] =
		useState<FinanceOpsPreviewScreenId>('home');
	const model = useMemo(
		() => buildFinanceOpsPreviewModel(scenarioId),
		[scenarioId]
	);

	return (
		<VStack as="section" gap="lg" className="p-4 sm:p-5">
			<HStack align="center" justify="between" className="gap-4 lg:flex-nowrap">
				<VStack gap="xs" className="min-w-0 flex-1">
					<Text className="font-semibold text-muted-foreground text-xs uppercase">
						{model.scenario.label}
					</Text>
					<Text className="font-semibold text-2xl leading-tight">
						{model.scenario.oneLine}
					</Text>
				</VStack>
				<Text className="max-w-md rounded-lg border border-border bg-card p-3 text-muted-foreground text-xs leading-5">
					{model.scenario.clientProfile}
				</Text>
			</HStack>

			<ScreenNav
				activeScreen={activeScreen}
				onSelect={setActiveScreen}
				screens={model.screens}
			/>

			<HStack align="start" className="gap-5 2xl:flex-nowrap">
				<VStack gap="lg" className="min-w-0 flex-[1.6]">
					{renderScreen(activeScreen, model, setScenarioId, setActiveScreen)}
				</VStack>
				<VStack className="min-w-[18rem] flex-1">
					<ReviewRail
						cashDecision={model.reviewPanel.cashDecision}
						currency={model.cash.result.currency}
						decisionMoment={model.reviewPanel.decisionMoment}
						nextWorkflow={model.reviewPanel.nextWorkflow}
						presenterAngle={model.reviewPanel.presenterAngle}
						totalExposure={model.cash.result.totalExposure}
					/>
				</VStack>
			</HStack>
		</VStack>
	);
}

function renderScreen(
	activeScreen: FinanceOpsPreviewScreenId,
	model: ReturnType<typeof buildFinanceOpsPreviewModel>,
	setScenarioId: (scenarioId: FinanceOpsDemoScenario['id']) => void,
	setActiveScreen: (screen: FinanceOpsPreviewScreenId) => void
) {
	switch (activeScreen) {
		case 'mission':
			return <MissionIntakeScreen model={model} />;
		case 'cash':
			return <CashAgingScreen model={model} />;
		case 'procedure':
			return <ProcedureDraftScreen model={model} />;
		case 'reporting':
			return <ReportingNarrativeScreen model={model} />;
		case 'adoption':
			return <AdoptionRoiScreen model={model} />;
		default:
			return (
				<FinanceOpsHomeScreen
					model={model}
					onSelectScenario={setScenarioId}
					onSelectScreen={setActiveScreen}
				/>
			);
	}
}
