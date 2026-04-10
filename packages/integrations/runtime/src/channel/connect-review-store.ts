import type {
	ConnectReviewQueueRecord,
	ListConnectReviewQueueItemsInput,
} from './connect-review-types';

export interface ConnectReviewQueueStore {
	getConnectReview(id: string): Promise<ConnectReviewQueueRecord | null>;
	getConnectReviewBySourceDecisionId(
		sourceDecisionId: string
	): Promise<ConnectReviewQueueRecord | null>;
	listConnectReviews(
		input?: Omit<ListConnectReviewQueueItemsInput, 'status'>
	): Promise<ConnectReviewQueueRecord[]>;
	upsertConnectReview(
		record: ConnectReviewQueueRecord
	): Promise<ConnectReviewQueueRecord>;
}
