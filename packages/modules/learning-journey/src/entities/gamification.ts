import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';

/**
 * Achievement type enum.
 */
export const AchievementTypeEnum = defineEntityEnum({
  name: 'AchievementType',
  values: ['MILESTONE', 'STREAK', 'SKILL', 'SOCIAL', 'SPECIAL', 'SEASONAL'] as const,
  schema: 'lssm_learning',
  description: 'Type of achievement.',
});

/**
 * Leaderboard period enum.
 */
export const LeaderboardPeriodEnum = defineEntityEnum({
  name: 'LeaderboardPeriod',
  values: ['DAILY', 'WEEKLY', 'MONTHLY', 'ALL_TIME'] as const,
  schema: 'lssm_learning',
  description: 'Leaderboard time period.',
});

/**
 * Achievement entity - defines an achievement.
 */
export const AchievementEntity = defineEntity({
  name: 'Achievement',
  description: 'An achievement that can be unlocked.',
  schema: 'lssm_learning',
  map: 'achievement',
  fields: {
    id: field.id({ description: 'Unique achievement identifier' }),
    
    // Basic info
    key: field.string({ isUnique: true, description: 'Achievement key' }),
    name: field.string({ description: 'Achievement name' }),
    description: field.string({ description: 'Achievement description' }),
    
    // Display
    icon: field.string({ isOptional: true, description: 'Icon name or URL' }),
    color: field.string({ isOptional: true, description: 'Display color' }),
    badgeUrl: field.string({ isOptional: true, description: 'Badge image URL' }),
    
    // Classification
    type: field.enum('AchievementType', { default: 'MILESTONE', description: 'Achievement type' }),
    category: field.string({ isOptional: true, description: 'Achievement category' }),
    rarity: field.string({ default: '"common"', description: 'Rarity: common, rare, epic, legendary' }),
    
    // Rewards
    xpReward: field.int({ default: 50, description: 'XP awarded' }),
    
    // Conditions (JSON DSL for checking)
    condition: field.json({ description: 'Unlock condition' }),
    
    // Ordering
    order: field.int({ default: 0, description: 'Display order' }),
    
    // Status
    isHidden: field.boolean({ default: false, description: 'Hide until unlocked' }),
    isActive: field.boolean({ default: true, description: 'Whether achievement is active' }),
    
    // Organization scope
    orgId: field.string({ isOptional: true, description: 'Organization scope' }),
    
    // Metadata
    metadata: field.json({ isOptional: true, description: 'Additional metadata' }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    learnerAchievements: field.hasMany('LearnerAchievement'),
  },
  indexes: [
    index.on(['type']),
    index.on(['category']),
    index.on(['isActive']),
    index.on(['orgId']),
  ],
  enums: [AchievementTypeEnum],
});

/**
 * LearnerAchievement entity - unlocked achievements.
 */
export const LearnerAchievementEntity = defineEntity({
  name: 'LearnerAchievement',
  description: 'An achievement unlocked by a learner.',
  schema: 'lssm_learning',
  map: 'learner_achievement',
  fields: {
    id: field.id({ description: 'Unique record identifier' }),
    learnerId: field.foreignKey({ description: 'Learner' }),
    achievementId: field.foreignKey({ description: 'Achievement' }),
    
    // XP
    xpEarned: field.int({ default: 0, description: 'XP earned' }),
    
    // Progress (for multi-stage achievements)
    progress: field.int({ default: 100, description: 'Progress percentage' }),
    currentValue: field.int({ isOptional: true, description: 'Current value towards goal' }),
    targetValue: field.int({ isOptional: true, description: 'Target value for completion' }),
    
    // Timestamps
    unlockedAt: field.dateTime({ description: 'When unlocked' }),
    createdAt: field.createdAt(),
    
    // Relations
    learner: field.belongsTo('Learner', ['learnerId'], ['id'], { onDelete: 'Cascade' }),
    achievement: field.belongsTo('Achievement', ['achievementId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [
    index.unique(['learnerId', 'achievementId'], { name: 'learner_achievement_unique' }),
    index.on(['learnerId', 'unlockedAt']),
    index.on(['achievementId']),
  ],
});

/**
 * Streak entity - tracks daily learning streaks.
 */
export const StreakEntity = defineEntity({
  name: 'Streak',
  description: 'Tracks daily learning streaks.',
  schema: 'lssm_learning',
  map: 'streak',
  fields: {
    id: field.id({ description: 'Unique streak identifier' }),
    learnerId: field.foreignKey({ description: 'Learner' }),
    
    // Streak data
    currentStreak: field.int({ default: 0, description: 'Current streak days' }),
    longestStreak: field.int({ default: 0, description: 'Longest streak ever' }),
    
    // Activity tracking
    lastActivityAt: field.dateTime({ isOptional: true, description: 'Last learning activity' }),
    lastActivityDate: field.string({ isOptional: true, description: 'Last activity date (YYYY-MM-DD)' }),
    
    // Streak protection
    freezesRemaining: field.int({ default: 0, description: 'Streak freezes available' }),
    freezeUsedAt: field.dateTime({ isOptional: true, description: 'When last freeze was used' }),
    
    // History
    streakHistory: field.json({ isOptional: true, description: 'Historical streak data' }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    learner: field.belongsTo('Learner', ['learnerId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [
    index.unique(['learnerId'], { name: 'streak_learner_unique' }),
    index.on(['currentStreak']),
    index.on(['longestStreak']),
  ],
});

/**
 * DailyGoal entity - tracks daily XP goals.
 */
export const DailyGoalEntity = defineEntity({
  name: 'DailyGoal',
  description: 'Daily XP goal tracking.',
  schema: 'lssm_learning',
  map: 'daily_goal',
  fields: {
    id: field.id({ description: 'Unique goal identifier' }),
    learnerId: field.foreignKey({ description: 'Learner' }),
    
    // Date
    date: field.string({ description: 'Date (YYYY-MM-DD)' }),
    
    // Goal
    targetXp: field.int({ description: 'Target XP for the day' }),
    currentXp: field.int({ default: 0, description: 'XP earned today' }),
    
    // Status
    isCompleted: field.boolean({ default: false, description: 'Whether goal was met' }),
    completedAt: field.dateTime({ isOptional: true, description: 'When goal was completed' }),
    
    // Breakdown
    xpBreakdown: field.json({ isOptional: true, description: 'XP sources breakdown' }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    learner: field.belongsTo('Learner', ['learnerId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [
    index.unique(['learnerId', 'date'], { name: 'daily_goal_unique' }),
    index.on(['date', 'isCompleted']),
  ],
});

/**
 * LeaderboardEntry entity - leaderboard rankings.
 */
export const LeaderboardEntryEntity = defineEntity({
  name: 'LeaderboardEntry',
  description: 'Leaderboard entry for a learner.',
  schema: 'lssm_learning',
  map: 'leaderboard_entry',
  fields: {
    id: field.id({ description: 'Unique entry identifier' }),
    learnerId: field.foreignKey({ description: 'Learner' }),
    
    // Period
    periodType: field.enum('LeaderboardPeriod', { description: 'Period type' }),
    periodKey: field.string({ description: 'Period key (e.g., 2024-W01)' }),
    
    // Stats
    xp: field.int({ default: 0, description: 'XP earned in period' }),
    rank: field.int({ isOptional: true, description: 'Rank in leaderboard' }),
    
    // Breakdown
    lessonsCompleted: field.int({ default: 0, description: 'Lessons completed' }),
    quizzesPassed: field.int({ default: 0, description: 'Quizzes passed' }),
    cardsReviewed: field.int({ default: 0, description: 'Cards reviewed' }),
    streakDays: field.int({ default: 0, description: 'Streak days in period' }),
    
    // League (optional grouping)
    league: field.string({ isOptional: true, description: 'League tier' }),
    
    // Organization scope
    orgId: field.string({ isOptional: true, description: 'Organization scope' }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    learner: field.belongsTo('Learner', ['learnerId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [
    index.unique(['learnerId', 'periodType', 'periodKey'], { name: 'leaderboard_entry_unique' }),
    index.on(['periodType', 'periodKey', 'xp']),
    index.on(['orgId', 'periodType', 'periodKey', 'xp']),
  ],
  enums: [LeaderboardPeriodEnum],
});

/**
 * Heart entity - lives system (optional).
 */
export const HeartEntity = defineEntity({
  name: 'Heart',
  description: 'Lives/hearts system for quiz attempts.',
  schema: 'lssm_learning',
  map: 'heart',
  fields: {
    id: field.id({ description: 'Unique heart record identifier' }),
    learnerId: field.foreignKey({ description: 'Learner' }),
    
    // Hearts
    current: field.int({ default: 5, description: 'Current hearts' }),
    max: field.int({ default: 5, description: 'Maximum hearts' }),
    
    // Refill
    lastRefillAt: field.dateTime({ isOptional: true, description: 'Last refill time' }),
    nextRefillAt: field.dateTime({ isOptional: true, description: 'Next refill time' }),
    
    // Settings
    refillIntervalMinutes: field.int({ default: 240, description: 'Minutes between refills' }),
    infiniteUntil: field.dateTime({ isOptional: true, description: 'Infinite hearts until' }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    learner: field.belongsTo('Learner', ['learnerId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [
    index.unique(['learnerId'], { name: 'heart_learner_unique' }),
    index.on(['nextRefillAt']),
  ],
});

/**
 * XPTransaction entity - XP earning history.
 */
export const XPTransactionEntity = defineEntity({
  name: 'XPTransaction',
  description: 'Record of XP earned or spent.',
  schema: 'lssm_learning',
  map: 'xp_transaction',
  fields: {
    id: field.id({ description: 'Unique transaction identifier' }),
    learnerId: field.foreignKey({ description: 'Learner' }),
    
    // Transaction
    amount: field.int({ description: 'XP amount (positive = earned, negative = spent)' }),
    type: field.string({ description: 'Transaction type (lesson, quiz, streak, achievement, etc.)' }),
    
    // Source
    sourceType: field.string({ isOptional: true, description: 'Source entity type' }),
    sourceId: field.string({ isOptional: true, description: 'Source entity ID' }),
    
    // Description
    description: field.string({ isOptional: true, description: 'Human-readable description' }),
    
    // Balance
    balanceAfter: field.int({ description: 'Total XP after transaction' }),
    
    // Timestamps
    createdAt: field.createdAt(),
    
    // Relations
    learner: field.belongsTo('Learner', ['learnerId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [
    index.on(['learnerId', 'createdAt']),
    index.on(['type']),
    index.on(['sourceType', 'sourceId']),
  ],
});

export const gamificationEntities = [
  AchievementEntity,
  LearnerAchievementEntity,
  StreakEntity,
  DailyGoalEntity,
  LeaderboardEntryEntity,
  HeartEntity,
  XPTransactionEntity,
];

export const gamificationEnums = [
  AchievementTypeEnum,
  LeaderboardPeriodEnum,
];

