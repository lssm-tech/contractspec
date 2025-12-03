/**
 * Streak Tracking Engine
 *
 * Manages daily learning streaks with timezone support and freeze protection.
 */

// ============ Types ============

export interface StreakState {
  /** Current streak days */
  currentStreak: number;
  /** Longest streak ever */
  longestStreak: number;
  /** Last activity timestamp */
  lastActivityAt: Date | null;
  /** Last activity date (YYYY-MM-DD) */
  lastActivityDate: string | null;
  /** Available streak freezes */
  freezesRemaining: number;
  /** When a freeze was last used */
  freezeUsedAt: Date | null;
}

export interface StreakUpdateResult {
  /** Updated streak state */
  state: StreakState;
  /** Whether streak was maintained */
  streakMaintained: boolean;
  /** Whether streak was lost */
  streakLost: boolean;
  /** Whether a freeze was used */
  freezeUsed: boolean;
  /** Whether this activity started a new streak */
  newStreak: boolean;
  /** Days missed (if streak was lost) */
  daysMissed: number;
}

export interface StreakConfig {
  /** Timezone for the user */
  timezone: string;
  /** How many streak freezes to give per month */
  freezesPerMonth: number;
  /** Maximum freezes that can be accumulated */
  maxFreezes: number;
  /** Grace period in hours after midnight */
  gracePeriodHours: number;
}

// ============ Default Configuration ============

export const DEFAULT_STREAK_CONFIG: StreakConfig = {
  timezone: 'UTC',
  freezesPerMonth: 2,
  maxFreezes: 5,
  gracePeriodHours: 4, // 4 hours grace period
};

// ============ Streak Engine ============

export class StreakEngine {
  private config: StreakConfig;

  constructor(config: Partial<StreakConfig> = {}) {
    this.config = { ...DEFAULT_STREAK_CONFIG, ...config };
  }

  /**
   * Update streak based on new activity.
   */
  update(state: StreakState, now: Date = new Date()): StreakUpdateResult {
    const todayDate = this.getDateString(now);
    const result: StreakUpdateResult = {
      state: { ...state },
      streakMaintained: false,
      streakLost: false,
      freezeUsed: false,
      newStreak: false,
      daysMissed: 0,
    };

    // If no previous activity, start new streak
    if (!state.lastActivityDate) {
      result.state.currentStreak = 1;
      result.state.longestStreak = Math.max(1, state.longestStreak);
      result.state.lastActivityAt = now;
      result.state.lastActivityDate = todayDate;
      result.newStreak = true;
      result.streakMaintained = true;
      return result;
    }

    // Check if activity is on the same day
    if (state.lastActivityDate === todayDate) {
      // Same day - just update timestamp, streak unchanged
      result.state.lastActivityAt = now;
      result.streakMaintained = true;
      return result;
    }

    // Calculate days since last activity
    const daysSinceActivity = this.getDaysBetween(
      state.lastActivityDate,
      todayDate
    );

    if (daysSinceActivity === 1) {
      // Perfect - activity on consecutive day
      result.state.currentStreak = state.currentStreak + 1;
      result.state.longestStreak = Math.max(
        result.state.currentStreak,
        state.longestStreak
      );
      result.state.lastActivityAt = now;
      result.state.lastActivityDate = todayDate;
      result.streakMaintained = true;
      return result;
    }

    // Streak was potentially broken
    result.daysMissed = daysSinceActivity - 1;

    // Check if we can use freezes
    const freezesNeeded = result.daysMissed;
    if (freezesNeeded <= state.freezesRemaining) {
      // Use freezes to maintain streak
      result.state.freezesRemaining = state.freezesRemaining - freezesNeeded;
      result.state.freezeUsedAt = now;
      result.state.currentStreak = state.currentStreak + 1; // Add today
      result.state.longestStreak = Math.max(
        result.state.currentStreak,
        state.longestStreak
      );
      result.state.lastActivityAt = now;
      result.state.lastActivityDate = todayDate;
      result.freezeUsed = true;
      result.streakMaintained = true;
      return result;
    }

    // Streak is lost
    result.streakLost = true;
    result.state.currentStreak = 1; // Start new streak
    result.state.lastActivityAt = now;
    result.state.lastActivityDate = todayDate;
    result.newStreak = true;
    return result;
  }

  /**
   * Check streak status without recording activity.
   */
  checkStatus(
    state: StreakState,
    now: Date = new Date()
  ): {
    isActive: boolean;
    willExpireAt: Date | null;
    canUseFreeze: boolean;
    daysUntilExpiry: number;
  } {
    if (!state.lastActivityDate) {
      return {
        isActive: false,
        willExpireAt: null,
        canUseFreeze: false,
        daysUntilExpiry: 0,
      };
    }

    const todayDate = this.getDateString(now);
    const daysSinceActivity = this.getDaysBetween(
      state.lastActivityDate,
      todayDate
    );

    if (daysSinceActivity === 0) {
      // Activity today - streak is active
      const tomorrow = this.addDays(now, 1);
      tomorrow.setHours(23, 59, 59, 999);
      return {
        isActive: true,
        willExpireAt: tomorrow,
        canUseFreeze: state.freezesRemaining > 0,
        daysUntilExpiry: 1,
      };
    }

    if (daysSinceActivity === 1) {
      // No activity today yet, but still within window
      const endOfDay = new Date(now);
      endOfDay.setHours(23 + this.config.gracePeriodHours, 59, 59, 999);
      return {
        isActive: true,
        willExpireAt: endOfDay,
        canUseFreeze: state.freezesRemaining > 0,
        daysUntilExpiry: 0,
      };
    }

    // Streak would be broken
    const missedDays = daysSinceActivity - 1;
    return {
      isActive: missedDays <= state.freezesRemaining,
      willExpireAt: null,
      canUseFreeze: missedDays <= state.freezesRemaining,
      daysUntilExpiry: -missedDays,
    };
  }

  /**
   * Manually use a freeze to protect streak.
   */
  useFreeze(state: StreakState, now: Date = new Date()): StreakState | null {
    if (state.freezesRemaining <= 0) {
      return null;
    }

    return {
      ...state,
      freezesRemaining: state.freezesRemaining - 1,
      freezeUsedAt: now,
    };
  }

  /**
   * Award monthly freezes.
   */
  awardMonthlyFreezes(state: StreakState): StreakState {
    return {
      ...state,
      freezesRemaining: Math.min(
        state.freezesRemaining + this.config.freezesPerMonth,
        this.config.maxFreezes
      ),
    };
  }

  /**
   * Get initial streak state.
   */
  getInitialState(): StreakState {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityAt: null,
      lastActivityDate: null,
      freezesRemaining: this.config.freezesPerMonth,
      freezeUsedAt: null,
    };
  }

  /**
   * Calculate streak milestones.
   */
  getMilestones(currentStreak: number): {
    achieved: number[];
    next: number | null;
  } {
    const milestones = [3, 7, 14, 30, 60, 90, 180, 365, 500, 1000];
    const achieved = milestones.filter((m) => currentStreak >= m);
    const next = milestones.find((m) => currentStreak < m) ?? null;
    return { achieved, next };
  }

  // ============ Helpers ============

  /**
   * Get date string in YYYY-MM-DD format.
   */
  private getDateString(date: Date): string {
    // Simple implementation - for production, use a proper timezone library
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Get number of days between two date strings.
   */
  private getDaysBetween(dateStr1: string, dateStr2: string): number {
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);
    const diffTime = date2.getTime() - date1.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Add days to a date.
   */
  private addDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }
}

/**
 * Default streak engine instance.
 */
export const streakEngine = new StreakEngine();

