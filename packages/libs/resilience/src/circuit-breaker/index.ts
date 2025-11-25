export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeoutMs: number;
  monitorIntervalMs?: number;
}

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failures = 0;
  private lastFailureTime?: number;
  private nextAttemptTime?: number;

  constructor(private readonly config: CircuitBreakerConfig) {}

  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      if (this.canAttemptReset()) {
        this.transitionTo('HALF_OPEN');
      } else {
        throw new Error('CircuitBreaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private isOpen(): boolean {
    return this.state === 'OPEN';
  }

  private canAttemptReset(): boolean {
    if (!this.nextAttemptTime) return false;
    return Date.now() >= this.nextAttemptTime;
  }

  private onSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      this.transitionTo('CLOSED');
    }
    this.failures = 0;
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (
      this.state === 'HALF_OPEN' ||
      this.failures >= this.config.failureThreshold
    ) {
      this.transitionTo('OPEN');
    }
  }

  private transitionTo(newState: CircuitState): void {
    this.state = newState;
    if (newState === 'OPEN') {
      this.nextAttemptTime = Date.now() + this.config.resetTimeoutMs;
    } else if (newState === 'CLOSED') {
      this.failures = 0;
      this.nextAttemptTime = undefined;
    }
  }
}







