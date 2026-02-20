import {
  defineEntity,
  defineEntityEnum,
  field,
  index,
} from '@contractspec/lib.schema';

/**
 * Enrollment status enum.
 */
export const EnrollmentStatusEnum = defineEntityEnum({
  name: 'EnrollmentStatus',
  values: [
    'ENROLLED',
    'IN_PROGRESS',
    'COMPLETED',
    'DROPPED',
    'EXPIRED',
  ] as const,
  schema: 'lssm_learning',
  description: 'Status of a course enrollment.',
});

/**
 * Progress status enum.
 */
export const ProgressStatusEnum = defineEntityEnum({
  name: 'ProgressStatus',
  values: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED'] as const,
  schema: 'lssm_learning',
  description: 'Status of lesson progress.',
});

/**
 * Learner entity - learning profile.
 */
export const LearnerEntity = defineEntity({
  name: 'Learner',
  description: 'A learner profile.',
  schema: 'lssm_learning',
  map: 'learner',
  fields: {
    id: field.id({ description: 'Unique learner identifier' }),
    userId: field.string({ isUnique: true, description: 'Associated user ID' }),

    // Profile
    displayName: field.string({
      isOptional: true,
      description: 'Display name',
    }),
    avatarUrl: field.string({ isOptional: true, description: 'Avatar URL' }),
    bio: field.string({ isOptional: true, description: 'Short bio' }),

    // Gamification
    level: field.int({ default: 1, description: 'Current level' }),
    totalXp: field.int({ default: 0, description: 'Total XP earned' }),

    // Streaks
    currentStreak: field.int({
      default: 0,
      description: 'Current streak days',
    }),
    longestStreak: field.int({
      default: 0,
      description: 'Longest streak ever',
    }),
    lastActivityAt: field.dateTime({
      isOptional: true,
      description: 'Last learning activity',
    }),

    // Settings
    locale: field.string({
      isOptional: true,
      description:
        'Preferred locale for learning content (e.g. "en", "fr", "es")',
    }),
    timezone: field.string({
      default: '"UTC"',
      description: 'Learner timezone',
    }),
    dailyGoalXp: field.int({ default: 50, description: 'Daily XP goal' }),
    reminderEnabled: field.boolean({
      default: true,
      description: 'Enable reminders',
    }),
    reminderTime: field.string({
      isOptional: true,
      description: 'Preferred reminder time',
    }),

    // Organization scope
    orgId: field.string({
      isOptional: true,
      description: 'Organization scope',
    }),

    // Metadata
    metadata: field.json({
      isOptional: true,
      description: 'Additional metadata',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    enrollments: field.hasMany('Enrollment'),
    lessonProgress: field.hasMany('LessonProgress'),
    achievements: field.hasMany('LearnerAchievement'),
    decks: field.hasMany('Deck'),
    profile: field.hasOne('LearnerProfile'),
  },
  indexes: [
    index.on(['orgId']),
    index.on(['totalXp']),
    index.on(['level']),
    index.on(['currentStreak']),
  ],
});

/**
 * Enrollment entity - course enrollment.
 */
export const EnrollmentEntity = defineEntity({
  name: 'Enrollment',
  description: 'A learner enrollment in a course.',
  schema: 'lssm_learning',
  map: 'enrollment',
  fields: {
    id: field.id({ description: 'Unique enrollment identifier' }),
    learnerId: field.foreignKey({ description: 'Enrolled learner' }),
    courseId: field.foreignKey({ description: 'Enrolled course' }),

    // Status
    status: field.enum('EnrollmentStatus', {
      default: 'ENROLLED',
      description: 'Enrollment status',
    }),

    // Progress
    progress: field.int({
      default: 0,
      description: 'Completion percentage (0-100)',
    }),
    completedLessons: field.int({
      default: 0,
      description: 'Number of completed lessons',
    }),
    totalLessons: field.int({
      default: 0,
      description: 'Total lessons in course',
    }),

    // XP
    xpEarned: field.int({
      default: 0,
      description: 'XP earned in this course',
    }),

    // Timeline
    startedAt: field.dateTime({
      isOptional: true,
      description: 'When learner started',
    }),
    completedAt: field.dateTime({
      isOptional: true,
      description: 'When learner completed',
    }),
    lastAccessedAt: field.dateTime({
      isOptional: true,
      description: 'Last access time',
    }),

    // Certificate
    certificateId: field.string({
      isOptional: true,
      description: 'Issued certificate ID',
    }),

    // Metadata
    metadata: field.json({
      isOptional: true,
      description: 'Additional metadata',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    learner: field.belongsTo('Learner', ['learnerId'], ['id'], {
      onDelete: 'Cascade',
    }),
    course: field.belongsTo('Course', ['courseId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [
    index.unique(['learnerId', 'courseId'], { name: 'enrollment_unique' }),
    index.on(['learnerId', 'status']),
    index.on(['courseId', 'status']),
  ],
  enums: [EnrollmentStatusEnum],
});

/**
 * LessonProgress entity - tracks individual lesson progress.
 */
export const LessonProgressEntity = defineEntity({
  name: 'LessonProgress',
  description: 'Progress tracking for a lesson.',
  schema: 'lssm_learning',
  map: 'lesson_progress',
  fields: {
    id: field.id({ description: 'Unique progress identifier' }),
    learnerId: field.foreignKey({ description: 'Learner' }),
    lessonId: field.foreignKey({ description: 'Lesson' }),

    // Status
    status: field.enum('ProgressStatus', {
      default: 'NOT_STARTED',
      description: 'Progress status',
    }),

    // Progress details
    progress: field.int({
      default: 0,
      description: 'Completion percentage (0-100)',
    }),
    score: field.int({
      isOptional: true,
      description: 'Score achieved (for quizzes)',
    }),

    // Attempts
    attempts: field.int({ default: 0, description: 'Number of attempts' }),
    bestScore: field.int({
      isOptional: true,
      description: 'Best score across attempts',
    }),

    // Time tracking
    timeSpent: field.int({ default: 0, description: 'Time spent in seconds' }),

    // XP
    xpEarned: field.int({
      default: 0,
      description: 'XP earned from this lesson',
    }),

    // Timeline
    startedAt: field.dateTime({
      isOptional: true,
      description: 'When started',
    }),
    completedAt: field.dateTime({
      isOptional: true,
      description: 'When completed',
    }),
    lastAccessedAt: field.dateTime({
      isOptional: true,
      description: 'Last access time',
    }),

    // Bookmarks and notes
    bookmarks: field.json({
      isOptional: true,
      description: 'Content bookmarks',
    }),
    notes: field.string({ isOptional: true, description: 'Learner notes' }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    learner: field.belongsTo('Learner', ['learnerId'], ['id'], {
      onDelete: 'Cascade',
    }),
    lesson: field.belongsTo('Lesson', ['lessonId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [
    index.unique(['learnerId', 'lessonId'], { name: 'lesson_progress_unique' }),
    index.on(['learnerId', 'status']),
    index.on(['lessonId']),
  ],
  enums: [ProgressStatusEnum],
});

/**
 * ModuleCompletion entity - tracks module completion.
 */
export const ModuleCompletionEntity = defineEntity({
  name: 'ModuleCompletion',
  description: 'Module completion record.',
  schema: 'lssm_learning',
  map: 'module_completion',
  fields: {
    id: field.id({ description: 'Unique completion identifier' }),
    learnerId: field.foreignKey({ description: 'Learner' }),
    moduleId: field.foreignKey({ description: 'Module' }),

    // Completion details
    score: field.int({ isOptional: true, description: 'Average score' }),
    xpEarned: field.int({ default: 0, description: 'XP earned' }),
    timeSpent: field.int({ default: 0, description: 'Time spent in seconds' }),

    // Timestamps
    completedAt: field.dateTime({ description: 'When completed' }),
    createdAt: field.createdAt(),

    // Relations
    learner: field.belongsTo('Learner', ['learnerId'], ['id'], {
      onDelete: 'Cascade',
    }),
    module: field.belongsTo('CourseModule', ['moduleId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [
    index.unique(['learnerId', 'moduleId'], {
      name: 'module_completion_unique',
    }),
    index.on(['learnerId', 'completedAt']),
  ],
});

/**
 * Certificate entity - course completion certificate.
 */
export const CertificateEntity = defineEntity({
  name: 'Certificate',
  description: 'Course completion certificate.',
  schema: 'lssm_learning',
  map: 'certificate',
  fields: {
    id: field.id({ description: 'Unique certificate identifier' }),
    learnerId: field.foreignKey({ description: 'Certificate holder' }),
    courseId: field.foreignKey({ description: 'Completed course' }),
    enrollmentId: field.foreignKey({ description: 'Associated enrollment' }),

    // Certificate details
    certificateNumber: field.string({
      isUnique: true,
      description: 'Unique certificate number',
    }),
    title: field.string({ description: 'Certificate title' }),
    description: field.string({
      isOptional: true,
      description: 'Certificate description',
    }),

    // Completion details
    score: field.int({ isOptional: true, description: 'Final score' }),
    grade: field.string({ isOptional: true, description: 'Grade awarded' }),

    // Validity
    issuedAt: field.dateTime({ description: 'When issued' }),
    validUntil: field.dateTime({
      isOptional: true,
      description: 'Expiration date',
    }),

    // Verification
    verificationUrl: field.string({
      isOptional: true,
      description: 'Verification URL',
    }),
    credentialHash: field.string({
      isOptional: true,
      description: 'Credential hash for verification',
    }),

    // Status
    isRevoked: field.boolean({
      default: false,
      description: 'Whether certificate is revoked',
    }),
    revokedAt: field.dateTime({
      isOptional: true,
      description: 'When revoked',
    }),
    revokedReason: field.string({
      isOptional: true,
      description: 'Revocation reason',
    }),

    // Metadata
    metadata: field.json({
      isOptional: true,
      description: 'Additional metadata',
    }),

    // Timestamps
    createdAt: field.createdAt(),

    // Relations
    learner: field.belongsTo('Learner', ['learnerId'], ['id'], {
      onDelete: 'Cascade',
    }),
    course: field.belongsTo('Course', ['courseId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [
    index.on(['learnerId']),
    index.on(['courseId']),
    index.on(['issuedAt']),
  ],
});

export const learnerEntities = [
  LearnerEntity,
  EnrollmentEntity,
  LessonProgressEntity,
  ModuleCompletionEntity,
  CertificateEntity,
];

export const learnerEnums = [EnrollmentStatusEnum, ProgressStatusEnum];
