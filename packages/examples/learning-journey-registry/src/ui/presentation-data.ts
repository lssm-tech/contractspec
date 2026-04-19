import type { JourneyProgressSnapshot } from '@contractspec/module.learning-journey/track-spec';
import { getProgress } from '../api';
import { getLearningTrack } from './template-config';

export type LearningPresentationName =
	| 'learning.journey.progress_widget'
	| 'learning.journey.track_detail'
	| 'learning.journey.track_list';

export interface LearningPresentationData {
	progress: JourneyProgressSnapshot;
	templateId: string;
	track: NonNullable<ReturnType<typeof getLearningTrack>>;
	tracks: NonNullable<ReturnType<typeof getLearningTrack>>[];
}

export function buildLearningPresentationData(
	templateId: string,
	presentationName: LearningPresentationName
): LearningPresentationData | undefined {
	const track = getLearningTrack(templateId);
	if (!track) return undefined;

	const learnerId = `sandbox:${templateId}`;
	const progress = getProgress(track.id, learnerId);
	if (!progress) return undefined;

	if (
		presentationName !== 'learning.journey.progress_widget' &&
		presentationName !== 'learning.journey.track_detail' &&
		presentationName !== 'learning.journey.track_list'
	) {
		return undefined;
	}

	return {
		progress,
		templateId,
		track,
		tracks: [track],
	};
}
