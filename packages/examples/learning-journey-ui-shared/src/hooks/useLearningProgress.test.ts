import { describe, expect, it } from 'bun:test';
import {
	createJourneyProgressState,
	recordJourneyEvent,
} from '@contractspec/module.learning-journey/runtime';
import type { JourneyTrackSpec } from '@contractspec/module.learning-journey/track-spec';
import { projectLearningProgressState } from './useLearningProgress';

const adaptiveTrack: JourneyTrackSpec = {
	id: 'ui_shared_adaptive',
	name: 'UI Shared Adaptive',
	steps: [
		{
			id: 'assessment',
			title: 'Assessment',
			completion: { eventName: 'assessment.completed' },
			branches: [
				{
					key: 'advanced',
					when: {
						kind: 'event',
						eventName: 'assessment.completed',
						payloadFilter: { placement: 'advanced' },
					},
					blockStepIds: ['guided_practice'],
				},
			],
		},
		{
			id: 'guided_practice',
			title: 'Guided practice',
			completion: { eventName: 'practice.completed' },
			prerequisites: [
				{ kind: 'branch_selected', stepId: 'assessment', branchKey: 'guided' },
			],
		},
		{
			id: 'advanced_path',
			title: 'Advanced path',
			completion: { eventName: 'advanced.completed' },
			prerequisites: [
				{
					kind: 'branch_selected',
					stepId: 'assessment',
					branchKey: 'advanced',
				},
			],
		},
	],
};

describe('useLearningProgress adapter', () => {
	it('projects module runtime state into display-friendly progress', () => {
		let state = createJourneyProgressState(adaptiveTrack);
		state = recordJourneyEvent(adaptiveTrack, state, {
			name: 'assessment.completed',
			payload: { placement: 'advanced' },
		});

		const progress = projectLearningProgressState(adaptiveTrack, state);
		expect(progress.currentStepId).toBe('advanced_path');
		expect(progress.completedStepIds).toContain('guided_practice');
		expect(progress.blockedStepIds).toContain('guided_practice');
	});
});
