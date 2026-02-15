import { defineCommand, defineQuery } from '@contractspec/lib.contracts-spec';

import {
  CompleteLessonInput,
  EnrollInCourseInput,
  EnrollmentModel,
  GetDueCardsInput,
  GetDueCardsOutput,
  GetLearnerDashboardInput,
  LearnerDashboardModel,
  SubmitCardReviewInput,
  SuccessOutput,
} from './models';
import { LEARNING_JOURNEY_OWNERS } from './shared';

/**
 * Enroll in a course.
 */
export const EnrollInCourseContract = defineCommand({
  meta: {
    key: 'learning.enroll',
    version: '1.0.0',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'enrollment'],
    description: 'Enroll in a course.',
    goal: 'Start learning a new course.',
    context: 'Called when a learner wants to start a course.',
  },
  io: {
    input: EnrollInCourseInput,
    output: EnrollmentModel,
    errors: {
      COURSE_NOT_FOUND: {
        description: 'Course does not exist',
        http: 404,
        gqlCode: 'COURSE_NOT_FOUND',
        when: 'Course ID is invalid',
      },
      ALREADY_ENROLLED: {
        description: 'Already enrolled in course',
        http: 409,
        gqlCode: 'ALREADY_ENROLLED',
        when: 'Learner is already enrolled',
      },
    },
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Complete a lesson.
 */
export const CompleteLessonContract = defineCommand({
  meta: {
    key: 'learning.completeLesson',
    version: '1.0.0',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'progress'],
    description: 'Mark a lesson as completed.',
    goal: 'Record lesson completion and earn XP.',
    context: 'Called when a learner finishes a lesson.',
  },
  io: {
    input: CompleteLessonInput,
    output: SuccessOutput,
    errors: {
      LESSON_NOT_FOUND: {
        description: 'Lesson does not exist',
        http: 404,
        gqlCode: 'LESSON_NOT_FOUND',
        when: 'Lesson ID is invalid',
      },
      NOT_ENROLLED: {
        description: 'Not enrolled in course',
        http: 403,
        gqlCode: 'NOT_ENROLLED',
        when: 'Learner is not enrolled in the course',
      },
    },
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Submit a card review.
 */
export const SubmitCardReviewContract = defineCommand({
  meta: {
    key: 'learning.submitCardReview',
    version: '1.0.0',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'flashcards'],
    description: 'Submit a flashcard review.',
    goal: 'Record review and update SRS schedule.',
    context: 'Called when reviewing flashcards.',
  },
  io: {
    input: SubmitCardReviewInput,
    output: SuccessOutput,
    errors: {
      CARD_NOT_FOUND: {
        description: 'Card does not exist',
        http: 404,
        gqlCode: 'CARD_NOT_FOUND',
        when: 'Card ID is invalid',
      },
      INVALID_RATING: {
        description: 'Invalid rating',
        http: 400,
        gqlCode: 'INVALID_RATING',
        when: 'Rating must be AGAIN, HARD, GOOD, or EASY',
      },
    },
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Get cards due for review.
 */
export const GetDueCardsContract = defineQuery({
  meta: {
    key: 'learning.getDueCards',
    version: '1.0.0',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'flashcards'],
    description: 'Get flashcards due for review.',
    goal: 'Get the next batch of cards to review.',
    context: 'Called when starting a review session.',
  },
  io: {
    input: GetDueCardsInput,
    output: GetDueCardsOutput,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Get learner dashboard.
 */
export const GetLearnerDashboardContract = defineQuery({
  meta: {
    key: 'learning.getDashboard',
    version: '1.0.0',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'dashboard'],
    description: 'Get learner dashboard data.',
    goal: 'Display learner progress and stats.',
    context: 'Called when viewing the learning dashboard.',
  },
  io: {
    input: GetLearnerDashboardInput,
    output: LearnerDashboardModel,
  },
  policy: {
    auth: 'user',
  },
});
