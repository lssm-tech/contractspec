/**
 * Spaced Repetition System (SRS) Engine
 *
 * Implements the SM-2 algorithm variant for optimal flashcard scheduling.
 *
 * The algorithm calculates the optimal time to review a card based on:
 * - User's rating of recall difficulty (again, hard, good, easy)
 * - Current interval between reviews
 * - Ease factor (how easy the card is for this user)
 * - Number of successful repetitions
 */

// ============ Types ============

export type CardRating = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';

export interface SRSState {
  /** Current interval in days */
  interval: number;
  /** Ease factor (typically 1.3 to 2.5+) */
  easeFactor: number;
  /** Number of successful repetitions */
  repetitions: number;
  /** Current learning step (for new cards) */
  learningStep: number;
  /** Whether card has graduated to review phase */
  isGraduated: boolean;
  /** Whether card is being relearned after a lapse */
  isRelearning: boolean;
  /** Number of times card was forgotten */
  lapses: number;
}

export interface ReviewResult {
  /** New interval in days */
  interval: number;
  /** New ease factor */
  easeFactor: number;
  /** New repetition count */
  repetitions: number;
  /** Next review date */
  nextReviewAt: Date;
  /** New learning step */
  learningStep: number;
  /** Whether card has graduated */
  isGraduated: boolean;
  /** Whether card is being relearned */
  isRelearning: boolean;
  /** Updated lapse count */
  lapses: number;
}

export interface SRSConfig {
  /** Learning steps in minutes [1, 10] = 1 min, 10 min */
  learningSteps: number[];
  /** Graduating interval in days */
  graduatingInterval: number;
  /** Easy interval (for easy button on new cards) */
  easyInterval: number;
  /** Relearning steps in minutes */
  relearningSteps: number[];
  /** Minimum ease factor */
  minEaseFactor: number;
  /** Maximum interval in days */
  maxInterval: number;
  /** Interval modifier (1.0 = 100%) */
  intervalModifier: number;
  /** New cards interval modifier */
  newIntervalModifier: number;
  /** Hard interval modifier */
  hardIntervalModifier: number;
  /** Easy bonus modifier */
  easyBonus: number;
}

// ============ Default Configuration ============

export const DEFAULT_SRS_CONFIG: SRSConfig = {
  learningSteps: [1, 10], // 1 minute, 10 minutes
  graduatingInterval: 1, // 1 day
  easyInterval: 4, // 4 days
  relearningSteps: [10], // 10 minutes
  minEaseFactor: 1.3,
  maxInterval: 365, // 1 year
  intervalModifier: 1.0,
  newIntervalModifier: 0.5,
  hardIntervalModifier: 1.2,
  easyBonus: 1.3,
};

// ============ SRS Engine ============

export class SRSEngine {
  private config: SRSConfig;

  constructor(config: Partial<SRSConfig> = {}) {
    this.config = { ...DEFAULT_SRS_CONFIG, ...config };
  }

  /**
   * Calculate the next review state based on rating.
   */
  calculateNextReview(
    state: SRSState,
    rating: CardRating,
    now: Date = new Date()
  ): ReviewResult {
    // Handle new/learning cards
    if (!state.isGraduated && !state.isRelearning) {
      return this.handleLearningCard(state, rating, now);
    }

    // Handle relearning cards
    if (state.isRelearning) {
      return this.handleRelearningCard(state, rating, now);
    }

    // Handle graduated cards in review
    return this.handleReviewCard(state, rating, now);
  }

  /**
   * Handle learning phase (new cards).
   */
  private handleLearningCard(
    state: SRSState,
    rating: CardRating,
    now: Date
  ): ReviewResult {
    const steps = this.config.learningSteps;
    let newStep = state.learningStep;
    let isGraduated = false;
    let interval = 0;
    let nextReviewAt: Date;

    switch (rating) {
      case 'AGAIN':
        // Reset to first step
        newStep = 0;
        interval = steps[0] ?? 1;
        nextReviewAt = this.addMinutes(now, interval);
        break;

      case 'HARD':
        // Stay at current step (or repeat first step)
        interval = steps[newStep] ?? steps[0] ?? 1;
        nextReviewAt = this.addMinutes(now, interval);
        break;

      case 'GOOD':
        // Move to next step
        newStep++;
        if (newStep >= steps.length) {
          // Graduate the card
          isGraduated = true;
          interval = this.config.graduatingInterval;
          nextReviewAt = this.addDays(now, interval);
        } else {
          interval = steps[newStep] ?? 10;
          nextReviewAt = this.addMinutes(now, interval);
        }
        break;

      case 'EASY':
        // Graduate immediately with easy interval
        isGraduated = true;
        interval = this.config.easyInterval;
        nextReviewAt = this.addDays(now, interval);
        break;
    }

    return {
      interval: isGraduated ? interval : 0,
      easeFactor: state.easeFactor,
      repetitions: isGraduated ? 1 : 0,
      nextReviewAt,
      learningStep: newStep,
      isGraduated,
      isRelearning: false,
      lapses: state.lapses,
    };
  }

  /**
   * Handle relearning phase (lapsed cards).
   */
  private handleRelearningCard(
    state: SRSState,
    rating: CardRating,
    now: Date
  ): ReviewResult {
    const steps = this.config.relearningSteps;
    let newStep = state.learningStep;
    let isRelearning = true;
    let interval = 0;
    let nextReviewAt: Date;

    switch (rating) {
      case 'AGAIN':
        // Reset to first relearning step
        newStep = 0;
        interval = steps[0] ?? 10;
        nextReviewAt = this.addMinutes(now, interval);
        break;

      case 'HARD':
        // Stay at current step
        interval = steps[newStep] ?? steps[0] ?? 10;
        nextReviewAt = this.addMinutes(now, interval);
        break;

      case 'GOOD':
        // Move to next step or graduate back to review
        newStep++;
        if (newStep >= steps.length) {
          isRelearning = false;
          // Use reduced interval after lapse
          interval = Math.max(
            1,
            Math.floor(state.interval * this.config.newIntervalModifier)
          );
          nextReviewAt = this.addDays(now, interval);
        } else {
          interval = steps[newStep] ?? 10;
          nextReviewAt = this.addMinutes(now, interval);
        }
        break;

      case 'EASY':
        // Graduate immediately with slightly longer interval
        isRelearning = false;
        interval = Math.max(
          1,
          Math.floor(state.interval * this.config.newIntervalModifier * 1.5)
        );
        nextReviewAt = this.addDays(now, interval);
        break;
    }

    return {
      interval: isRelearning ? state.interval : interval,
      easeFactor: state.easeFactor,
      repetitions: isRelearning ? state.repetitions : state.repetitions + 1,
      nextReviewAt,
      learningStep: newStep,
      isGraduated: true,
      isRelearning,
      lapses: state.lapses,
    };
  }

  /**
   * Handle review phase (graduated cards).
   */
  private handleReviewCard(
    state: SRSState,
    rating: CardRating,
    now: Date
  ): ReviewResult {
    let newInterval: number;
    let newEaseFactor = state.easeFactor;
    let repetitions = state.repetitions;
    let isRelearning = false;
    let learningStep = 0;
    let lapses = state.lapses;

    switch (rating) {
      case 'AGAIN':
        // Card lapsed - move to relearning
        lapses++;
        isRelearning = true;
        learningStep = 0;
        newEaseFactor = Math.max(
          this.config.minEaseFactor,
          newEaseFactor - 0.2
        );
        newInterval = state.interval; // Keep old interval for reference
        const relearnStep = this.config.relearningSteps[0] ?? 10;
        return {
          interval: newInterval,
          easeFactor: newEaseFactor,
          repetitions,
          nextReviewAt: this.addMinutes(now, relearnStep),
          learningStep,
          isGraduated: true,
          isRelearning: true,
          lapses,
        };

      case 'HARD':
        // Reduce interval slightly, reduce ease
        newEaseFactor = Math.max(
          this.config.minEaseFactor,
          newEaseFactor - 0.15
        );
        newInterval = Math.max(
          state.interval + 1,
          state.interval * this.config.hardIntervalModifier
        );
        break;

      case 'GOOD':
        // Standard interval increase
        newInterval =
          state.interval * newEaseFactor * this.config.intervalModifier;
        repetitions++;
        break;

      case 'EASY':
        // Larger interval increase, increase ease
        newEaseFactor = newEaseFactor + 0.15;
        newInterval =
          state.interval *
          newEaseFactor *
          this.config.easyBonus *
          this.config.intervalModifier;
        repetitions++;
        break;
    }

    // Apply bounds
    newInterval = Math.min(Math.round(newInterval), this.config.maxInterval);
    newInterval = Math.max(1, newInterval);

    return {
      interval: newInterval,
      easeFactor: newEaseFactor,
      repetitions,
      nextReviewAt: this.addDays(now, newInterval),
      learningStep,
      isGraduated: true,
      isRelearning,
      lapses,
    };
  }

  /**
   * Get initial SRS state for a new card.
   */
  getInitialState(): SRSState {
    return {
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
      learningStep: 0,
      isGraduated: false,
      isRelearning: false,
      lapses: 0,
    };
  }

  /**
   * Check if a card is due for review.
   */
  isDue(nextReviewAt: Date, now: Date = new Date()): boolean {
    return nextReviewAt <= now;
  }

  /**
   * Calculate overdue days (negative if not yet due).
   */
  getOverdueDays(nextReviewAt: Date, now: Date = new Date()): number {
    const diff = now.getTime() - nextReviewAt.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  // ============ Helpers ============

  private addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60 * 1000);
  }

  private addDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }
}

/**
 * Default SRS engine instance.
 */
export const srsEngine = new SRSEngine();

