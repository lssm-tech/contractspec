/**
 * Learning Journey Feature Module Specification
 *
 * Defines the feature module for learning, onboarding, and gamification.
 */
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

/**
 * Learning Journey feature module that bundles course enrollment,
 * onboarding tracks, flashcard review, and gamification capabilities.
 */
export const LearningJourneyFeature: FeatureModuleSpec = {
  meta: {
    key: 'learning-journey',
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
    { name: 'learning.onboarding.recordEvent', version: 1 },
    { name: 'learning.onboarding.listTracks', version: 1 },
    { name: 'learning.onboarding.getProgress', version: 1 },

    // Core learning operations
    { name: 'learning.enroll', version: 1 },
    { name: 'learning.completeLesson', version: 1 },
    { name: 'learning.submitCardReview', version: 1 },
    { name: 'learning.getDueCards', version: 1 },
    { name: 'learning.getDashboard', version: 1 },
  ],

  // Events emitted by this feature
  events: [
    // Course events
    { name: 'course.published', version: 1 },
    { name: 'course.completed', version: 1 },

    // Enrollment events
    { name: 'enrollment.created', version: 1 },

    // Progress events
    { name: 'lesson.completed', version: 1 },

    // Onboarding events
    { name: 'onboarding.started', version: 1 },
    { name: 'onboarding.step_completed', version: 1 },
    { name: 'onboarding.completed', version: 1 },

    // Flashcard events
    { name: 'flashcard.reviewed', version: 1 },

    // Quiz events
    { name: 'quiz.started', version: 1 },
    { name: 'quiz.completed', version: 1 },

    // Gamification events
    { name: 'xp.earned', version: 1 },
    { name: 'level.up', version: 1 },
    { name: 'streak.updated', version: 1 },
    { name: 'achievement.unlocked', version: 1 },
    { name: 'daily_goal.completed', version: 1 },

    // Certificate events
    { name: 'certificate.issued', version: 1 },
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
