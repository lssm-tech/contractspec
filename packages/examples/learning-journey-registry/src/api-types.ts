import type {
	JourneyEvent,
	JourneyProgressSnapshot,
	JourneyProgressState,
	JourneyTrackSpec,
} from '@contractspec/module.learning-journey/track-spec';

export type LearningEvent = JourneyEvent & {
	learnerId: string;
};

export type TrackProgress = JourneyProgressState;
export type TrackProgressSnapshot = JourneyProgressSnapshot;
export type TrackResolver = (trackId: string) => JourneyTrackSpec | undefined;
