import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';

/**
 * Learning style enum.
 */
export const LearningStyleEnum = defineEntityEnum({
  name: 'LearningStyle',
  values: ['VISUAL', 'AUDITORY', 'READING', 'KINESTHETIC', 'MIXED'] as const,
  schema: 'lssm_learning',
  description: 'Preferred learning style.',
});

/**
 * Recommendation type enum.
 */
export const RecommendationTypeEnum = defineEntityEnum({
  name: 'RecommendationType',
  values: [
    'COURSE',
    'LESSON',
    'REVIEW',
    'PRACTICE',
    'ASSESSMENT',
    'DECK',
  ] as const,
  schema: 'lssm_learning',
  description: 'Type of learning recommendation.',
});

/**
 * LearnerProfile entity - AI personalization profile.
 */
export const LearnerProfileEntity = defineEntity({
  name: 'LearnerProfile',
  description: 'AI personalization profile for a learner.',
  schema: 'lssm_learning',
  map: 'learner_profile',
  fields: {
    id: field.id({ description: 'Unique profile identifier' }),
    learnerId: field.foreignKey({ description: 'Learner' }),

    // Learning preferences
    learningStyle: field.enum('LearningStyle', {
      default: 'MIXED',
      description: 'Preferred learning style',
    }),
    preferredDifficulty: field.string({
      default: '"adaptive"',
      description: 'Difficulty preference',
    }),
    preferredSessionLength: field.int({
      default: 30,
      description: 'Preferred session length in minutes',
    }),

    // Interests and goals
    interests: field.json({ isOptional: true, description: 'Topic interests' }),
    goals: field.json({ isOptional: true, description: 'Learning goals' }),

    // Pace
    pacePreference: field.string({
      default: '"normal"',
      description: 'Learning pace: slow, normal, fast',
    }),

    // Engagement patterns
    bestTimeOfDay: field.string({
      isOptional: true,
      description: 'Best time for learning',
    }),
    averageSessionLength: field.int({
      isOptional: true,
      description: 'Average session length',
    }),
    daysActivePerWeek: field.int({
      isOptional: true,
      description: 'Days active per week',
    }),

    // Performance
    avgQuizScore: field.int({
      isOptional: true,
      description: 'Average quiz score',
    }),
    avgLessonCompletionTime: field.int({
      isOptional: true,
      description: 'Avg lesson completion time',
    }),

    // AI analysis
    strengths: field.json({
      isOptional: true,
      description: 'Identified strengths',
    }),
    weaknesses: field.json({
      isOptional: true,
      description: 'Areas for improvement',
    }),

    // Metadata
    lastAnalyzedAt: field.dateTime({
      isOptional: true,
      description: 'Last AI analysis',
    }),
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
  },
  indexes: [
    index.unique(['learnerId'], { name: 'learner_profile_unique' }),
    index.on(['learningStyle']),
  ],
  enums: [LearningStyleEnum],
});

/**
 * SkillMap entity - tracks skill proficiency.
 */
export const SkillMapEntity = defineEntity({
  name: 'SkillMap',
  description: 'Maps learner proficiency across skills.',
  schema: 'lssm_learning',
  map: 'skill_map',
  fields: {
    id: field.id({ description: 'Unique skill map identifier' }),
    learnerId: field.foreignKey({ description: 'Learner' }),

    // Skill
    skillId: field.string({ description: 'Skill identifier' }),
    skillName: field.string({ description: 'Skill name' }),
    skillCategory: field.string({
      isOptional: true,
      description: 'Skill category',
    }),

    // Proficiency
    level: field.int({ default: 0, description: 'Proficiency level (0-100)' }),
    confidence: field.decimal({
      default: 0.5,
      description: 'Confidence in assessment',
    }),

    // Progress
    lessonsCompleted: field.int({
      default: 0,
      description: 'Related lessons completed',
    }),
    quizzesCompleted: field.int({
      default: 0,
      description: 'Related quizzes completed',
    }),
    practiceTime: field.int({
      default: 0,
      description: 'Practice time in minutes',
    }),

    // Last activity
    lastPracticedAt: field.dateTime({
      isOptional: true,
      description: 'Last practice time',
    }),

    // AI analysis
    learningVelocity: field.decimal({
      isOptional: true,
      description: 'Learning speed for this skill',
    }),
    predictedTimeToMastery: field.int({
      isOptional: true,
      description: 'Predicted time to mastery (minutes)',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    learner: field.belongsTo('Learner', ['learnerId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [
    index.unique(['learnerId', 'skillId'], { name: 'skill_map_unique' }),
    index.on(['skillId', 'level']),
    index.on(['learnerId', 'level']),
  ],
});

/**
 * LearningPath entity - AI-generated learning paths.
 */
export const LearningPathEntity = defineEntity({
  name: 'LearningPath',
  description: 'AI-generated personalized learning path.',
  schema: 'lssm_learning',
  map: 'learning_path',
  fields: {
    id: field.id({ description: 'Unique path identifier' }),
    learnerId: field.foreignKey({ description: 'Learner' }),

    // Path info
    name: field.string({ description: 'Path name' }),
    description: field.string({
      isOptional: true,
      description: 'Path description',
    }),
    goal: field.string({ isOptional: true, description: 'Path goal' }),

    // Steps
    steps: field.json({ description: 'Ordered list of learning steps' }),
    currentStepIndex: field.int({
      default: 0,
      description: 'Current step index',
    }),

    // Progress
    progress: field.int({ default: 0, description: 'Completion percentage' }),
    completedSteps: field.int({ default: 0, description: 'Steps completed' }),
    totalSteps: field.int({ default: 0, description: 'Total steps' }),

    // Generation
    generatedAt: field.dateTime({ description: 'When path was generated' }),
    adaptedFrom: field.string({
      isOptional: true,
      description: 'Original path ID if adapted',
    }),

    // AI metadata
    generationParams: field.json({
      isOptional: true,
      description: 'AI generation parameters',
    }),
    adaptationHistory: field.json({
      isOptional: true,
      description: 'Path adaptation history',
    }),

    // Status
    isActive: field.boolean({
      default: true,
      description: 'Whether path is active',
    }),
    isCompleted: field.boolean({
      default: false,
      description: 'Whether path is completed',
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
    estimatedCompletionDate: field.dateTime({
      isOptional: true,
      description: 'Estimated completion',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    learner: field.belongsTo('Learner', ['learnerId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [index.on(['learnerId', 'isActive']), index.on(['generatedAt'])],
});

/**
 * Recommendation entity - AI-powered learning recommendations.
 */
export const RecommendationEntity = defineEntity({
  name: 'Recommendation',
  description: 'AI-powered learning recommendation.',
  schema: 'lssm_learning',
  map: 'recommendation',
  fields: {
    id: field.id({ description: 'Unique recommendation identifier' }),
    learnerId: field.foreignKey({ description: 'Learner' }),

    // Recommendation
    type: field.enum('RecommendationType', {
      description: 'Recommendation type',
    }),
    itemId: field.string({ description: 'Recommended item ID' }),
    itemType: field.string({
      description: 'Item type (course, lesson, deck, etc.)',
    }),

    // Scoring
    score: field.decimal({ description: 'Recommendation score (0-1)' }),
    confidence: field.decimal({ description: 'Confidence in recommendation' }),

    // Reasoning
    reason: field.string({ description: 'Human-readable reason' }),
    factors: field.json({
      isOptional: true,
      description: 'Factors that contributed to recommendation',
    }),

    // Status
    status: field.string({
      default: '"pending"',
      description: 'Status: pending, viewed, accepted, dismissed',
    }),
    viewedAt: field.dateTime({ isOptional: true, description: 'When viewed' }),
    acceptedAt: field.dateTime({
      isOptional: true,
      description: 'When accepted',
    }),
    dismissedAt: field.dateTime({
      isOptional: true,
      description: 'When dismissed',
    }),

    // Feedback
    feedback: field.string({ isOptional: true, description: 'User feedback' }),
    feedbackRating: field.int({
      isOptional: true,
      description: 'Feedback rating (1-5)',
    }),

    // Expiry
    expiresAt: field.dateTime({
      isOptional: true,
      description: 'When recommendation expires',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    learner: field.belongsTo('Learner', ['learnerId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [
    index.on(['learnerId', 'status', 'score']),
    index.on(['type', 'status']),
    index.on(['expiresAt']),
  ],
  enums: [RecommendationTypeEnum],
});

/**
 * LearningGap entity - identified knowledge gaps.
 */
export const LearningGapEntity = defineEntity({
  name: 'LearningGap',
  description: 'Identified learning gap.',
  schema: 'lssm_learning',
  map: 'learning_gap',
  fields: {
    id: field.id({ description: 'Unique gap identifier' }),
    learnerId: field.foreignKey({ description: 'Learner' }),

    // Gap info
    skillId: field.string({ description: 'Skill with gap' }),
    skillName: field.string({ description: 'Skill name' }),

    // Severity
    severity: field.string({
      default: '"moderate"',
      description: 'Gap severity: minor, moderate, major',
    }),
    confidence: field.decimal({ description: 'Confidence in gap detection' }),

    // Evidence
    evidence: field.json({ isOptional: true, description: 'Evidence for gap' }),
    relatedQuestions: field.json({
      isOptional: true,
      description: 'Questions that revealed gap',
    }),

    // Remediation
    suggestedRemediation: field.json({
      isOptional: true,
      description: 'Suggested remediation',
    }),
    remediationProgress: field.int({
      default: 0,
      description: 'Remediation progress',
    }),

    // Status
    status: field.string({
      default: '"open"',
      description: 'Status: open, in_progress, resolved',
    }),
    resolvedAt: field.dateTime({
      isOptional: true,
      description: 'When resolved',
    }),

    // Timestamps
    detectedAt: field.dateTime({ description: 'When gap was detected' }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    learner: field.belongsTo('Learner', ['learnerId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [
    index.on(['learnerId', 'status']),
    index.on(['skillId', 'status']),
    index.on(['severity', 'status']),
  ],
});

export const aiEntities = [
  LearnerProfileEntity,
  SkillMapEntity,
  LearningPathEntity,
  RecommendationEntity,
  LearningGapEntity,
];

export const aiEnums = [LearningStyleEnum, RecommendationTypeEnum];


