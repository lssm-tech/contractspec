import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';

/**
 * Card rating enum for SRS.
 */
export const CardRatingEnum = defineEntityEnum({
  name: 'CardRating',
  values: ['AGAIN', 'HARD', 'GOOD', 'EASY'] as const,
  schema: 'lssm_learning',
  description: 'Rating for a flashcard review.',
});

/**
 * Deck entity - collection of flashcards.
 */
export const DeckEntity = defineEntity({
  name: 'Deck',
  description: 'A collection of flashcards.',
  schema: 'lssm_learning',
  map: 'deck',
  fields: {
    id: field.id({ description: 'Unique deck identifier' }),
    ownerId: field.foreignKey({ description: 'Deck owner (learner)' }),

    // Basic info
    title: field.string({ description: 'Deck title' }),
    description: field.string({
      isOptional: true,
      description: 'Deck description',
    }),

    // Classification
    category: field.string({ isOptional: true, description: 'Deck category' }),
    tags: field.json({ isOptional: true, description: 'Tags for discovery' }),

    // Visibility
    isPublic: field.boolean({
      default: false,
      description: 'Whether deck is publicly visible',
    }),

    // Stats
    cardCount: field.int({ default: 0, description: 'Number of cards' }),

    // Media
    coverImageUrl: field.string({
      isOptional: true,
      description: 'Cover image URL',
    }),

    // Organization scope
    orgId: field.string({
      isOptional: true,
      description: 'Organization scope',
    }),

    // Settings
    newCardsPerDay: field.int({
      default: 20,
      description: 'New cards to introduce per day',
    }),
    reviewsPerDay: field.int({
      default: 100,
      description: 'Maximum reviews per day',
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
    owner: field.belongsTo('Learner', ['ownerId'], ['id'], {
      onDelete: 'Cascade',
    }),
    cards: field.hasMany('Card'),
  },
  indexes: [
    index.on(['ownerId']),
    index.on(['isPublic', 'category']),
    index.on(['orgId']),
  ],
});

/**
 * Card entity - individual flashcard.
 */
export const CardEntity = defineEntity({
  name: 'Card',
  description: 'An individual flashcard.',
  schema: 'lssm_learning',
  map: 'card',
  fields: {
    id: field.id({ description: 'Unique card identifier' }),
    deckId: field.foreignKey({ description: 'Parent deck' }),

    // Content
    front: field.string({ description: 'Front of card (question)' }),
    back: field.string({ description: 'Back of card (answer)' }),

    // Additional content
    hints: field.json({ isOptional: true, description: 'Hints for the card' }),
    explanation: field.string({
      isOptional: true,
      description: 'Detailed explanation',
    }),

    // Media
    frontMediaUrl: field.string({
      isOptional: true,
      description: 'Media for front',
    }),
    backMediaUrl: field.string({
      isOptional: true,
      description: 'Media for back',
    }),
    audioUrl: field.string({
      isOptional: true,
      description: 'Audio pronunciation',
    }),

    // Classification
    tags: field.json({ isOptional: true, description: 'Card tags' }),
    difficulty: field.int({ default: 0, description: 'Card difficulty (0-5)' }),

    // Ordering
    order: field.int({ default: 0, description: 'Card order in deck' }),

    // Status
    isSuspended: field.boolean({
      default: false,
      description: 'Whether card is suspended',
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
    deck: field.belongsTo('Deck', ['deckId'], ['id'], { onDelete: 'Cascade' }),
    reviews: field.hasMany('CardReview'),
    schedules: field.hasMany('CardSchedule'),
  },
  indexes: [index.on(['deckId', 'order']), index.on(['isSuspended'])],
});

/**
 * CardReview entity - records individual reviews.
 */
export const CardReviewEntity = defineEntity({
  name: 'CardReview',
  description: 'A single review of a flashcard.',
  schema: 'lssm_learning',
  map: 'card_review',
  fields: {
    id: field.id({ description: 'Unique review identifier' }),
    learnerId: field.foreignKey({ description: 'Reviewer' }),
    cardId: field.foreignKey({ description: 'Reviewed card' }),

    // Review result
    rating: field.enum('CardRating', { description: 'Review rating' }),

    // Time tracking
    responseTimeMs: field.int({
      isOptional: true,
      description: 'Time to respond in ms',
    }),

    // SRS state before review
    intervalBefore: field.int({ description: 'Interval before review (days)' }),
    easeFactorBefore: field.decimal({
      description: 'Ease factor before review',
    }),

    // SRS state after review
    intervalAfter: field.int({ description: 'Interval after review (days)' }),
    easeFactorAfter: field.decimal({ description: 'Ease factor after review' }),

    // Review type
    reviewType: field.string({
      default: '"review"',
      description: 'Type: new, learning, review, relearning',
    }),

    // Timestamps
    reviewedAt: field.dateTime({ description: 'When reviewed' }),
    createdAt: field.createdAt(),

    // Relations
    learner: field.belongsTo('Learner', ['learnerId'], ['id'], {
      onDelete: 'Cascade',
    }),
    card: field.belongsTo('Card', ['cardId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [
    index.on(['learnerId', 'reviewedAt']),
    index.on(['cardId', 'reviewedAt']),
    index.on(['rating']),
  ],
  enums: [CardRatingEnum],
});

/**
 * CardSchedule entity - SRS scheduling per learner/card.
 */
export const CardScheduleEntity = defineEntity({
  name: 'CardSchedule',
  description: 'SRS schedule for a learner/card pair.',
  schema: 'lssm_learning',
  map: 'card_schedule',
  fields: {
    id: field.id({ description: 'Unique schedule identifier' }),
    learnerId: field.foreignKey({ description: 'Learner' }),
    cardId: field.foreignKey({ description: 'Card' }),

    // SRS state
    interval: field.int({
      default: 0,
      description: 'Current interval in days',
    }),
    easeFactor: field.decimal({
      default: 2.5,
      description: 'Ease factor (SM-2)',
    }),
    repetitions: field.int({
      default: 0,
      description: 'Number of successful repetitions',
    }),

    // Scheduling
    nextReviewAt: field.dateTime({ description: 'When next review is due' }),
    lastReviewAt: field.dateTime({
      isOptional: true,
      description: 'When last reviewed',
    }),

    // Learning state
    learningStep: field.int({
      default: 0,
      description: 'Current learning step',
    }),
    isGraduated: field.boolean({
      default: false,
      description: 'Whether card has graduated',
    }),
    isRelearning: field.boolean({
      default: false,
      description: 'Whether card is being relearned',
    }),

    // Stats
    lapses: field.int({
      default: 0,
      description: 'Number of times card was forgotten',
    }),
    reviewCount: field.int({ default: 0, description: 'Total review count' }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    learner: field.belongsTo('Learner', ['learnerId'], ['id'], {
      onDelete: 'Cascade',
    }),
    card: field.belongsTo('Card', ['cardId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [
    index.unique(['learnerId', 'cardId'], { name: 'card_schedule_unique' }),
    index.on(['learnerId', 'nextReviewAt']),
    index.on(['nextReviewAt']),
  ],
});

export const flashcardEntities = [
  DeckEntity,
  CardEntity,
  CardReviewEntity,
  CardScheduleEntity,
];

export const flashcardEnums = [CardRatingEnum];
