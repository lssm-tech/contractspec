/**
 * Learning Journey Feature Module Specification
 *
 * Defines the feature module for learning, onboarding, and gamification.
 */
import type { FeatureModuleSpec } from '@contractspec/lib.contracts';

/**
 * Learning Journey feature module that bundles course enrollment,
 * onboarding tracks, flashcard review, and gamification capabilities.
 */
export const LearningJourneyFeature: FeatureModuleSpec = {
  meta: {
    key: 'learning-journey',
    version: 1,
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
    { key: 'learning.onboarding.recordEvent', version: 1 },
    { key: 'learning.onboarding.listTracks', version: 1 },
    { key: 'learning.onboarding.getProgress', version: 1 },

    // Core learning operations
    { key: 'learning.enroll', version: 1 },
    { key: 'learning.completeLesson', version: 1 },
    { key: 'learning.submitCardReview', version: 1 },
    { key: 'learning.getDueCards', version: 1 },
    { key: 'learning.getDashboard', version: 1 },
  ],

  // Events emitted by this feature
  events: [
    // Course events
    { key: 'course.published', version: 1 },
    { key: 'course.completed', version: 1 },

    // Enrollment events
    { key: 'enrollment.created', version: 1 },

    // Progress events
    { key: 'lesson.completed', version: 1 },

    // Onboarding events
    { key: 'onboarding.started', version: 1 },
    { key: 'onboarding.step_completed', version: 1 },
    { key: 'onboarding.completed', version: 1 },

    // Flashcard events
    { key: 'flashcard.reviewed', version: 1 },

    // Quiz events
    { key: 'quiz.started', version: 1 },
    { key: 'quiz.completed', version: 1 },

    // Gamification events
    { key: 'xp.earned', version: 1 },
    { key: 'level.up', version: 1 },
    { key: 'streak.updated', version: 1 },
    { key: 'achievement.unlocked', version: 1 },
    { key: 'daily_goal.completed', version: 1 },

    // Certificate events
    { key: 'certificate.issued', version: 1 },
  ],

  // No presentations for this module feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [
      { key: 'learning-journey', version: 1 },
      { key: 'onboarding', version: 1 },
      { key: 'gamification', version: 1 },
    ],
    requires: [{ key: 'identity', version: 1 }],
  },
};
