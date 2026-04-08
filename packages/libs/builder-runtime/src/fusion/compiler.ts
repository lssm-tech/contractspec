import type {
	BuilderBlueprint,
	BuilderConversation,
	BuilderDirectiveCandidate,
	BuilderParticipantBinding,
	BuilderSourceRecord,
	BuilderWorkspace,
} from '@contractspec/lib.builder-spec';
import { buildBuilderBlueprint } from './blueprint-builder';
import {
	createAssumptions,
	createConflicts,
	createDecisionReceipts,
	createFusionGraphEdges,
} from './helpers';
import { scoreBuilderEvidence } from './precedence';
import type { BuilderFusionResolution, RankedDirective } from './types';

export type { BuilderFusionResolution } from './types';

export function resolveBuilderFusion(input: {
	workspace: BuilderWorkspace;
	conversations: BuilderConversation[];
	directives: BuilderDirectiveCandidate[];
	sources: BuilderSourceRecord[];
	participantBindings: BuilderParticipantBinding[];
	existing?: BuilderBlueprint | null;
	now?: () => Date;
}) {
	const nowIso = (input.now?.() ?? new Date()).toISOString();
	const acceptedOrOpen = input.directives.filter(
		(directive) =>
			directive.status === 'accepted' ||
			(directive.status === 'open' && !directive.requiresReview)
	);
	const sourcesById = new Map(
		input.sources.map((source) => [source.id, source])
	);
	const bindingsById = new Map(
		input.participantBindings.map((binding) => [binding.id, binding])
	);
	const ranked = acceptedOrOpen
		.map((directive) => {
			const source = directive.sourceIds
				.map((sourceId) => sourcesById.get(sourceId))
				.find(Boolean);
			const trustProfile = source?.trustProfile;
			return {
				directive,
				score: scoreBuilderEvidence({
					sourceType: source?.sourceType ?? 'web_chat_message',
					approvalState: source?.approvalState ?? 'draft',
					lockedField:
						input.existing?.lockedFieldPaths.includes(directive.targetArea) ??
						false,
					directive,
					trustProfile,
					sourceConfidence: source?.provenance.confidence,
				}),
			} satisfies RankedDirective;
		})
		.sort((left, right) => right.score - left.score);

	const conflicts = createConflicts({
		ranked,
		workspaceId: input.workspace.id,
		nowIso,
	});
	const assumptions = createAssumptions({
		ranked,
		workspaceId: input.workspace.id,
		nowIso,
	});
	const decisionReceipts = createDecisionReceipts({
		ranked,
		sourcesById,
		bindingsById,
		workspaceId: input.workspace.id,
		nowIso,
	});
	const fusionGraphEdges = createFusionGraphEdges({
		ranked,
		decisionReceipts,
		workspaceId: input.workspace.id,
		nowIso,
	});
	const blueprint = buildBuilderBlueprint({
		workspace: input.workspace,
		conversations: input.conversations,
		existing: input.existing,
		nowIso,
		ranked,
		conflicts,
		decisionReceipts,
		assumptions,
	});

	return {
		blueprint,
		assumptions,
		conflicts,
		decisionReceipts,
		fusionGraphEdges,
	} satisfies BuilderFusionResolution;
}

export function compileBuilderBlueprint(input: {
	workspace: BuilderWorkspace;
	conversations: BuilderConversation[];
	directives: BuilderDirectiveCandidate[];
	sources: BuilderSourceRecord[];
	participantBindings: BuilderParticipantBinding[];
	existing?: BuilderBlueprint | null;
}) {
	return resolveBuilderFusion(input).blueprint;
}
