import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineEvent } from '@lssm/lib.contracts';
import { LEARNING_JOURNEY_OWNERS } from './contracts/shared';

// ============ Course Events ============

const CoursePublishedPayload = defineSchemaModel({
  name: 'CoursePublishedEventPayload',
  description: 'Payload when a course is published',
  fields: {
    courseId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    authorId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    publishedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const CoursePublishedEvent = defineEvent({
  meta: {
    key: 'course.published',
    version: 1,
    description: 'A course has been published.',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'course'],
  },
  payload: CoursePublishedPayload,
});

// ============ Enrollment Events ============

const EnrollmentCreatedPayload = defineSchemaModel({
  name: 'EnrollmentCreatedEventPayload',
  description: 'Payload when a learner enrolls in a course',
  fields: {
    enrollmentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    courseId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    enrolledAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const EnrollmentCreatedEvent = defineEvent({
  meta: {
    key: 'enrollment.created',
    version: 1,
    description: 'A learner has enrolled in a course.',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'enrollment'],
  },
  payload: EnrollmentCreatedPayload,
});

// ============ Progress Events ============

const LessonCompletedPayload = defineSchemaModel({
  name: 'LessonCompletedEventPayload',
  description: 'Payload when a lesson is completed',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    lessonId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    courseId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    score: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    xpEarned: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    timeSpent: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const LessonCompletedEvent = defineEvent({
  meta: {
    key: 'lesson.completed',
    version: 1,
    description: 'A learner has completed a lesson.',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'progress', 'lesson'],
  },
  payload: LessonCompletedPayload,
});

const CourseCompletedPayload = defineSchemaModel({
  name: 'CourseCompletedEventPayload',
  description: 'Payload when a course is completed',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    courseId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    enrollmentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    score: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    xpEarned: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    certificateId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const CourseCompletedEvent = defineEvent({
  meta: {
    key: 'course.completed',
    version: 1,
    description: 'A learner has completed a course.',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'progress', 'course'],
  },
  payload: CourseCompletedPayload,
});

// ============ Onboarding Events ============

const OnboardingStartedPayload = defineSchemaModel({
  name: 'OnboardingStartedEventPayload',
  description: 'Payload when onboarding starts',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    trackId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    productId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const OnboardingStartedEvent = defineEvent({
  meta: {
    key: 'onboarding.started',
    version: 1,
    description: 'A learner has started onboarding.',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'onboarding'],
  },
  payload: OnboardingStartedPayload,
});

const OnboardingStepCompletedPayload = defineSchemaModel({
  name: 'OnboardingStepCompletedEventPayload',
  description: 'Payload when an onboarding step is completed',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    trackId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    stepId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    triggeringEvent: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    xpEarned: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const OnboardingStepCompletedEvent = defineEvent({
  meta: {
    key: 'onboarding.step_completed',
    version: 1,
    description: 'An onboarding step has been completed.',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'onboarding'],
  },
  payload: OnboardingStepCompletedPayload,
});

const OnboardingCompletedPayload = defineSchemaModel({
  name: 'OnboardingCompletedEventPayload',
  description: 'Payload when onboarding is completed',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    trackId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    productId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    xpEarned: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const OnboardingCompletedEvent = defineEvent({
  meta: {
    key: 'onboarding.completed',
    version: 1,
    description: 'A learner has completed onboarding.',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'onboarding'],
  },
  payload: OnboardingCompletedPayload,
});

// ============ Flashcard Events ============

const CardReviewedPayload = defineSchemaModel({
  name: 'CardReviewedEventPayload',
  description: 'Payload when a flashcard is reviewed',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    cardId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    deckId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    rating: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    responseTimeMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    reviewedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const CardReviewedEvent = defineEvent({
  meta: {
    key: 'flashcard.reviewed',
    version: 1,
    description: 'A flashcard has been reviewed.',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'flashcards'],
  },
  payload: CardReviewedPayload,
});

// ============ Quiz Events ============

const QuizStartedPayload = defineSchemaModel({
  name: 'QuizStartedEventPayload',
  description: 'Payload when a quiz is started',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    quizId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    attemptId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    attemptNumber: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const QuizStartedEvent = defineEvent({
  meta: {
    key: 'quiz.started',
    version: 1,
    description: 'A quiz attempt has started.',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'quiz'],
  },
  payload: QuizStartedPayload,
});

const QuizCompletedPayload = defineSchemaModel({
  name: 'QuizCompletedEventPayload',
  description: 'Payload when a quiz is completed',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    quizId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    attemptId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    score: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    percentageScore: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    passed: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    xpEarned: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    timeSpent: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const QuizCompletedEvent = defineEvent({
  meta: {
    key: 'quiz.completed',
    version: 1,
    description: 'A quiz attempt has been completed.',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'quiz'],
  },
  payload: QuizCompletedPayload,
});

// ============ Gamification Events ============

const XpEarnedPayload = defineSchemaModel({
  name: 'XpEarnedEventPayload',
  description: 'Payload when XP is earned',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    amount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    source: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    sourceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    totalXp: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    earnedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const XpEarnedEvent = defineEvent({
  meta: {
    key: 'xp.earned',
    version: 1,
    description: 'XP has been earned.',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'gamification', 'xp'],
  },
  payload: XpEarnedPayload,
});

const LevelUpPayload = defineSchemaModel({
  name: 'LevelUpEventPayload',
  description: 'Payload when a learner levels up',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    previousLevel: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    newLevel: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    totalXp: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    leveledUpAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const LevelUpEvent = defineEvent({
  meta: {
    key: 'level.up',
    version: 1,
    description: 'A learner has leveled up.',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'gamification', 'level'],
  },
  payload: LevelUpPayload,
});

const StreakUpdatedPayload = defineSchemaModel({
  name: 'StreakUpdatedEventPayload',
  description: 'Payload when a streak is updated',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    previousStreak: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    currentStreak: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    longestStreak: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    freezeUsed: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const StreakUpdatedEvent = defineEvent({
  meta: {
    key: 'streak.updated',
    version: 1,
    description: 'A streak has been updated.',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'gamification', 'streak'],
  },
  payload: StreakUpdatedPayload,
});

const AchievementUnlockedPayload = defineSchemaModel({
  name: 'AchievementUnlockedEventPayload',
  description: 'Payload when an achievement is unlocked',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    achievementId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    achievementKey: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    achievementName: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    xpEarned: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    unlockedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const AchievementUnlockedEvent = defineEvent({
  meta: {
    key: 'achievement.unlocked',
    version: 1,
    description: 'An achievement has been unlocked.',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'gamification', 'achievement'],
  },
  payload: AchievementUnlockedPayload,
});

const DailyGoalCompletedPayload = defineSchemaModel({
  name: 'DailyGoalCompletedEventPayload',
  description: 'Payload when a daily goal is completed',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    date: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    targetXp: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    actualXp: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const DailyGoalCompletedEvent = defineEvent({
  meta: {
    key: 'daily_goal.completed',
    version: 1,
    description: 'A daily goal has been completed.',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'gamification', 'goal'],
  },
  payload: DailyGoalCompletedPayload,
});

// ============ Certificate Events ============

const CertificateIssuedPayload = defineSchemaModel({
  name: 'CertificateIssuedEventPayload',
  description: 'Payload when a certificate is issued',
  fields: {
    certificateId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    courseId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    certificateNumber: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    issuedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const CertificateIssuedEvent = defineEvent({
  meta: {
    key: 'certificate.issued',
    version: 1,
    description: 'A certificate has been issued.',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'certificate'],
  },
  payload: CertificateIssuedPayload,
});

/**
 * All learning journey events.
 */
export const LearningJourneyEvents = {
  CoursePublishedEvent,
  EnrollmentCreatedEvent,
  LessonCompletedEvent,
  CourseCompletedEvent,
  OnboardingStartedEvent,
  OnboardingStepCompletedEvent,
  OnboardingCompletedEvent,
  CardReviewedEvent,
  QuizStartedEvent,
  QuizCompletedEvent,
  XpEarnedEvent,
  LevelUpEvent,
  StreakUpdatedEvent,
  AchievementUnlockedEvent,
  DailyGoalCompletedEvent,
  CertificateIssuedEvent,
};
