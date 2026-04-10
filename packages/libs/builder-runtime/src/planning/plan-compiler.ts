import type {
	BuilderBlueprint,
	BuilderPlan,
	BuilderPolicyClassification,
	BuilderWorkspace,
} from '@contractspec/lib.builder-spec';
import type {
	ExternalExecutionProvider,
	ProviderRoutingPolicy,
	RuntimeTarget,
} from '@contractspec/lib.provider-spec';
import { createBuilderId } from '../utils/id';
import { compileExecutionPlanPack } from './execution-plan-pack';
import {
	classifySensitiveSourceData,
	runtimeHasModeTarget,
	taskTypesForLane,
} from './helpers';
import { LANE_TO_EXECUTION_LANE, selectBuilderLane } from './lane-selection';
import { selectProvider } from './provider-selection';

export { compileExecutionPlanPack, selectBuilderLane };

export function compileBuilderPlan(input: {
	workspace: BuilderWorkspace;
	blueprint: BuilderBlueprint;
	routingPolicy?: ProviderRoutingPolicy | null;
	providers?: ExternalExecutionProvider[];
	runtimeTargets?: RuntimeTarget[];
	sourcePolicyClassifications?: BuilderPolicyClassification[];
	existing?: BuilderPlan | null;
	patchProposalCount?: number;
}) {
	const lane = selectBuilderLane({
		blueprint: input.blueprint,
		patchProposalCount: input.patchProposalCount,
	});
	const runtimeMode = input.workspace.defaultRuntimeMode;
	const taskTypes = taskTypesForLane(lane);
	const hasSensitiveSourceData = classifySensitiveSourceData(
		input.sourcePolicyClassifications
	);
	const providerSelections = taskTypes
		.map((taskType) =>
			selectProvider({
				taskType,
				runtimeMode,
				routingPolicy: input.routingPolicy,
				providers: input.providers ?? [],
				hasSensitiveSourceData,
			})
		)
		.filter(
			(selection): selection is NonNullable<typeof selection> =>
				selection !== null
		);
	const blockingIssues = [];
	if (!runtimeHasModeTarget(input.runtimeTargets ?? [], runtimeMode)) {
		blockingIssues.push({
			code: `RUNTIME_${runtimeMode.toUpperCase()}_UNAVAILABLE`,
			message: `No usable ${runtimeMode} runtime target is registered.`,
			runtimeModes: [runtimeMode],
		});
	}
	if (providerSelections.length === 0) {
		blockingIssues.push({
			code: 'PROVIDER_ROUTE_UNRESOLVED',
			message:
				'No compatible provider route is available for the current lane.',
			runtimeModes: [runtimeMode],
		});
	}
	const executionPlanPack = compileExecutionPlanPack({
		workspace: input.workspace,
		blueprint: input.blueprint,
		lane,
	});
	return {
		id: input.existing?.id ?? createBuilderId('plan'),
		workspaceId: input.workspace.id,
		laneType: lane,
		executionLaneKey: LANE_TO_EXECUTION_LANE[lane],
		runtimeMode,
		steps: executionPlanPack.planSteps.map((step) => step.title),
		providerSelections,
		policyVerdicts: executionPlanPack.verification.blockingRisks,
		openQuestions: input.blueprint.openQuestions,
		blockingIssues,
		nextPermittedActions:
			blockingIssues.length > 0
				? [
						'builder.runtimeTarget.register',
						'builder.providerRoutingPolicy.upsert',
					]
				: [
						'builder.preview.create',
						'builder.preview.runHarness',
						'builder.export.prepare',
					],
		requiresApproval: true,
		traceId: createBuilderId('trace'),
		executionPlanPack,
		status: input.existing?.status ?? 'draft',
		createdAt: input.existing?.createdAt ?? new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	} satisfies BuilderPlan;
}
