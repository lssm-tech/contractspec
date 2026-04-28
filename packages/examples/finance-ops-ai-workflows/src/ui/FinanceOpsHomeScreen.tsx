'use client';

import { Button } from '@contractspec/lib.design-system';
import { HStack, VStack } from '@contractspec/lib.design-system/layout';
import { H2, Text } from '@contractspec/lib.design-system/typography';
import type { FinanceOpsDemoScenario } from '../fixtures';
import { MetricGrid, PreviewPanel } from './FinanceOpsPreviewParts';
import {
	type FinanceOpsPreviewModel,
	type FinanceOpsPreviewScreenId,
} from './finance-ops-ai-workflows-preview.model';

export function FinanceOpsHomeScreen({
	model,
	onSelectScenario,
	onSelectScreen,
}: {
	model: FinanceOpsPreviewModel;
	onSelectScenario: (scenarioId: FinanceOpsDemoScenario['id']) => void;
	onSelectScreen: (screen: FinanceOpsPreviewScreenId) => void;
}) {
	return (
		<VStack gap="lg">
			<VStack gap="sm" className="rounded-lg border border-border bg-card p-5">
				<Text className="font-semibold text-muted-foreground text-xs uppercase">
					Finance mission cockpit
				</Text>
				<H2 className="font-serif text-3xl tracking-normal">
					Finance Ops AI Workflows
				</H2>
				<Text className="max-w-4xl text-muted-foreground text-sm leading-6">
					A demo-ready ContractSpec template for turning DAF, cash, reporting,
					procedures and AI adoption work into explicit, reviewable workflows.
				</Text>
			</VStack>

			<MetricGrid metrics={model.home.metrics} />

			<HStack align="start" className="gap-5 xl:flex-nowrap">
				<PreviewPanel
					title="Fixture loader"
					description="Switch the entire preview between complete synthetic client situations. Each screen recomputes from the selected fixture set."
				>
					<VStack gap="sm">
						{model.scenario.id === 'pme-recovery' ? (
							<ScenarioCard
								active
								label="PME recovery"
								description="Urgent RAF departure, cash tension and missing reporting."
								onPress={() => onSelectScenario('pme-recovery')}
							/>
						) : (
							<ScenarioCard
								label="PME recovery"
								description="Urgent RAF departure, cash tension and missing reporting."
								onPress={() => onSelectScenario('pme-recovery')}
							/>
						)}
						{model.scenario.id === 'reporting-reset' ? (
							<ScenarioCard
								active
								label="Reporting reset"
								description="Operating rhythm and management reporting before funding."
								onPress={() => onSelectScenario('reporting-reset')}
							/>
						) : (
							<ScenarioCard
								label="Reporting reset"
								description="Operating rhythm and management reporting before funding."
								onPress={() => onSelectScenario('reporting-reset')}
							/>
						)}
					</VStack>
				</PreviewPanel>

				<PreviewPanel
					title="Workflow journey"
					description={model.scenario.presenterAngle}
				>
					<VStack gap="sm">
						{model.home.stageCards.map((stage) => (
							<Button
								key={stage.label}
								onPress={() => onSelectScreen(stage.screen)}
								className="h-auto justify-start bg-background p-3 text-left"
							>
								<VStack gap="xs" className="items-start">
									<Text className="font-semibold text-sm">{stage.label}</Text>
									<Text className="font-mono text-muted-foreground text-xs">
										{stage.value}
									</Text>
									<Text className="text-muted-foreground text-xs leading-5">
										{stage.detail}
									</Text>
								</VStack>
							</Button>
						))}
					</VStack>
				</PreviewPanel>
			</HStack>
		</VStack>
	);
}

function ScenarioCard({
	active = false,
	description,
	label,
	onPress,
}: {
	active?: boolean;
	description: string;
	label: string;
	onPress: () => void;
}) {
	return (
		<Button
			onPress={onPress}
			className={
				active
					? 'h-auto justify-start bg-primary p-3 text-left text-primary-foreground'
					: 'h-auto justify-start bg-background p-3 text-left'
			}
		>
			<VStack gap="xs" className="items-start">
				<Text className="font-semibold text-sm">{label}</Text>
				<Text className="text-xs leading-5 opacity-80">{description}</Text>
			</VStack>
		</Button>
	);
}
