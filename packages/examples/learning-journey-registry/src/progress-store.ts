import { createJourneyProgressState } from '@contractspec/module.learning-journey/runtime';
import type { JourneyTrackSpec } from '@contractspec/module.learning-journey/track-spec';
import type { TrackProgress } from './api-types';

export const progressStore = new Map<string, Map<string, TrackProgress>>();

export const getTrackResolver =
	(tracks: JourneyTrackSpec[]) =>
	(trackId: string): JourneyTrackSpec | undefined =>
		tracks.find((track) => track.id === trackId);

export const getLearnerTracks = (learnerId: string) => {
	const existing = progressStore.get(learnerId);
	if (existing) return existing;
	const map = new Map<string, TrackProgress>();
	progressStore.set(learnerId, map);
	return map;
};

export const initProgress = (
	learnerId: string,
	track: JourneyTrackSpec
): TrackProgress => createJourneyProgressState(track, { learnerId });
