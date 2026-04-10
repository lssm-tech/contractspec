import { describe, expect, it } from 'bun:test';
import type {
	BuilderBlueprint,
	BuilderPlan,
} from '@contractspec/lib.builder-spec';
import type { ProviderRoutingPolicy } from '@contractspec/lib.provider-spec';
import { BuilderRuntimeService } from './runtime';
import { InMemoryBuilderStore } from './stores';

async function createWorkspace(
	service: BuilderRuntimeService,
	workspaceId = 'ws_routing'
) {
	await service.executeCommand('builder.workspace.create', {
		workspaceId,
		payload: {
			tenantId: 'tenant_1',
			name: 'Routing Workspace',
			ownerIds: ['owner_1'],
		},
	});
	return workspaceId;
}

function createBlueprint(workspaceId: string): BuilderBlueprint {
	const now = new Date().toISOString();
	return {
		id: 'blueprint_1',
		workspaceId,
		appBrief: 'Create an internal approvals app.',
		personas: [],
		domainObjects: [],
		workflows: [],
		surfaces: [],
		integrations: [],
		policies: [],
		runtimeProfiles: [],
		channelSurfaces: [],
		featureParity: [],
		assumptions: [],
		openQuestions: [],
		coverageReport: {
			explicitCount: 1,
			inferredCount: 0,
			conflictedCount: 0,
			missingCount: 0,
			fields: [],
		},
		version: 1,
		lockedFieldPaths: [],
		createdAt: now,
		updatedAt: now,
	};
}

describe('builder routing policy runtime', () => {
	it('persists risk rules and applies them during plan compilation', async () => {
		const store = new InMemoryBuilderStore();
		const service = new BuilderRuntimeService(store);
		const workspaceId = await createWorkspace(service);
		await store.saveBlueprint(createBlueprint(workspaceId));

		await service.executeCommand('builder.provider.register', {
			workspaceId,
			entityId: 'provider_primary',
			payload: {
				providerKind: 'coding',
				displayName: 'Primary Coding Provider',
				integrationPackage: '@contractspec/integration.provider.primary',
				supportedRuntimeModes: ['managed'],
				supportedTaskTypes: ['propose_patch', 'generate_tests'],
				supportsRepoScopedPatch: true,
				supportsStructuredDiff: true,
				supportsLongContext: true,
				supportsFunctionCalling: true,
				supportsStreaming: true,
				defaultRiskPolicy: {
					propose_patch: 'high',
					generate_tests: 'medium',
				},
			},
		});
		await service.executeCommand('builder.provider.register', {
			workspaceId,
			entityId: 'provider_fallback',
			payload: {
				providerKind: 'coding',
				displayName: 'Fallback Coding Provider',
				integrationPackage: '@contractspec/integration.provider.fallback',
				supportedRuntimeModes: ['managed'],
				supportedTaskTypes: ['propose_patch', 'generate_tests'],
				supportsRepoScopedPatch: true,
				supportsStructuredDiff: true,
				supportsLongContext: true,
				supportsFunctionCalling: true,
				supportsStreaming: true,
				defaultRiskPolicy: {
					propose_patch: 'medium',
					generate_tests: 'medium',
				},
			},
		});

		const riskRules: ProviderRoutingPolicy['riskRules'] = [
			{
				riskLevelAtOrAbove: 'high',
				blockedProviderIds: ['provider_primary'],
			},
		];

		await service.executeCommand('builder.providerRoutingPolicy.upsert', {
			workspaceId,
			payload: {
				taskRules: [
					{
						taskType: 'propose_patch',
						preferredProviders: ['provider_primary'],
						fallbackProviders: ['provider_fallback'],
					},
				],
				riskRules,
				runtimeModeRules: [],
				comparisonRules: [],
				fallbackRules: [],
			},
		});

		const policy = (await service.executeQuery(
			'builder.providerRoutingPolicy.get',
			{ workspaceId }
		)) as ProviderRoutingPolicy | null;
		expect(policy?.riskRules).toEqual(riskRules);

		const plan = (await service.executeCommand('builder.plan.compile', {
			workspaceId,
		})) as BuilderPlan | null;
		expect(plan?.providerSelections).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					taskType: 'propose_patch',
					selectedProviderId: 'provider_fallback',
				}),
			])
		);
	});
});
