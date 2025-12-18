/**
 * XP (Experience Points) Engine
 *
 * Calculates XP rewards for various learning activities.
 */

// ============ Types ============

export type XPActivityType =
  | 'lesson_complete'
  | 'quiz_pass'
  | 'quiz_perfect'
  | 'flashcard_review'
  | 'course_complete'
  | 'module_complete'
  | 'streak_bonus'
  | 'achievement_unlock'
  | 'daily_goal_complete'
  | 'first_lesson'
  | 'onboarding_step'
  | 'onboarding_complete';

export interface XPCalculationInput {
  /** Type of activity */
  activity: XPActivityType;
  /** Base XP for the activity (from content config) */
  baseXp?: number;
  /** Score achieved (0-100) for scored activities */
  score?: number;
  /** Current streak (for streak bonuses) */
  currentStreak?: number;
  /** Time spent in seconds */
  timeSpent?: number;
  /** Attempt number (for quizzes) */
  attemptNumber?: number;
  /** Whether this is a retry */
  isRetry?: boolean;
}

export interface XPResult {
  /** Total XP earned */
  totalXp: number;
  /** Base XP before bonuses */
  baseXp: number;
  /** Breakdown of XP sources */
  breakdown: XPBreakdown[];
}

export interface XPBreakdown {
  /** Source of XP */
  source: string;
  /** XP amount */
  amount: number;
  /** Multiplier applied */
  multiplier?: number;
}

export interface XPConfig {
  /** Base XP values for each activity */
  baseValues: Record<XPActivityType, number>;
  /** Score thresholds for bonus XP */
  scoreThresholds: { min: number; multiplier: number }[];
  /** Streak bonus tiers */
  streakTiers: { days: number; bonus: number }[];
  /** Perfect score bonus multiplier */
  perfectScoreMultiplier: number;
  /** First attempt bonus */
  firstAttemptBonus: number;
  /** Retry penalty multiplier */
  retryPenalty: number;
  /** Speed bonus (complete under expected time) */
  speedBonusMultiplier: number;
  /** Speed bonus threshold (percentage of expected time) */
  speedBonusThreshold: number;
}

// ============ Default Configuration ============

export const DEFAULT_XP_CONFIG: XPConfig = {
  baseValues: {
    lesson_complete: 10,
    quiz_pass: 20,
    quiz_perfect: 50,
    flashcard_review: 1,
    course_complete: 200,
    module_complete: 50,
    streak_bonus: 5,
    achievement_unlock: 0, // XP comes from achievement
    daily_goal_complete: 15,
    first_lesson: 25,
    onboarding_step: 5,
    onboarding_complete: 50,
  },
  scoreThresholds: [
    { min: 90, multiplier: 1.5 },
    { min: 80, multiplier: 1.25 },
    { min: 70, multiplier: 1.0 },
    { min: 60, multiplier: 0.75 },
    { min: 0, multiplier: 0.5 },
  ],
  streakTiers: [
    { days: 365, bonus: 50 },
    { days: 180, bonus: 30 },
    { days: 90, bonus: 20 },
    { days: 30, bonus: 15 },
    { days: 14, bonus: 10 },
    { days: 7, bonus: 5 },
    { days: 3, bonus: 2 },
    { days: 1, bonus: 0 },
  ],
  perfectScoreMultiplier: 1.5,
  firstAttemptBonus: 10,
  retryPenalty: 0.5,
  speedBonusMultiplier: 1.2,
  speedBonusThreshold: 0.8,
};

// ============ XP Engine ============

export class XPEngine {
  private config: XPConfig;

  constructor(config: Partial<XPConfig> = {}) {
    this.config = {
      ...DEFAULT_XP_CONFIG,
      ...config,
      baseValues: { ...DEFAULT_XP_CONFIG.baseValues, ...config.baseValues },
      scoreThresholds:
        config.scoreThresholds || DEFAULT_XP_CONFIG.scoreThresholds,
      streakTiers: config.streakTiers || DEFAULT_XP_CONFIG.streakTiers,
    };
  }

  /**
   * Calculate XP for an activity.
   */
  calculate(input: XPCalculationInput): XPResult {
    const breakdown: XPBreakdown[] = [];

    // Get base XP
    const baseXp = input.baseXp ?? this.config.baseValues[input.activity];
    let totalXp = baseXp;

    breakdown.push({
      source: 'base',
      amount: baseXp,
    });

    // Apply score-based multiplier
    if (input.score !== undefined) {
      const scoreMultiplier = this.getScoreMultiplier(input.score);
      if (scoreMultiplier !== 1.0) {
        const scoreBonus = Math.round(baseXp * (scoreMultiplier - 1));
        totalXp += scoreBonus;
        breakdown.push({
          source: 'score_bonus',
          amount: scoreBonus,
          multiplier: scoreMultiplier,
        });
      }

      // Perfect score bonus
      if (input.score === 100) {
        const perfectBonus = Math.round(
          baseXp * (this.config.perfectScoreMultiplier - 1)
        );
        totalXp += perfectBonus;
        breakdown.push({
          source: 'perfect_score',
          amount: perfectBonus,
          multiplier: this.config.perfectScoreMultiplier,
        });
      }
    }

    // First attempt bonus
    if (input.attemptNumber === 1 && !input.isRetry) {
      totalXp += this.config.firstAttemptBonus;
      breakdown.push({
        source: 'first_attempt',
        amount: this.config.firstAttemptBonus,
      });
    }

    // Retry penalty
    if (input.isRetry) {
      const penalty = Math.round(totalXp * (1 - this.config.retryPenalty));
      totalXp -= penalty;
      breakdown.push({
        source: 'retry_penalty',
        amount: -penalty,
        multiplier: this.config.retryPenalty,
      });
    }

    // Streak bonus
    if (input.currentStreak && input.currentStreak > 0) {
      const streakBonus = this.getStreakBonus(input.currentStreak);
      if (streakBonus > 0) {
        totalXp += streakBonus;
        breakdown.push({
          source: 'streak_bonus',
          amount: streakBonus,
        });
      }
    }

    // Ensure XP is at least 1 (if base was > 0)
    if (baseXp > 0) {
      totalXp = Math.max(1, totalXp);
    }

    return {
      totalXp: Math.round(totalXp),
      baseXp,
      breakdown,
    };
  }

  /**
   * Calculate streak bonus XP.
   */
  calculateStreakBonus(currentStreak: number): XPResult {
    const bonus = this.getStreakBonus(currentStreak);
    return {
      totalXp: bonus,
      baseXp: bonus,
      breakdown: [
        {
          source: 'streak_bonus',
          amount: bonus,
        },
      ],
    };
  }

  /**
   * Calculate XP needed for a level.
   */
  getXpForLevel(level: number): number {
    // Exponential growth formula
    // Level 1: 0 XP
    // Level 2: 100 XP
    // Level 3: 300 XP
    // etc.
    if (level <= 1) return 0;
    return Math.round(100 * Math.pow(level - 1, 1.5));
  }

  /**
   * Get level from total XP.
   */
  getLevelFromXp(totalXp: number): {
    level: number;
    xpInLevel: number;
    xpForNextLevel: number;
  } {
    let level = 1;
    let xpRequired = this.getXpForLevel(level + 1);

    while (totalXp >= xpRequired && level < 1000) {
      level++;
      xpRequired = this.getXpForLevel(level + 1);
    }

    const xpForCurrentLevel = this.getXpForLevel(level);
    const xpForNextLevel = this.getXpForLevel(level + 1);

    return {
      level,
      xpInLevel: totalXp - xpForCurrentLevel,
      xpForNextLevel: xpForNextLevel - xpForCurrentLevel,
    };
  }

  // ============ Helpers ============

  private getScoreMultiplier(score: number): number {
    for (const threshold of this.config.scoreThresholds) {
      if (score >= threshold.min) {
        return threshold.multiplier;
      }
    }
    return 1.0;
  }

  private getStreakBonus(streak: number): number {
    for (const tier of this.config.streakTiers) {
      if (streak >= tier.days) {
        return tier.bonus;
      }
    }
    return 0;
  }
}

/**
 * Default XP engine instance.
 */
export const xpEngine = new XPEngine();


