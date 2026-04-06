import type { LaneRuntimeSnapshot } from '@contractspec/lib.execution-lanes';

export interface ExecutionLaneTimelineItem {
	id: string;
	label: string;
	timestamp: string;
	kind: 'event' | 'artifact' | 'approval' | 'evidence';
	detail?: string;
}

export function buildExecutionLaneTimeline(
	snapshot: LaneRuntimeSnapshot
): ExecutionLaneTimelineItem[] {
	return [
		...snapshot.events.map((event) => ({
			id: event.id,
			label: event.type,
			timestamp: event.createdAt,
			kind: 'event' as const,
			detail: event.message,
		})),
		...snapshot.transitions.map((transition) => ({
			id: transition.id,
			label: `${transition.from ?? 'unknown'} -> ${transition.to}`,
			timestamp: transition.createdAt,
			kind: 'event' as const,
			detail: transition.reason,
		})),
		...snapshot.artifacts.map((artifact) => ({
			id: artifact.id,
			label: artifact.artifactType,
			timestamp: artifact.createdAt,
			kind: 'artifact' as const,
			detail: artifact.summary,
		})),
		...snapshot.approvals.map((approval) => ({
			id: approval.id,
			label: `${approval.role}:${approval.state}`,
			timestamp: approval.decidedAt ?? approval.requestedAt,
			kind: 'approval' as const,
			detail: approval.comment,
		})),
		...snapshot.evidence.map((bundle) => ({
			id: bundle.id,
			label: bundle.classes.join(', '),
			timestamp: bundle.createdAt,
			kind: 'evidence' as const,
			detail: bundle.summary,
		})),
	].sort((left, right) => left.timestamp.localeCompare(right.timestamp));
}
