import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';

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
    estimatedDuration: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
    },
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

export const EnrollInCourseInput = defineSchemaModel({
  name: 'EnrollInCourseInput',
  description: 'Input for enrolling in a course',
  fields: {
    courseId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const CompleteLessonInput = defineSchemaModel({
  name: 'CompleteLessonInput',
  description: 'Input for completing a lesson',
  fields: {
    lessonId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    score: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    timeSpent: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

export const SubmitCardReviewInput = defineSchemaModel({
  name: 'SubmitCardReviewInput',
  description: 'Input for submitting a card review',
  fields: {
    cardId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    rating: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    responseTimeMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

export const GetDueCardsInput = defineSchemaModel({
  name: 'GetDueCardsInput',
  description: 'Input for getting due cards',
  fields: {
    deckId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

export const GetDueCardsOutput = defineSchemaModel({
  name: 'GetDueCardsOutput',
  description: 'Output for getting due cards',
  fields: {
    cards: { type: CardModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

export const GetLearnerDashboardInput = defineSchemaModel({
  name: 'GetLearnerDashboardInput',
  description: 'Input for getting learner dashboard',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const LearnerDashboardModel = defineSchemaModel({
  name: 'LearnerDashboard',
  description: 'Learner dashboard data',
  fields: {
    learner: { type: LearnerModel, isOptional: false },
    currentStreak: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    dailyXpGoal: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    dailyXpProgress: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    activeEnrollments: {
      type: EnrollmentModel,
      isArray: true,
      isOptional: false,
    },
    recentAchievements: {
      type: AchievementModel,
      isArray: true,
      isOptional: false,
    },
    dueCardCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

export const SuccessOutput = defineSchemaModel({
  name: 'SuccessOutput',
  description: 'Generic success output',
  fields: {
    success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    xpEarned: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});
