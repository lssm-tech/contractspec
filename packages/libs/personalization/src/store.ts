import type { BehaviorEvent, BehaviorQuery, BehaviorSummary } from './types';

export interface BehaviorStore {
	record(event: BehaviorEvent): Promise<void> | void;
	bulkRecord(events: BehaviorEvent[]): Promise<void> | void;
	query(query: BehaviorQuery): Promise<BehaviorEvent[]>;
	summarize(query: BehaviorQuery): Promise<BehaviorSummary>;
	clear?(): Promise<void> | void;
}

export class InMemoryBehaviorStore implements BehaviorStore {
	private events: BehaviorEvent[] = [];

	async record(event: BehaviorEvent): Promise<void> {
		this.events.push(event);
	}

	async bulkRecord(events: BehaviorEvent[]): Promise<void> {
		this.events.push(...events);
	}

	async query(query: BehaviorQuery): Promise<BehaviorEvent[]> {
		return filterEvents(this.events, query);
	}

	async summarize(query: BehaviorQuery): Promise<BehaviorSummary> {
		const events = await this.query(query);
		const summary: BehaviorSummary = {
			fieldCounts: {},
			featureCounts: {},
			workflowStepCounts: {},
			totalEvents: events.length,
			deniedFieldCounts: {},
			deniedActionCounts: {},
		};

		events.forEach((event) => {
			recordPolicyDenials(summary, event);

			switch (event.type) {
				case 'field_access':
					summary.fieldCounts[event.field] =
						(summary.fieldCounts[event.field] ?? 0) + 1;
					break;
				case 'feature_usage':
					summary.featureCounts[event.feature] =
						(summary.featureCounts[event.feature] ?? 0) + 1;
					break;
				case 'workflow_step': {
					const workflow = (summary.workflowStepCounts[event.workflow] ??= {});
					workflow[event.step] = (workflow[event.step] ?? 0) + 1;
					break;
				}
				default:
					break;
			}
		});

		return summary;
	}

	async clear(): Promise<void> {
		this.events = [];
	}
}

function filterEvents(
	events: BehaviorEvent[],
	query: BehaviorQuery
): BehaviorEvent[] {
	return events.filter((event) => {
		if (query.tenantId && event.tenantId !== query.tenantId) {
			return false;
		}
		if (query.userId && event.userId !== query.userId) {
			return false;
		}
		if (
			query.role &&
			event.role !== query.role &&
			!event.roles?.includes(query.role)
		) {
			return false;
		}
		if (
			query.roles?.length &&
			!query.roles.some(
				(role) => event.roles?.includes(role) || event.role === role
			)
		) {
			return false;
		}
		if (query.permission && !event.permissions?.includes(query.permission)) {
			return false;
		}
		if (
			query.permissions?.length &&
			!query.permissions.every((permission) =>
				event.permissions?.includes(permission)
			)
		) {
			return false;
		}
		if (query.since && event.timestamp < query.since) {
			return false;
		}
		if (query.until && event.timestamp > query.until) {
			return false;
		}

		if (
			query.operation &&
			event.type === 'field_access' &&
			event.operation !== query.operation
		) {
			return false;
		}
		if (
			query.feature &&
			event.type === 'feature_usage' &&
			event.feature !== query.feature
		) {
			return false;
		}
		if (
			query.workflow &&
			event.type === 'workflow_step' &&
			event.workflow !== query.workflow
		) {
			return false;
		}
		return true;
	});
}

function recordPolicyDenials(
	summary: BehaviorSummary,
	event: BehaviorEvent
): void {
	Object.values(event.policyDecisions ?? {}).forEach((decision) => {
		if (decision.effect !== 'deny') return;

		decision.fields?.forEach((field) => {
			const counts = (summary.deniedFieldCounts ??= {});
			counts[field] = (counts[field] ?? 0) + 1;
		});

		decision.actions?.forEach((action) => {
			const counts = (summary.deniedActionCounts ??= {});
			counts[action] = (counts[action] ?? 0) + 1;
		});
	});
}
