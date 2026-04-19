import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const LearningJourneyFeature = defineFeature({
	meta: {
		key: 'modules.learning-journey',
		version: '1.0.0',
		title: 'Learning Journey',
		description:
			'Comprehensive learning journey engine - onboarding, LMS, flashcards, gamification, and AI personalization',
		domain: 'learning-journey',
		owners: ['@contractspec-core'],
		tags: ['package', 'modules', 'learning-journey'],
		stability: 'experimental',
	},
	operations: [
		{ key: 'learning.journey.listTracks', version: '1.0.0' },
		{ key: 'learning.journey.getProgress', version: '1.0.0' },
		{ key: 'learning.journey.recordEvent', version: '1.0.0' },
		{ key: 'learning.enroll', version: '1.0.0' },
		{ key: 'learning.completeLesson', version: '1.0.0' },
		{ key: 'learning.submitCardReview', version: '1.0.0' },
		{ key: 'learning.getDueCards', version: '1.0.0' },
		{ key: 'learning.getDashboard', version: '1.0.0' },
	],
	events: [
		{ key: 'course.published', version: '1.0.0' },
		{ key: 'enrollment.created', version: '1.0.0' },
		{ key: 'lesson.completed', version: '1.0.0' },
		{ key: 'course.completed', version: '1.0.0' },
		{ key: 'onboarding.started', version: '1.0.0' },
		{ key: 'onboarding.step_completed', version: '1.0.0' },
		{ key: 'onboarding.completed', version: '1.0.0' },
		{ key: 'flashcard.reviewed', version: '1.0.0' },
		{ key: 'quiz.started', version: '1.0.0' },
		{ key: 'quiz.completed', version: '1.0.0' },
		{ key: 'xp.earned', version: '1.0.0' },
		{ key: 'level.up', version: '1.0.0' },
		{ key: 'streak.updated', version: '1.0.0' },
		{ key: 'achievement.unlocked', version: '1.0.0' },
		{ key: 'daily_goal.completed', version: '1.0.0' },
		{ key: 'certificate.issued', version: '1.0.0' },
	],
});
