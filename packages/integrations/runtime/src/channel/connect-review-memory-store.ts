import type { ConnectReviewQueueStore } from './connect-review-store';
import type {
	ConnectReviewQueueRecord,
	ListConnectReviewQueueItemsInput,
} from './connect-review-types';

export class InMemoryConnectReviewQueueStore
	implements ConnectReviewQueueStore
{
	public readonly records = new Map<string, ConnectReviewQueueRecord>();
	private readonly sourceDecisionToId = new Map<string, string>();

	async getConnectReview(id: string): Promise<ConnectReviewQueueRecord | null> {
		return this.records.get(id) ?? null;
	}

	async getConnectReviewBySourceDecisionId(
		sourceDecisionId: string
	): Promise<ConnectReviewQueueRecord | null> {
		const id = this.sourceDecisionToId.get(sourceDecisionId);
		return id ? (this.records.get(id) ?? null) : null;
	}

	async listConnectReviews(
		input: Omit<ListConnectReviewQueueItemsInput, 'status'> = {}
	): Promise<ConnectReviewQueueRecord[]> {
		return Array.from(this.records.values())
			.filter((record) => (input.queue ? record.queue === input.queue : true))
			.filter((record) =>
				input.sourceDecisionId
					? record.sourceDecisionId === input.sourceDecisionId
					: true
			)
			.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
			.slice(0, Math.max(1, input.limit ?? 100));
	}

	async upsertConnectReview(
		record: ConnectReviewQueueRecord
	): Promise<ConnectReviewQueueRecord> {
		const existingId = this.sourceDecisionToId.get(record.sourceDecisionId);
		const next =
			existingId && this.records.has(existingId)
				? {
						...this.records.get(existingId)!,
						...record,
						id: existingId,
					}
				: record;
		this.records.set(next.id, next);
		this.sourceDecisionToId.set(next.sourceDecisionId, next.id);
		return next;
	}
}
