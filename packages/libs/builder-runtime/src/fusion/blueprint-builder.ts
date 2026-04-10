import type {
	BuilderBlueprint,
	BuilderConversation,
} from '@contractspec/lib.builder-spec';
import { createBuilderId } from '../utils/id';
import {
	createCoverageFields,
	preserveLockedSection,
	uniqueBy,
} from './helpers';
import type { RankedDirective } from './types';

export function buildBuilderBlueprint(input: {
	workspace: import('@contractspec/lib.builder-spec').BuilderWorkspace;
	conversations: BuilderConversation[];
	existing?: BuilderBlueprint | null;
	nowIso: string;
	ranked: RankedDirective[];
	conflicts: import('@contractspec/lib.builder-spec').BuilderConflict[];
	decisionReceipts: import('@contractspec/lib.builder-spec').BuilderDecisionReceipt[];
	assumptions: import('@contractspec/lib.builder-spec').BuilderAssumption[];
}) {
	const selectedByArea = new Map<string, RankedDirective[]>();
	for (const item of input.ranked) {
		const current = selectedByArea.get(item.directive.targetArea) ?? [];
		if (current.length >= 4) continue;
		current.push(item);
		selectedByArea.set(item.directive.targetArea, current);
	}

	const briefStatements = selectedByArea.get('brief') ?? [];
	const workflowStatements = selectedByArea.get('workflow') ?? [];
	const surfaceStatements = selectedByArea.get('surface') ?? [];
	const integrationStatements = selectedByArea.get('integration') ?? [];
	const policyStatements = selectedByArea.get('policy') ?? [];
	const coverageFields = createCoverageFields({
		ranked: input.ranked,
		existing: input.existing,
		conflicts: input.conflicts,
		decisionReceipts: input.decisionReceipts,
	});

	return {
		id: input.existing?.id ?? createBuilderId('blueprint'),
		workspaceId: input.workspace.id,
		appBrief: preserveLockedSection(
			'brief',
			input.existing,
			briefStatements
				.map(({ directive }) => directive.statement)
				.slice(0, 3)
				.join(' ') || 'Builder draft application brief.',
			input.existing?.appBrief ?? 'Builder draft application brief.'
		),
		personas: preserveLockedSection(
			'brief',
			input.existing,
			uniqueBy(
				briefStatements.map(({ directive }, index) => ({
					id: `persona_${index + 1}`,
					name: directive.statement.split(' ').slice(0, 3).join(' '),
					goals: [directive.statement],
				})),
				(persona) => persona.name
			),
			input.existing?.personas ?? []
		),
		domainObjects: preserveLockedSection(
			'brief',
			input.existing,
			uniqueBy(
				briefStatements.map(({ directive }, index) => ({
					id: `domain_${index + 1}`,
					name: directive.statement.split(' ').slice(0, 2).join('_'),
					fields: directive.statement.split(' ').slice(0, 4),
				})),
				(object) => object.name
			),
			input.existing?.domainObjects ?? []
		),
		workflows: preserveLockedSection(
			'workflow',
			input.existing,
			workflowStatements.map(({ directive }, index) => ({
				id: `workflow_${index + 1}`,
				name: directive.statement.slice(0, 48),
				steps: directive.statement
					.split(/,|->|then/)
					.map((step: string) => step.trim())
					.filter(Boolean),
			})),
			input.existing?.workflows ?? []
		),
		surfaces: preserveLockedSection(
			'surface',
			input.existing,
			surfaceStatements.map(({ directive }, index) => ({
				id: `surface_${index + 1}`,
				name: directive.statement.slice(0, 32),
				summary: directive.statement,
			})),
			input.existing?.surfaces ?? []
		),
		integrations: preserveLockedSection(
			'integration',
			input.existing,
			integrationStatements.map(({ directive }) => ({
				provider: directive.statement.split(' ').slice(0, 2).join('-'),
				mode: 'connector_sandbox' as const,
			})),
			input.existing?.integrations ?? []
		),
		policies: preserveLockedSection(
			'policy',
			input.existing,
			policyStatements.map(({ directive }) => directive.statement),
			input.existing?.policies ?? []
		),
		runtimeProfiles: input.existing?.runtimeProfiles ?? [
			{
				id: `runtime_${input.workspace.defaultRuntimeMode}`,
				label: `${input.workspace.defaultRuntimeMode} default`,
				runtimeMode: input.workspace.defaultRuntimeMode,
				status: 'candidate',
				notes: 'Default runtime profile inferred from workspace settings.',
			},
		],
		channelSurfaces: uniqueBy(
			[
				...input.conversations.flatMap(
					(conversation) => conversation.boundChannelIds
				),
				...(input.workspace.mobileParityRequired ? ['mobile_web'] : []),
			].map((channel) => ({
				channel:
					channel as BuilderBlueprint['channelSurfaces'][number]['channel'],
				purpose: 'builder_control' as const,
				enabled: true,
			})),
			(surface) => surface.channel
		),
		featureParity: input.existing?.featureParity ?? [
			{
				featureKey: 'requirements.capture',
				label: 'Capture requirements',
				mobileSupport: input.workspace.mobileParityRequired
					? 'full'
					: 'partial',
				channelSupport: ['web_chat', 'telegram', 'whatsapp', 'mobile_web'],
				approvalStrengthRequired: 'weak_channel_ack',
				evidenceShape: 'summary_only',
			},
			{
				featureKey: 'review.patch',
				label: 'Review patch proposals',
				mobileSupport: input.workspace.mobileParityRequired
					? 'partial'
					: 'blocked',
				channelSupport: ['telegram', 'whatsapp', 'mobile_web'],
				mobileFallbackRef: 'builder://mobile-review/patch',
				approvalStrengthRequired: 'bound_channel_ack',
				evidenceShape: 'diff_with_provenance',
			},
			{
				featureKey: 'runtime.inspect',
				label: 'Inspect runtime status',
				mobileSupport: input.workspace.mobileParityRequired
					? 'full'
					: 'partial',
				channelSupport: ['telegram', 'whatsapp', 'mobile_web'],
				approvalStrengthRequired: 'weak_channel_ack',
				evidenceShape: 'receipt_with_harness',
			},
		],
		assumptions: input.assumptions,
		openQuestions:
			selectedByArea
				.get('brief')
				?.filter(({ directive }) => directive.directiveType === 'question')
				.map(({ directive }) => directive.statement) ?? [],
		coverageReport: {
			explicitCount: coverageFields.length,
			inferredCount: input.assumptions.length,
			conflictedCount: input.conflicts.length,
			missingCount: Math.max(0, 6 - coverageFields.length),
			fields: coverageFields,
		},
		version: (input.existing?.version ?? 0) + 1,
		lockedFieldPaths: input.existing?.lockedFieldPaths ?? [],
		createdAt: input.existing?.createdAt ?? input.nowIso,
		updatedAt: input.nowIso,
	} satisfies BuilderBlueprint;
}
