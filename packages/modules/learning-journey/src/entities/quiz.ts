import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';

/**
 * Question type enum.
 */
export const QuestionTypeEnum = defineEntityEnum({
  name: 'QuestionType',
  values: ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_BLANK', 'MATCHING', 'SHORT_ANSWER', 'CODE'] as const,
  schema: 'lssm_learning',
  description: 'Type of quiz question.',
});

/**
 * Quiz status enum.
 */
export const QuizStatusEnum = defineEntityEnum({
  name: 'QuizStatus',
  values: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const,
  schema: 'lssm_learning',
  description: 'Publication status of a quiz.',
});

/**
 * Attempt status enum.
 */
export const AttemptStatusEnum = defineEntityEnum({
  name: 'AttemptStatus',
  values: ['IN_PROGRESS', 'COMPLETED', 'TIMED_OUT', 'ABANDONED'] as const,
  schema: 'lssm_learning',
  description: 'Status of a quiz attempt.',
});

/**
 * Quiz entity - assessment for a lesson.
 */
export const QuizEntity = defineEntity({
  name: 'Quiz',
  description: 'A quiz assessment.',
  schema: 'lssm_learning',
  map: 'quiz',
  fields: {
    id: field.id({ description: 'Unique quiz identifier' }),
    lessonId: field.foreignKey({ isOptional: true, description: 'Associated lesson' }),
    
    // Basic info
    title: field.string({ description: 'Quiz title' }),
    description: field.string({ isOptional: true, description: 'Quiz description' }),
    instructions: field.string({ isOptional: true, description: 'Quiz instructions' }),
    
    // Settings
    passingScore: field.int({ default: 70, description: 'Passing score percentage' }),
    timeLimit: field.int({ isOptional: true, description: 'Time limit in seconds' }),
    maxAttempts: field.int({ isOptional: true, description: 'Maximum attempts allowed' }),
    
    // Display options
    shuffleQuestions: field.boolean({ default: false, description: 'Shuffle question order' }),
    shuffleOptions: field.boolean({ default: false, description: 'Shuffle answer options' }),
    showCorrectAnswers: field.boolean({ default: true, description: 'Show correct answers after' }),
    showExplanations: field.boolean({ default: true, description: 'Show explanations after' }),
    
    // Status
    status: field.enum('QuizStatus', { default: 'DRAFT', description: 'Publication status' }),
    
    // Scoring
    totalPoints: field.int({ default: 0, description: 'Total points available' }),
    
    // XP
    xpReward: field.int({ default: 20, description: 'XP for passing' }),
    
    // Organization scope
    orgId: field.string({ isOptional: true, description: 'Organization scope' }),
    
    // Metadata
    metadata: field.json({ isOptional: true, description: 'Additional metadata' }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    lesson: field.belongsTo('Lesson', ['lessonId'], ['id'], { onDelete: 'Cascade' }),
    questions: field.hasMany('Question'),
    attempts: field.hasMany('QuizAttempt'),
  },
  indexes: [
    index.on(['lessonId']),
    index.on(['status']),
    index.on(['orgId']),
  ],
  enums: [QuizStatusEnum],
});

/**
 * Question entity - individual quiz question.
 */
export const QuestionEntity = defineEntity({
  name: 'Question',
  description: 'A quiz question.',
  schema: 'lssm_learning',
  map: 'question',
  fields: {
    id: field.id({ description: 'Unique question identifier' }),
    quizId: field.foreignKey({ description: 'Parent quiz' }),
    
    // Question content
    type: field.enum('QuestionType', { description: 'Question type' }),
    content: field.string({ description: 'Question text' }),
    
    // Media
    mediaUrl: field.string({ isOptional: true, description: 'Question media' }),
    
    // Scoring
    points: field.int({ default: 1, description: 'Points for correct answer' }),
    
    // For code questions
    codeLanguage: field.string({ isOptional: true, description: 'Programming language' }),
    codeTemplate: field.string({ isOptional: true, description: 'Starter code template' }),
    testCases: field.json({ isOptional: true, description: 'Test cases for code validation' }),
    
    // Feedback
    explanation: field.string({ isOptional: true, description: 'Explanation of correct answer' }),
    hint: field.string({ isOptional: true, description: 'Hint for the question' }),
    
    // Ordering
    order: field.int({ default: 0, description: 'Display order' }),
    
    // Skill mapping
    skillId: field.string({ isOptional: true, description: 'Associated skill' }),
    
    // Metadata
    metadata: field.json({ isOptional: true, description: 'Additional metadata' }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    quiz: field.belongsTo('Quiz', ['quizId'], ['id'], { onDelete: 'Cascade' }),
    options: field.hasMany('QuestionOption'),
  },
  indexes: [
    index.on(['quizId', 'order']),
    index.on(['type']),
    index.on(['skillId']),
  ],
  enums: [QuestionTypeEnum],
});

/**
 * QuestionOption entity - answer option for a question.
 */
export const QuestionOptionEntity = defineEntity({
  name: 'QuestionOption',
  description: 'An answer option for a question.',
  schema: 'lssm_learning',
  map: 'question_option',
  fields: {
    id: field.id({ description: 'Unique option identifier' }),
    questionId: field.foreignKey({ description: 'Parent question' }),
    
    // Content
    content: field.string({ description: 'Option text' }),
    
    // For matching questions
    matchContent: field.string({ isOptional: true, description: 'Match pair content' }),
    
    // Correctness
    isCorrect: field.boolean({ default: false, description: 'Whether option is correct' }),
    
    // Feedback
    feedback: field.string({ isOptional: true, description: 'Feedback when selected' }),
    
    // Ordering
    order: field.int({ default: 0, description: 'Display order' }),
    
    // Metadata
    metadata: field.json({ isOptional: true, description: 'Additional metadata' }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    question: field.belongsTo('Question', ['questionId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [
    index.on(['questionId', 'order']),
  ],
});

/**
 * QuizAttempt entity - a learner's quiz attempt.
 */
export const QuizAttemptEntity = defineEntity({
  name: 'QuizAttempt',
  description: 'A learner quiz attempt.',
  schema: 'lssm_learning',
  map: 'quiz_attempt',
  fields: {
    id: field.id({ description: 'Unique attempt identifier' }),
    learnerId: field.foreignKey({ description: 'Learner' }),
    quizId: field.foreignKey({ description: 'Quiz' }),
    
    // Status
    status: field.enum('AttemptStatus', { default: 'IN_PROGRESS', description: 'Attempt status' }),
    
    // Results
    score: field.int({ isOptional: true, description: 'Score achieved' }),
    percentageScore: field.int({ isOptional: true, description: 'Percentage score' }),
    passed: field.boolean({ isOptional: true, description: 'Whether passed' }),
    
    // Question tracking
    totalQuestions: field.int({ default: 0, description: 'Total questions' }),
    answeredQuestions: field.int({ default: 0, description: 'Questions answered' }),
    correctAnswers: field.int({ default: 0, description: 'Correct answers' }),
    
    // Answers
    answers: field.json({ isOptional: true, description: 'Submitted answers' }),
    
    // XP
    xpEarned: field.int({ default: 0, description: 'XP earned' }),
    
    // Time tracking
    timeSpent: field.int({ default: 0, description: 'Time spent in seconds' }),
    
    // Timeline
    startedAt: field.dateTime({ description: 'When started' }),
    completedAt: field.dateTime({ isOptional: true, description: 'When completed' }),
    
    // Attempt number
    attemptNumber: field.int({ default: 1, description: 'Which attempt this is' }),
    
    // Metadata
    metadata: field.json({ isOptional: true, description: 'Additional metadata' }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    learner: field.belongsTo('Learner', ['learnerId'], ['id'], { onDelete: 'Cascade' }),
    quiz: field.belongsTo('Quiz', ['quizId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [
    index.on(['learnerId', 'quizId']),
    index.on(['learnerId', 'status']),
    index.on(['quizId', 'status']),
  ],
  enums: [AttemptStatusEnum],
});

/**
 * SkillAssessment entity - maps quiz performance to skills.
 */
export const SkillAssessmentEntity = defineEntity({
  name: 'SkillAssessment',
  description: 'Assessment of a skill based on quiz performance.',
  schema: 'lssm_learning',
  map: 'skill_assessment',
  fields: {
    id: field.id({ description: 'Unique assessment identifier' }),
    learnerId: field.foreignKey({ description: 'Learner' }),
    
    // Skill
    skillId: field.string({ description: 'Skill identifier' }),
    skillName: field.string({ description: 'Skill name' }),
    
    // Assessment
    level: field.int({ default: 1, description: 'Proficiency level (1-5)' }),
    score: field.int({ default: 0, description: 'Assessment score (0-100)' }),
    confidence: field.decimal({ default: 0.5, description: 'Confidence in assessment' }),
    
    // Stats
    questionsAnswered: field.int({ default: 0, description: 'Total questions answered' }),
    questionsCorrect: field.int({ default: 0, description: 'Total correct' }),
    
    // Timestamps
    assessedAt: field.dateTime({ description: 'Last assessment time' }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    learner: field.belongsTo('Learner', ['learnerId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [
    index.unique(['learnerId', 'skillId'], { name: 'skill_assessment_unique' }),
    index.on(['learnerId', 'level']),
    index.on(['skillId']),
  ],
});

export const quizEntities = [
  QuizEntity,
  QuestionEntity,
  QuestionOptionEntity,
  QuizAttemptEntity,
  SkillAssessmentEntity,
];

export const quizEnums = [
  QuestionTypeEnum,
  QuizStatusEnum,
  AttemptStatusEnum,
];

