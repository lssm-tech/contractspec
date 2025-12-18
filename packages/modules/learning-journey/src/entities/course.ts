import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';

/**
 * Course difficulty enum.
 */
export const CourseDifficultyEnum = defineEntityEnum({
  name: 'CourseDifficulty',
  values: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as const,
  schema: 'lssm_learning',
  description: 'Difficulty level of a course.',
});

/**
 * Course status enum.
 */
export const CourseStatusEnum = defineEntityEnum({
  name: 'CourseStatus',
  values: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const,
  schema: 'lssm_learning',
  description: 'Publication status of a course.',
});

/**
 * Lesson type enum.
 */
export const LessonTypeEnum = defineEntityEnum({
  name: 'LessonType',
  values: [
    'CONTENT',
    'VIDEO',
    'INTERACTIVE',
    'QUIZ',
    'PRACTICE',
    'PROJECT',
  ] as const,
  schema: 'lssm_learning',
  description: 'Type of lesson content.',
});

/**
 * Content type enum.
 */
export const ContentTypeEnum = defineEntityEnum({
  name: 'ContentType',
  values: ['MARKDOWN', 'VIDEO', 'AUDIO', 'EMBED', 'SCORM', 'CUSTOM'] as const,
  schema: 'lssm_learning',
  description: 'Type of lesson content format.',
});

/**
 * Course entity - defines a learning course.
 */
export const CourseEntity = defineEntity({
  name: 'Course',
  description: 'A structured learning course.',
  schema: 'lssm_learning',
  map: 'course',
  fields: {
    id: field.id({ description: 'Unique course identifier' }),

    // Basic info
    title: field.string({ description: 'Course title' }),
    slug: field.string({ isUnique: true, description: 'URL-friendly slug' }),
    description: field.string({
      isOptional: true,
      description: 'Course description',
    }),
    summary: field.string({ isOptional: true, description: 'Short summary' }),

    // Classification
    difficulty: field.enum('CourseDifficulty', {
      default: 'BEGINNER',
      description: 'Difficulty level',
    }),
    category: field.string({
      isOptional: true,
      description: 'Course category',
    }),
    tags: field.json({ isOptional: true, description: 'Tags for discovery' }),

    // Prerequisites
    prerequisites: field.json({
      isOptional: true,
      description: 'Required course IDs',
    }),
    requiredSkills: field.json({
      isOptional: true,
      description: 'Required skill levels',
    }),

    // Duration
    estimatedDuration: field.int({
      isOptional: true,
      description: 'Estimated duration in minutes',
    }),

    // Media
    thumbnailUrl: field.string({
      isOptional: true,
      description: 'Thumbnail image URL',
    }),
    coverImageUrl: field.string({
      isOptional: true,
      description: 'Cover image URL',
    }),
    promoVideoUrl: field.string({
      isOptional: true,
      description: 'Promo video URL',
    }),

    // Publishing
    status: field.enum('CourseStatus', {
      default: 'DRAFT',
      description: 'Publication status',
    }),
    publishedAt: field.dateTime({
      isOptional: true,
      description: 'When published',
    }),

    // Author
    authorId: field.string({ description: 'Author user ID' }),

    // Organization scope
    orgId: field.string({
      isOptional: true,
      description: 'Organization scope',
    }),

    // Settings
    isPublic: field.boolean({
      default: false,
      description: 'Whether course is publicly accessible',
    }),
    isFeatured: field.boolean({
      default: false,
      description: 'Whether course is featured',
    }),
    certificateEnabled: field.boolean({
      default: false,
      description: 'Award certificate on completion',
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
    modules: field.hasMany('CourseModule'),
    enrollments: field.hasMany('Enrollment'),
  },
  indexes: [
    index.on(['orgId', 'status']),
    index.on(['category']),
    index.on(['difficulty']),
    index.on(['authorId']),
  ],
  enums: [CourseDifficultyEnum, CourseStatusEnum],
});

/**
 * CourseModule entity - a section within a course.
 */
export const CourseModuleEntity = defineEntity({
  name: 'CourseModule',
  description: 'A module (section) within a course.',
  schema: 'lssm_learning',
  map: 'course_module',
  fields: {
    id: field.id({ description: 'Unique module identifier' }),
    courseId: field.foreignKey({ description: 'Parent course' }),

    // Basic info
    title: field.string({ description: 'Module title' }),
    description: field.string({
      isOptional: true,
      description: 'Module description',
    }),

    // Ordering
    order: field.int({ default: 0, description: 'Display order' }),

    // Unlock conditions
    unlockCondition: field.json({
      isOptional: true,
      description: 'Conditions to unlock module',
    }),
    prerequisiteModuleIds: field.json({
      isOptional: true,
      description: 'Required modules to complete first',
    }),

    // Duration
    estimatedDuration: field.int({
      isOptional: true,
      description: 'Estimated duration in minutes',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    course: field.belongsTo('Course', ['courseId'], ['id'], {
      onDelete: 'Cascade',
    }),
    lessons: field.hasMany('Lesson'),
    completions: field.hasMany('ModuleCompletion'),
  },
  indexes: [index.on(['courseId', 'order'])],
});

/**
 * Lesson entity - individual learning unit.
 */
export const LessonEntity = defineEntity({
  name: 'Lesson',
  description: 'An individual lesson within a module.',
  schema: 'lssm_learning',
  map: 'lesson',
  fields: {
    id: field.id({ description: 'Unique lesson identifier' }),
    moduleId: field.foreignKey({ description: 'Parent module' }),

    // Basic info
    title: field.string({ description: 'Lesson title' }),
    description: field.string({
      isOptional: true,
      description: 'Lesson description',
    }),

    // Type and content
    type: field.enum('LessonType', {
      default: 'CONTENT',
      description: 'Lesson type',
    }),

    // Ordering
    order: field.int({ default: 0, description: 'Display order' }),

    // Duration
    estimatedDuration: field.int({
      isOptional: true,
      description: 'Estimated duration in minutes',
    }),

    // XP reward
    xpReward: field.int({
      default: 10,
      description: 'XP awarded on completion',
    }),

    // Settings
    isFree: field.boolean({
      default: false,
      description: 'Whether lesson is free preview',
    }),
    isRequired: field.boolean({
      default: true,
      description: 'Whether lesson is required for completion',
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
    module: field.belongsTo('CourseModule', ['moduleId'], ['id'], {
      onDelete: 'Cascade',
    }),
    contents: field.hasMany('LessonContent'),
    progress: field.hasMany('LessonProgress'),
    quizzes: field.hasMany('Quiz'),
  },
  indexes: [index.on(['moduleId', 'order']), index.on(['type'])],
  enums: [LessonTypeEnum],
});

/**
 * LessonContent entity - content blocks within a lesson.
 */
export const LessonContentEntity = defineEntity({
  name: 'LessonContent',
  description: 'Content block within a lesson.',
  schema: 'lssm_learning',
  map: 'lesson_content',
  fields: {
    id: field.id({ description: 'Unique content identifier' }),
    lessonId: field.foreignKey({ description: 'Parent lesson' }),

    // Content type and data
    contentType: field.enum('ContentType', { description: 'Content format' }),
    content: field.string({
      isOptional: true,
      description: 'Text content (markdown, etc.)',
    }),
    mediaUrl: field.string({
      isOptional: true,
      description: 'Media URL for video/audio',
    }),
    embedData: field.json({
      isOptional: true,
      description: 'Embed data for external content',
    }),

    // Ordering
    order: field.int({ default: 0, description: 'Display order' }),

    // Duration
    duration: field.int({
      isOptional: true,
      description: 'Content duration in seconds',
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
    lesson: field.belongsTo('Lesson', ['lessonId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [index.on(['lessonId', 'order'])],
  enums: [ContentTypeEnum],
});

export const courseEntities = [
  CourseEntity,
  CourseModuleEntity,
  LessonEntity,
  LessonContentEntity,
];

export const courseEnums = [
  CourseDifficultyEnum,
  CourseStatusEnum,
  LessonTypeEnum,
  ContentTypeEnum,
];


