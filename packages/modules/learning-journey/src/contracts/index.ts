import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineCommand, defineQuery } from '@lssm/lib.contracts';

const OWNERS = ['modules.learning-journey'] as const;

// ============ Schema Models ============

export const CourseModel = defineSchemaModel({
  name: 'Course',
  description: 'A learning course',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    difficulty: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    estimatedDuration: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    thumbnailUrl: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const LearnerModel = defineSchemaModel({
  name: 'Learner',
  description: 'A learner profile',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    displayName: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    level: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    totalXp: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    currentStreak: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    longestStreak: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const EnrollmentModel = defineSchemaModel({
  name: 'Enrollment',
  description: 'A course enrollment',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    courseId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    progress: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

export const ProgressModel = defineSchemaModel({
  name: 'LessonProgress',
  description: 'Lesson progress',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    lessonId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    progress: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    score: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    timeSpent: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

export const DeckModel = defineSchemaModel({
  name: 'Deck',
  description: 'A flashcard deck',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    cardCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    isPublic: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const CardModel = defineSchemaModel({
  name: 'Card',
  description: 'A flashcard',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    deckId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    front: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    back: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    hints: { type: ScalarTypeEnum.JSON(), isOptional: true },
    isDue: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    nextReviewAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

export const AchievementModel = defineSchemaModel({
  name: 'Achievement',
  description: 'An achievement',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    icon: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    xpReward: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    unlockedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

// ============ Input/Output Models ============

const EnrollInCourseInput = defineSchemaModel({
  name: 'EnrollInCourseInput',
  description: 'Input for enrolling in a course',
  fields: {
    courseId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const CompleteLessonInput = defineSchemaModel({
  name: 'CompleteLessonInput',
  description: 'Input for completing a lesson',
  fields: {
    lessonId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    score: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    timeSpent: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

const SubmitCardReviewInput = defineSchemaModel({
  name: 'SubmitCardReviewInput',
  description: 'Input for submitting a card review',
  fields: {
    cardId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    rating: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    responseTimeMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

const GetDueCardsInput = defineSchemaModel({
  name: 'GetDueCardsInput',
  description: 'Input for getting due cards',
  fields: {
    deckId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

const GetDueCardsOutput = defineSchemaModel({
  name: 'GetDueCardsOutput',
  description: 'Output for getting due cards',
  fields: {
    cards: { type: CardModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

const GetLearnerDashboardInput = defineSchemaModel({
  name: 'GetLearnerDashboardInput',
  description: 'Input for getting learner dashboard',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const LearnerDashboardModel = defineSchemaModel({
  name: 'LearnerDashboard',
  description: 'Learner dashboard data',
  fields: {
    learner: { type: LearnerModel, isOptional: false },
    currentStreak: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    dailyXpGoal: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    dailyXpProgress: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    activeEnrollments: { type: EnrollmentModel, isArray: true, isOptional: false },
    recentAchievements: { type: AchievementModel, isArray: true, isOptional: false },
    dueCardCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

const SuccessOutput = defineSchemaModel({
  name: 'SuccessOutput',
  description: 'Generic success output',
  fields: {
    success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    xpEarned: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

// ============ Contracts ============

/**
 * Enroll in a course.
 */
export const EnrollInCourseContract = defineCommand({
  meta: {
    name: 'learning.enroll',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
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
    name: 'learning.completeLesson',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
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
    name: 'learning.submitCardReview',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
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
    name: 'learning.getDueCards',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
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
    name: 'learning.getDashboard',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
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

