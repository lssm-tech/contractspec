import type { Timer as ITimer } from './types';

export class Timer implements ITimer {
  readonly id: string;
  private startTime: number;
  private laps: { label?: string; time: number; elapsed: number }[] = [];
  private stopped = false;
  private stopTime?: number;

  constructor(id?: string) {
    this.id = id || crypto.randomUUID();
    this.startTime = performance.now();
  }

  /**
   * Stop the timer and return elapsed time in milliseconds
   */
  stop(): number {
    if (this.stopped) {
      return this.getElapsed();
    }

    this.stopTime = performance.now();
    this.stopped = true;
    const elapsed = this.stopTime - this.startTime;

    this.laps.push({
      label: 'stop',
      time: this.stopTime,
      elapsed,
    });

    return elapsed;
  }

  /**
   * Record a lap time and return elapsed time since start
   */
  lap(label?: string): number {
    if (this.stopped) {
      return this.getElapsed();
    }

    const now = performance.now();
    const elapsed = now - this.startTime;

    this.laps.push({
      label: label || `lap-${this.laps.length + 1}`,
      time: now,
      elapsed,
    });

    return elapsed;
  }

  /**
   * Get elapsed time without stopping the timer
   */
  getElapsed(): number {
    if (this.stopped && this.stopTime) {
      return this.stopTime - this.startTime;
    }
    return performance.now() - this.startTime;
  }

  /**
   * Get all recorded laps
   */
  getLaps(): { label?: string; time: number; elapsed: number }[] {
    return [...this.laps];
  }

  /**
   * Get timer summary with total time and laps
   */
  getSummary(): {
    id: string;
    totalTime: number;
    isRunning: boolean;
    laps: { label?: string; time: number; elapsed: number }[];
  } {
    return {
      id: this.id,
      totalTime: this.getElapsed(),
      isRunning: !this.stopped,
      laps: this.getLaps(),
    };
  }

  /**
   * Reset the timer (starts a new timing session)
   */
  reset(): void {
    this.startTime = performance.now();
    this.laps = [];
    this.stopped = false;
    this.stopTime = undefined;
  }
}

/**
 * Utility class for managing multiple timers
 */
export class TimerManager {
  private timers = new Map<string, Timer>();

  /**
   * Start a new timer
   */
  start(id?: string): Timer {
    const timer = new Timer(id);
    this.timers.set(timer.id, timer);
    return timer;
  }

  /**
   * Get an existing timer
   */
  get(id: string): Timer | undefined {
    return this.timers.get(id);
  }

  /**
   * Stop and remove a timer
   */
  stop(id: string): number | undefined {
    const timer = this.timers.get(id);
    if (timer) {
      const elapsed = timer.stop();
      this.timers.delete(id);
      return elapsed;
    }
    return undefined;
  }

  /**
   * Get all active timers
   */
  getActive(): Timer[] {
    return Array.from(this.timers.values()).filter(
      (timer) => !timer.getSummary().isRunning === false
    );
  }

  /**
   * Clear all timers
   */
  clear(): void {
    this.timers.clear();
  }

  /**
   * Get summary of all timers
   */
  getSummary(): ReturnType<Timer['getSummary']>[] {
    return Array.from(this.timers.values()).map((timer) => timer.getSummary());
  }
}

/**
 * Decorator/wrapper function to time async operations
 */
export async function timed<T>(
  operation: () => Promise<T>,
  options?: { id?: string; onComplete?: (elapsed: number) => void }
): Promise<{ result: T; elapsed: number; timer: Timer }> {
  const timer = new Timer(options?.id);

  try {
    const result = await operation();
    const elapsed = timer.stop();

    options?.onComplete?.(elapsed);

    return { result, elapsed, timer };
  } catch (error) {
    timer.stop();
    throw error;
  }
}

/**
 * Decorator/wrapper function to time synchronous operations
 */
export function timedSync<T>(
  operation: () => T,
  options?: { id?: string; onComplete?: (elapsed: number) => void }
): { result: T; elapsed: number; timer: Timer } {
  const timer = new Timer(options?.id);

  try {
    const result = operation();
    const elapsed = timer.stop();

    options?.onComplete?.(elapsed);

    return { result, elapsed, timer };
  } catch (error) {
    timer.stop();
    throw error;
  }
}
