import type {
	BuilderAssumption,
	BuilderBlueprint,
	BuilderConflict,
	BuilderCoverageField,
	BuilderDecisionReceipt,
	BuilderFusionGraphEdge,
	BuilderParticipantBinding,
	BuilderSourceRecord,
} from '@contractspec/lib.builder-spec';
import { sha256 } from '../utils/hash';
import type { RankedDirective } from './types';

export function uniqueBy<T>(
	values: T[],
	keyFactory: (value: T) => string
): T[] {
	const seen = new Set<string>();
	return values.filter((value) => {
		const key = keyFactory(value);
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

export function normalizeStatement(statement: string): string {
	return statement.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function stableId(prefix: string, value: string): string {
	return `${prefix}_${sha256(value).slice(0, 12)}`;
}

export function createCoverageFields(input: {
	ranked: RankedDirective[];
	existing: BuilderBlueprint | null | undefined;
	conflicts: BuilderConflict[];
	decisionReceipts: BuilderDecisionReceipt[];
}) {
	return uniqueBy(
		input.ranked.map(({ directive, score }) => ({
			fieldPath: directive.targetArea,
			sourceIds: directive.sourceIds,
			decisionReceiptIds: input.decisionReceipts
				.filter((receipt) =>
					receipt.affectedFields.includes(directive.targetArea)
				)
				.map((receipt) => receipt.id),
			explicit: true,
			conflicted: input.conflicts.some(
				(conflict) => conflict.fieldPath === directive.targetArea
			),
			locked:
				input.existing?.lockedFieldPaths.includes(directive.targetArea) ??
				false,
			confidence: Math.max(directive.confidence, Math.min(1, score / 100)),
		})),
		(field) => `${field.fieldPath}:${field.sourceIds.join(',')}`
	) satisfies BuilderCoverageField[];
}

export function preserveLockedSection<T>(
	fieldPath: string,
	existing: BuilderBlueprint | null | undefined,
	nextValue: T,
	fallback: T
): T {
	if (!existing?.lockedFieldPaths.includes(fieldPath)) {
		return nextValue;
	}
	return fallback;
}

export function createConflicts(input: {
	ranked: RankedDirective[];
	workspaceId: string;
	nowIso: string;
}) {
	return uniqueBy(
		input.ranked.flatMap(({ directive }) => {
			const peers = input.ranked.filter(
				(candidate) =>
					candidate.directive.targetArea === directive.targetArea &&
					normalizeStatement(candidate.directive.statement) !==
						normalizeStatement(directive.statement)
			);
			if (peers.length === 0) {
				return [];
			}
			return [
				{
					id: stableId(
						'conflict',
						`${input.workspaceId}:${directive.targetArea}:${directive.statement}:${peers
							.map((peer) => peer.directive.statement)
							.sort()
							.join('|')}`
					),
					workspaceId: input.workspaceId,
					fieldPath: directive.targetArea,
					summary: `Conflicting ${directive.targetArea} directives require review.`,
					sourceIds: uniqueBy(
						[directive, ...peers.map((peer) => peer.directive)].flatMap(
							(item) => item.sourceIds
						),
						(id) => id
					),
					severity: 'medium',
					status: 'open',
					createdAt: input.nowIso,
					updatedAt: input.nowIso,
				} satisfies BuilderConflict,
			];
		}),
		(conflict) => `${conflict.fieldPath}:${conflict.sourceIds.sort().join(',')}`
	);
}

export function createAssumptions(input: {
	ranked: RankedDirective[];
	workspaceId: string;
	nowIso: string;
}) {
	return uniqueBy(
		input.ranked
			.filter(
				({ directive }) =>
					directive.confidence < 0.75 || directive.requiresReview
			)
			.map(
				({ directive }) =>
					({
						id: stableId('assumption', `${input.workspaceId}:${directive.id}`),
						workspaceId: input.workspaceId,
						statement: directive.statement,
						severity: directive.requiresReview ? 'high' : 'medium',
						sourceIds: directive.sourceIds,
						status: 'open',
						createdAt: input.nowIso,
						updatedAt: input.nowIso,
					}) satisfies BuilderAssumption
			),
		(assumption) => assumption.statement
	);
}

export function createDecisionReceipts(input: {
	ranked: RankedDirective[];
	sourcesById: Map<string, BuilderSourceRecord>;
	bindingsById: Map<string, BuilderParticipantBinding>;
	workspaceId: string;
	nowIso: string;
}) {
	return input.ranked.map(({ directive }) => {
		const source = directive.sourceIds
			.map((sourceId) => input.sourcesById.get(sourceId))
			.find(Boolean);
		const bindingId = source?.trustProfile?.participantBindingId;
		const binding = bindingId ? input.bindingsById.get(bindingId) : null;
		return {
			id: stableId(
				'decision',
				`${input.workspaceId}:${directive.targetArea}:${directive.statement}`
			),
			workspaceId: input.workspaceId,
			resolvedAt: input.nowIso,
			actorRef: binding ? binding.participantId : 'builder.runtime',
			decisionType: directive.requiresReview ? 'confirmation' : 'merge',
			affectedFields: [directive.targetArea],
			supportingSourceIds: directive.sourceIds,
			supersededSourceIds: directive.conflictingSourceIds ?? [],
			policyVerdicts: directive.requiresReview ? ['human_review'] : [],
			requiresHumanReview: directive.requiresReview,
			traceId: stableId('trace', `${input.workspaceId}:${directive.id}`),
		} satisfies BuilderDecisionReceipt;
	});
}

export function createFusionGraphEdges(input: {
	ranked: RankedDirective[];
	decisionReceipts: BuilderDecisionReceipt[];
	workspaceId: string;
	nowIso: string;
}) {
	return uniqueBy(
		input.ranked.flatMap(({ directive }) => {
			const receipt = input.decisionReceipts.find((item) =>
				item.supportingSourceIds.some((sourceId) =>
					directive.sourceIds.includes(sourceId)
				)
			);
			const supports = directive.sourceIds.map(
				(sourceId) =>
					({
						id: stableId('edge', `${sourceId}:${directive.id}:supports`),
						workspaceId: input.workspaceId,
						fromNodeId: sourceId,
						toNodeId: directive.id,
						relationship: 'supports',
						createdAt: input.nowIso,
					}) satisfies BuilderFusionGraphEdge
			);
			const resolvedBy = receipt
				? [
						{
							id: stableId('edge', `${directive.id}:${receipt.id}:resolved_by`),
							workspaceId: input.workspaceId,
							fromNodeId: directive.id,
							toNodeId: receipt.id,
							relationship: 'resolved_by',
							createdAt: input.nowIso,
						} satisfies BuilderFusionGraphEdge,
					]
				: [];
			return [...supports, ...resolvedBy];
		}),
		(edge) => `${edge.fromNodeId}:${edge.toNodeId}:${edge.relationship}`
	);
}
