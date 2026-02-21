/**
 * In-memory token bucket rate limiter.
 *
 * Uses a sliding window approach per client IP.
 * Configurable via environment variables:
 *   RATE_LIMIT_GENERAL  — requests per minute for read endpoints (default 100)
 *   RATE_LIMIT_PUBLISH  — requests per minute for write endpoints (default 10)
 *   RATE_LIMIT_WINDOW   — window size in seconds (default 60)
 */

/** Per-client bucket state. */
interface Bucket {
  tokens: number;
  lastRefill: number;
}

/** Rate limit tier configuration. */
export interface RateLimitConfig {
  /** Max requests per window. */
  maxRequests: number;
  /** Window size in milliseconds. */
  windowMs: number;
}

/** Rate limit check result. */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

/**
 * In-memory rate limiter using the token bucket algorithm.
 * Each key (typically client IP) gets its own bucket.
 */
export class RateLimiter {
  private buckets = new Map<string, Bucket>();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(private config: RateLimitConfig) {
    // Periodic cleanup of stale buckets (every 5 minutes)
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /** Check if a request is allowed and consume a token. */
  check(key: string): RateLimitResult {
    const now = Date.now();
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = { tokens: this.config.maxRequests, lastRefill: now };
      this.buckets.set(key, bucket);
    }

    // Refill tokens based on elapsed time
    const elapsed = now - bucket.lastRefill;
    const refillRate = this.config.maxRequests / this.config.windowMs;
    const refilled = elapsed * refillRate;
    bucket.tokens = Math.min(this.config.maxRequests, bucket.tokens + refilled);
    bucket.lastRefill = now;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return {
        allowed: true,
        remaining: Math.floor(bucket.tokens),
        retryAfterMs: 0,
      };
    }

    // Calculate when next token will be available
    const deficit = 1 - bucket.tokens;
    const retryAfterMs = Math.ceil(deficit / refillRate);

    return {
      allowed: false,
      remaining: 0,
      retryAfterMs,
    };
  }

  /** Reset a specific key (for testing). */
  reset(key: string): void {
    this.buckets.delete(key);
  }

  /** Clear all buckets (for testing). */
  clear(): void {
    this.buckets.clear();
  }

  /** Remove stale buckets older than 2x window. */
  private cleanup(): void {
    const cutoff = Date.now() - this.config.windowMs * 2;
    for (const [key, bucket] of this.buckets) {
      if (bucket.lastRefill < cutoff) {
        this.buckets.delete(key);
      }
    }
  }

  /** Stop the cleanup interval (for graceful shutdown / testing). */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

/** Default rate limit tiers from environment. */
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW ?? 60) * 1000;

export const generalLimiter = new RateLimiter({
  maxRequests: Number(process.env.RATE_LIMIT_GENERAL ?? 100),
  windowMs: WINDOW_MS,
});

export const publishLimiter = new RateLimiter({
  maxRequests: Number(process.env.RATE_LIMIT_PUBLISH ?? 10),
  windowMs: WINDOW_MS,
});

/**
 * Extract client IP from request headers.
 * Checks X-Forwarded-For, X-Real-IP, then falls back to "unknown".
 */
export function getClientIp(
  headers: Record<string, string | undefined>
): string {
  const forwarded = headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0]!.trim();
  }
  return headers['x-real-ip'] ?? 'unknown';
}

/**
 * Apply rate limit check and return 429 headers if blocked.
 * Returns null if allowed, or a response body if rate-limited.
 *
 * Uses a generic set type to be compatible with Elysia's context
 * (where status can be a number or string literal).
 */
export function checkRateLimit(
  limiter: RateLimiter,
  key: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: { status?: any; headers: Record<string, string | number> }
): { error: string; retryAfter: number } | null {
  const result = limiter.check(key);

  // Always set rate limit headers
  set.headers['X-RateLimit-Remaining'] = String(result.remaining);

  if (!result.allowed) {
    const retryAfterSec = Math.ceil(result.retryAfterMs / 1000);
    set.status = 429;
    set.headers['Retry-After'] = String(retryAfterSec);
    return {
      error: 'Too many requests. Please try again later.',
      retryAfter: retryAfterSec,
    };
  }

  return null;
}
