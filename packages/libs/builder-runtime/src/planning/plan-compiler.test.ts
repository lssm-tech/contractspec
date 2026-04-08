import { describe, expect, it } from 'bun:test';
import type {
	BuilderBlueprint,
	BuilderWorkspace,
} from '@contractspec/lib.builder-spec';
import type {
	ExternalExecutionProvider,
	ProviderRoutingPolicy,
	RuntimeTarget,
} from '@contractspec/lib.provider-spec';
import { compileBuilderPlan } from './plan-compiler';

function createWorkspace(
	overrides: Partial<BuilderWorkspace> = {}
): BuilderWorkspace {
	return {
		id: 'ws_1',
		tenantId: 'tenant_1',
		name: 'Builder Workspace',
		status: 'draft',
		appClass: 'internal_workflow',
		defaultRuntimeMode: 'managed',
		mobileParityRequired: true,
		ownerIds: ['owner_1'],
		defaultLocale: 'en',
		defaultChannelPolicy: {},
		createdAt: '2026-04-07T00:00:00.000Z',
		updatedAt: '2026-04-07T00:00:00.000Z',
		...overrides,
	};
}

function createBlueprint(
	overrides: Partial<BuilderBlueprint> = {}
): BuilderBlueprint {
	return {
		id: 'bp_1',
		workspaceId: 'ws_1',
		appBrief: 'Build an approvals workspace.',
		personas: [],
		domainObjects: [],
		workflows: [],
		surfaces: [],
		integrations: [],
		policies: [],
		runtimeProfiles: [
			{
				id: 'runtime_managed',
				label: 'Managed',
				runtimeMode: 'managed',
				status: 'candidate',
			},
		],
		channelSurfaces: [],
		featureParity: [],
		assumptions: [],
		openQuestions: [],
		coverageReport: {
			explicitCount: 1,
			inferredCount: 0,
			conflictedCount: 0,
			missingCount: 0,
			fields: [
				{
					fieldPath: 'brief',
					sourceIds: ['src_1'],
					decisionReceiptIds: [],
					explicit: true,
					conflicted: false,
					locked: false,
					confidence: 0.9,
				},
			],
		},
		version: 1,
		lockedFieldPaths: [],
		createdAt: '2026-04-07T00:00:00.000Z',
		updatedAt: '2026-04-07T00:00:00.000Z',
		...overrides,
	};
}

function createProvider(
	id: string,
	overrides: Partial<ExternalExecutionProvider> = {}
): ExternalExecutionProvider {
	return {
		id,
		workspaceId: 'ws_1',
		providerKind: 'coding',
		displayName: id,
		integrationPackage: `@contractspec/integration.${id}`,
		authMode: 'managed',
		capabilityProfile: {
			providerId: id,
			supportsRepoScopedPatch: true,
			supportsStructuredDiff: true,
			supportsLongContext: true,
			supportsFunctionCalling: true,
			supportsSTT: false,
			supportsVision: false,
			supportsStreaming: true,
			supportsLocalExecution: false,
			supportedArtifactTypes: ['diff'],
			knownConstraints: [],
		},
		supportedRuntimeModes: ['managed'],
		supportedTaskTypes: ['propose_patch', 'generate_tests'],
		defaultRiskPolicy: {
			propose_patch: 'high',
			generate_tests: 'medium',
		},
		status: 'active',
		createdAt: '2026-04-07T00:00:00.000Z',
		updatedAt: '2026-04-07T00:00:00.000Z',
		...overrides,
	};
}

describe('compileBuilderPlan', () => {
	it('applies risk and comparison routing rules for high-risk tasks', () => {
		const routingPolicy: ProviderRoutingPolicy = {
			id: 'routing_1',
			workspaceId: 'ws_1',
			taskRules: [
				{
					taskType: 'propose_patch',
					preferredProviders: [
						'provider.managed-risky',
						'provider.codex',
						'provider.claude',
					],
					fallbackProviders: [],
				},
			],
			riskRules: [
				{
					riskLevelAtOrAbove: 'high',
					preferredProviders: ['provider.codex'],
					blockedProviderIds: ['provider.managed-risky'],
					requireComparison: true,
				},
			],
			runtimeModeRules: [],
			comparisonRules: [
				{
					taskType: 'propose_patch',
					riskLevelAtOrAbove: 'high',
					comparisonMode: 'dual_provider',
				},
			],
			fallbackRules: [],
			updatedAt: '2026-04-07T00:00:00.000Z',
		};

		const plan = compileBuilderPlan({
			workspace: createWorkspace(),
			blueprint: createBlueprint(),
			routingPolicy,
			providers: [
				createProvider('provider.managed-risky'),
				createProvider('provider.codex'),
				createProvider('provider.claude'),
			],
			runtimeTargets: [],
		});

		const proposePatch = plan.providerSelections.find(
			(selection) => selection.taskType === 'propose_patch'
		);
		expect(proposePatch?.selectedProviderId).toBe('provider.codex');
		expect(proposePatch?.comparisonProviderIds).toEqual(['provider.claude']);
	});

	it('blocks managed-only providers for sensitive local plans', () => {
		const routingPolicy: ProviderRoutingPolicy = {
			id: 'routing_2',
			workspaceId: 'ws_1',
			taskRules: [
				{
					taskType: 'propose_patch',
					preferredProviders: ['provider.managed-code', 'provider.local-code'],
					fallbackProviders: [],
				},
			],
			riskRules: [],
			runtimeModeRules: [
				{
					runtimeMode: 'local',
					disallowManagedProvidersForSensitiveData: true,
				},
			],
			comparisonRules: [],
			fallbackRules: [],
			updatedAt: '2026-04-07T00:00:00.000Z',
		};
		const runtimeTargets: RuntimeTarget[] = [
			{
				id: 'target_local',
				workspaceId: 'ws_1',
				type: 'local_daemon',
				runtimeMode: 'local',
				displayName: 'Local daemon',
				registrationState: 'registered',
				capabilityProfile: {
					supportsPreview: true,
					supportsExport: true,
					supportsMobileInspection: true,
					supportsLocalExecution: true,
					availableProviders: ['provider.local-code'],
					dataLocality: 'local',
				},
				networkPolicy: 'restricted',
				dataLocality: 'local',
				secretHandlingMode: 'local',
				createdAt: '2026-04-07T00:00:00.000Z',
				updatedAt: '2026-04-07T00:00:00.000Z',
			},
		];

		const plan = compileBuilderPlan({
			workspace: createWorkspace({
				defaultRuntimeMode: 'local',
			}),
			blueprint: createBlueprint({
				runtimeProfiles: [
					{
						id: 'runtime_local',
						label: 'Local',
						runtimeMode: 'local',
						status: 'candidate',
					},
				],
			}),
			routingPolicy,
			providers: [
				createProvider('provider.managed-code', {
					authMode: 'managed',
					supportedRuntimeModes: ['local'],
					capabilityProfile: {
						providerId: 'provider.managed-code',
						supportsRepoScopedPatch: true,
						supportsStructuredDiff: true,
						supportsLongContext: true,
						supportsFunctionCalling: true,
						supportsSTT: false,
						supportsVision: false,
						supportsStreaming: true,
						supportsLocalExecution: false,
						supportedArtifactTypes: ['diff'],
						knownConstraints: [],
					},
				}),
				createProvider('provider.local-code', {
					authMode: 'local',
					supportedRuntimeModes: ['local'],
					capabilityProfile: {
						providerId: 'provider.local-code',
						supportsRepoScopedPatch: true,
						supportsStructuredDiff: true,
						supportsLongContext: true,
						supportsFunctionCalling: true,
						supportsSTT: false,
						supportsVision: false,
						supportsStreaming: true,
						supportsLocalExecution: true,
						supportedArtifactTypes: ['diff'],
						knownConstraints: [],
					},
				}),
			],
			runtimeTargets,
			sourcePolicyClassifications: ['restricted'],
		});

		const proposePatch = plan.providerSelections.find(
			(selection) => selection.taskType === 'propose_patch'
		);
		expect(proposePatch?.selectedProviderId).toBe('provider.local-code');
	});

	it('blocks local plans when the only local runtime target is offline', () => {
		const plan = compileBuilderPlan({
			workspace: createWorkspace({
				defaultRuntimeMode: 'local',
			}),
			blueprint: createBlueprint({
				runtimeProfiles: [
					{
						id: 'runtime_local',
						label: 'Local',
						runtimeMode: 'local',
						status: 'candidate',
					},
				],
			}),
			providers: [
				createProvider('provider.local-code', {
					authMode: 'local',
					supportedRuntimeModes: ['local'],
					capabilityProfile: {
						providerId: 'provider.local-code',
						supportsRepoScopedPatch: true,
						supportsStructuredDiff: true,
						supportsLongContext: true,
						supportsFunctionCalling: true,
						supportsSTT: false,
						supportsVision: false,
						supportsStreaming: true,
						supportsLocalExecution: true,
						supportedArtifactTypes: ['diff'],
						knownConstraints: [],
					},
				}),
			],
			runtimeTargets: [
				{
					id: 'target_local',
					workspaceId: 'ws_1',
					type: 'local_daemon',
					runtimeMode: 'local',
					displayName: 'Local daemon',
					registrationState: 'offline',
					capabilityProfile: {
						supportsPreview: true,
						supportsExport: true,
						supportsMobileInspection: true,
						supportsLocalExecution: true,
						availableProviders: ['provider.local-code'],
						dataLocality: 'local',
					},
					networkPolicy: 'restricted',
					dataLocality: 'local',
					secretHandlingMode: 'local',
					createdAt: '2026-04-07T00:00:00.000Z',
					updatedAt: '2026-04-07T00:00:00.000Z',
				},
			],
		});

		expect(
			plan.blockingIssues.some(
				(issue) => issue.code === 'RUNTIME_LOCAL_UNAVAILABLE'
			)
		).toBe(true);
	});

	it('skips offline providers when selecting a compatible route', () => {
		const plan = compileBuilderPlan({
			workspace: createWorkspace(),
			blueprint: createBlueprint(),
			routingPolicy: {
				id: 'routing_4',
				workspaceId: 'ws_1',
				taskRules: [
					{
						taskType: 'propose_patch',
						preferredProviders: ['provider.offline', 'provider.codex'],
						fallbackProviders: [],
					},
				],
				riskRules: [],
				runtimeModeRules: [],
				comparisonRules: [],
				fallbackRules: [],
				updatedAt: '2026-04-07T00:00:00.000Z',
			},
			providers: [
				createProvider('provider.offline', {
					availability: 'offline',
				}),
				createProvider('provider.codex'),
			],
		});

		expect(
			plan.providerSelections.find(
				(selection) => selection.taskType === 'propose_patch'
			)?.selectedProviderId
		).toBe('provider.codex');
	});
});
