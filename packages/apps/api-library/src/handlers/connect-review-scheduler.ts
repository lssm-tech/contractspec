import { appLogger } from '@contractspec/bundle.library/infrastructure/elysia/logger';
import { getChannelRuntimeResources } from './channel-runtime-resources';

let schedulerTimer: ReturnType<typeof setInterval> | null = null;
let sweepInFlight = false;

export async function runConnectReviewSweepOnce() {
	const staleAfterMs = Number.parseInt(
		process.env.CONNECT_REVIEW_SWEEP_STALE_AFTER_MS ?? '300000',
		10
	);
	const runtime = await getChannelRuntimeResources();
	const summary = await runtime.connectReviewService.sweepPendingReviews({
		actorId:
			process.env.CONNECT_REVIEW_SWEEP_ACTOR_ID ??
			'app.api-library.connect-review-sweep',
		limit: Number.parseInt(process.env.CONNECT_REVIEW_SWEEP_LIMIT ?? '25', 10),
		nudgeMessage:
			process.env.CONNECT_REVIEW_SWEEP_NUDGE_MESSAGE ??
			'Connect review is still pending. Re-check the queue and continue follow-up.',
		staleAfterMs: Number.isFinite(staleAfterMs) ? staleAfterMs : 300000,
	});
	if (summary.nudged.length > 0 || summary.requestedApproval.length > 0) {
		appLogger.info('connect.review.scheduler.batch', { ...summary });
	}
	return summary;
}

export function startConnectReviewSweepScheduler(): void {
	const intervalMs = Number.parseInt(
		process.env.CONNECT_REVIEW_SWEEP_INTERVAL_MS ?? '0',
		10
	);
	if (!Number.isFinite(intervalMs) || intervalMs <= 0 || schedulerTimer) {
		return;
	}

	const runSweep = async () => {
		if (sweepInFlight) {
			return;
		}
		sweepInFlight = true;
		try {
			await runConnectReviewSweepOnce();
		} catch (error) {
			appLogger.error('connect.review.scheduler.failed', {
				error: error instanceof Error ? error.message : String(error),
			});
		} finally {
			sweepInFlight = false;
		}
	};

	schedulerTimer = setInterval(() => {
		void runSweep();
	}, intervalMs);
	if (process.env.CONNECT_REVIEW_SWEEP_RUN_ON_START === '1') {
		void runSweep();
	}

	appLogger.info('connect.review.scheduler.started', {
		intervalMs,
	});
}
