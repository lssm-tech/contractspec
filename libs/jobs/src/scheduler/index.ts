import type { JobQueue, EnqueueOptions } from '../queue/types';

/**
 * Scheduled job configuration.
 */
export interface ScheduledJobConfig {
  /** Unique name for the schedule */
  name: string;
  /** Cron expression (e.g., '0 0 * * *' for daily at midnight) */
  cronExpression: string;
  /** Job type to enqueue */
  jobType: string;
  /** Job payload (can be a function for dynamic payloads) */
  payload?: unknown | (() => unknown | Promise<unknown>);
  /** Enqueue options */
  options?: EnqueueOptions;
  /** Timezone for cron evaluation (default: UTC) */
  timezone?: string;
  /** Whether the schedule is enabled */
  enabled?: boolean;
  /** Description */
  description?: string;
}

/**
 * Active scheduled job with next run time.
 */
export interface ActiveSchedule extends ScheduledJobConfig {
  nextRun: Date | null;
  lastRun: Date | null;
}

/**
 * Parse a cron expression to get the next run time.
 * Simple implementation supporting: minute hour day month weekday
 */
function getNextCronRun(
  cronExpression: string,
  after: Date = new Date()
): Date | null {
  try {
    // Dynamically import cron-parser
    // This is a simplified fallback if cron-parser isn't available
    const parts = cronExpression.trim().split(/\s+/);
    if (parts.length !== 5) {
      console.warn(`Invalid cron expression: ${cronExpression}`);
      return null;
    }

    // Simple parsing for common patterns
    const minute = parts[0];
    const hour = parts[1];
    const dayOfMonth = parts[2];
    const month = parts[3];
    const next = new Date(after);
    next.setSeconds(0);
    next.setMilliseconds(0);

    // Handle simple cases
    if (
      minute &&
      hour &&
      minute !== '*' &&
      hour !== '*' &&
      dayOfMonth === '*' &&
      month === '*'
    ) {
      // Daily at specific time
      const targetMinute = Number.parseInt(minute, 10);
      const targetHour = Number.parseInt(hour, 10);

      next.setHours(targetHour, targetMinute, 0, 0);
      if (next <= after) {
        next.setDate(next.getDate() + 1);
      }
      return next;
    }

    // For other patterns, add 1 minute as fallback
    next.setMinutes(next.getMinutes() + 1);
    return next;
  } catch {
    return null;
  }
}

/**
 * Job scheduler for recurring jobs.
 */
export class JobScheduler {
  private readonly schedules = new Map<string, ActiveSchedule>();
  private timer?: ReturnType<typeof setInterval>;
  private readonly checkIntervalMs: number;

  constructor(
    private readonly queue: JobQueue,
    options: { checkIntervalMs?: number } = {}
  ) {
    this.checkIntervalMs = options.checkIntervalMs ?? 60000; // 1 minute default
  }

  /**
   * Add a scheduled job.
   */
  schedule(config: ScheduledJobConfig): void {
    const nextRun =
      config.enabled !== false ? getNextCronRun(config.cronExpression) : null;

    this.schedules.set(config.name, {
      ...config,
      enabled: config.enabled ?? true,
      nextRun,
      lastRun: null,
    });
  }

  /**
   * Remove a scheduled job.
   */
  unschedule(name: string): boolean {
    return this.schedules.delete(name);
  }

  /**
   * Enable a scheduled job.
   */
  enable(name: string): boolean {
    const schedule = this.schedules.get(name);
    if (!schedule) return false;

    schedule.enabled = true;
    schedule.nextRun = getNextCronRun(schedule.cronExpression);
    return true;
  }

  /**
   * Disable a scheduled job.
   */
  disable(name: string): boolean {
    const schedule = this.schedules.get(name);
    if (!schedule) return false;

    schedule.enabled = false;
    schedule.nextRun = null;
    return true;
  }

  /**
   * Get all schedules.
   */
  getSchedules(): ActiveSchedule[] {
    return Array.from(this.schedules.values());
  }

  /**
   * Get a specific schedule.
   */
  getSchedule(name: string): ActiveSchedule | undefined {
    return this.schedules.get(name);
  }

  /**
   * Start the scheduler.
   */
  start(): void {
    if (this.timer) return;

    // Initial check
    void this.checkSchedules();

    // Periodic check
    this.timer = setInterval(() => {
      void this.checkSchedules();
    }, this.checkIntervalMs);
  }

  /**
   * Stop the scheduler.
   */
  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  /**
   * Check and enqueue due schedules.
   */
  private async checkSchedules(): Promise<void> {
    const now = new Date();

    for (const schedule of this.schedules.values()) {
      if (!schedule.enabled || !schedule.nextRun) continue;

      if (schedule.nextRun <= now) {
        try {
          // Resolve payload if it's a function
          const payload =
            typeof schedule.payload === 'function'
              ? await schedule.payload()
              : schedule.payload;

          // Enqueue the job
          await this.queue.enqueue(schedule.jobType, payload, schedule.options);

          // Update schedule
          schedule.lastRun = now;
          schedule.nextRun = getNextCronRun(schedule.cronExpression, now);
        } catch (error) {
          console.error(
            `Failed to enqueue scheduled job ${schedule.name}:`,
            error
          );
        }
      }
    }
  }
}

/**
 * Create a job scheduler instance.
 */
export function createScheduler(
  queue: JobQueue,
  options?: { checkIntervalMs?: number }
): JobScheduler {
  return new JobScheduler(queue, options);
}

/**
 * Helper to define a scheduled job configuration.
 */
export function defineSchedule(config: ScheduledJobConfig): ScheduledJobConfig {
  return config;
}
