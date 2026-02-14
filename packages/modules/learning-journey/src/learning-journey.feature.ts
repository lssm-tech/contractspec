/**
 * Learning Journey Feature Module Specification
 *
 * Defines the feature module for learning, onboarding, and gamification.
 */
import { defineFeature } from '@contractspec/lib.contracts-spec';

/**
 * Learning Journey feature module that bundles course enrollment,
 * onboarding tracks, flashcard review, and gamification capabilities.
 */
export const LearningJourneyFeature = defineFeature({
  meta: {
    key: 'learning-journey',
    version: '1.0.0',
    title: 'Learning Journey',
    description:
      'Learning platform with courses, onboarding, flashcards, and gamification',
    domain: 'learning',
    owners: ['@platform.learning-journey'],
    tags: ['learning', 'onboarding', 'courses', 'flashcards', 'gamification'],
    stability: 'stable',
  },

  // All contract operations included in this feature
  operations: [
    // Onboarding operations
    { key: 'learning.onboarding.recordEvent', version: '1.0.0' },
    { key: 'learning.onboarding.listTracks', version: '1.0.0' },
    { key: 'learning.onboarding.getProgress', version: '1.0.0' },

    // Core learning operations
    { key: 'learning.enroll', version: '1.0.0' },
    { key: 'learning.completeLesson', version: '1.0.0' },
    { key: 'learning.submitCardReview', version: '1.0.0' },
    { key: 'learning.getDueCards', version: '1.0.0' },
    { key: 'learning.getDashboard', version: '1.0.0' },
  ],

  // Events emitted by this feature
  events: [
    // Course events
    { key: 'course.published', version: '1.0.0' },
    { key: 'course.completed', version: '1.0.0' },

    // Enrollment events
    { key: 'enrollment.created', version: '1.0.0' },

    // Progress events
    { key: 'lesson.completed', version: '1.0.0' },

    // Onboarding events
    { key: 'onboarding.started', version: '1.0.0' },
    { key: 'onboarding.step_completed', version: '1.0.0' },
    { key: 'onboarding.completed', version: '1.0.0' },

    // Flashcard events
    { key: 'flashcard.reviewed', version: '1.0.0' },

    // Quiz events
    { key: 'quiz.started', version: '1.0.0' },
    { key: 'quiz.completed', version: '1.0.0' },

    // Gamification events
    { key: 'xp.earned', version: '1.0.0' },
    { key: 'level.up', version: '1.0.0' },
    { key: 'streak.updated', version: '1.0.0' },
    { key: 'achievement.unlocked', version: '1.0.0' },
    { key: 'daily_goal.completed', version: '1.0.0' },

    // Certificate events
    { key: 'certificate.issued', version: '1.0.0' },
  ],

  // No presentations for this module feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [
      { key: 'learning-journey', version: '1.0.0' },
      { key: 'onboarding', version: '1.0.0' },
      { key: 'gamification', version: '1.0.0' },
    ],
    requires: [{ key: 'identity', version: '1.0.0' }],
  },
});
