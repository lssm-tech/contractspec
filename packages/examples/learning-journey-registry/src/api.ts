import {
	projectJourneyProgress,
	recordJourneyEvent,
} from '@contractspec/module.learning-journey/runtime';
import type { JourneyTrackSpec } from '@contractspec/module.learning-journey/track-spec';
import type { LearningEvent, TrackProgressSnapshot } from './api-types';
import {
	getLearnerTracks,
	getTrackResolver,
	initProgress,
} from './progress-store';
import { learningJourneyTracks } from './tracks';

const getTrack = getTrackResolver(learningJourneyTracks);

const toSnapshot = (
	track: JourneyTrackSpec,
	learnerId: string
): TrackProgressSnapshot => {
	const map = getLearnerTracks(learnerId);
	const existing = map.get(track.id) ?? initProgress(learnerId, track);
	map.set(track.id, existing);
	return projectJourneyProgress(track, existing);
};

export const listTracks = (learnerId?: string) => ({
	tracks: learningJourneyTracks,
	progress: learnerId
		? learningJourneyTracks.map((track) => toSnapshot(track, learnerId))
		: ([] as TrackProgressSnapshot[]),
});

export const getProgress = (trackId: string, learnerId: string) => {
	const track = getTrack(trackId);
	if (!track) return undefined;
	return toSnapshot(track, learnerId);
};

export const recordEvent = (event: LearningEvent) => {
	const targets =
		event.trackId !== undefined
			? learningJourneyTracks.filter((track) => track.id === event.trackId)
			: learningJourneyTracks;

	const updated: TrackProgressSnapshot[] = [];
	for (const track of targets) {
		const map = getLearnerTracks(event.learnerId);
		const current = map.get(track.id) ?? initProgress(event.learnerId, track);
		const next = recordJourneyEvent(track, current, {
			...event,
			trackId: track.id,
		});
		map.set(track.id, next);
		updated.push(projectJourneyProgress(track, next));
	}

	return updated;
};
