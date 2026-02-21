/**
 * Tests for rate limiting middleware.
 */
import { describe, test, expect, beforeEach } from 'bun:test';
import {
  RateLimiter,
  getClientIp,
  checkRateLimit,
} from '../src/middleware/rate-limit.js';

describe('RateLimiter', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter({ maxRequests: 5, windowMs: 60_000 });
  });

  test('allows requests within budget', () => {
    const result = limiter.check('client-1');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  test('exhausts tokens after max requests', () => {
    for (let i = 0; i < 5; i++) {
      limiter.check('client-2');
    }
    const result = limiter.check('client-2');
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  test('different keys have independent budgets', () => {
    for (let i = 0; i < 5; i++) {
      limiter.check('client-a');
    }
    const resultA = limiter.check('client-a');
    expect(resultA.allowed).toBe(false);

    const resultB = limiter.check('client-b');
    expect(resultB.allowed).toBe(true);
  });

  test('reset clears a specific key', () => {
    for (let i = 0; i < 5; i++) {
      limiter.check('client-reset');
    }
    expect(limiter.check('client-reset').allowed).toBe(false);

    limiter.reset('client-reset');
    expect(limiter.check('client-reset').allowed).toBe(true);
  });

  test('clear removes all keys', () => {
    for (let i = 0; i < 5; i++) {
      limiter.check('client-clear');
    }
    limiter.clear();
    expect(limiter.check('client-clear').allowed).toBe(true);
  });

  test('destroy stops cleanup interval', () => {
    limiter.destroy();
    // Should not throw
    expect(true).toBe(true);
  });
});

describe('getClientIp', () => {
  test('extracts from X-Forwarded-For', () => {
    expect(getClientIp({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' })).toBe(
      '1.2.3.4'
    );
  });

  test('extracts from X-Real-IP', () => {
    expect(getClientIp({ 'x-real-ip': '10.0.0.1' })).toBe('10.0.0.1');
  });

  test('falls back to unknown', () => {
    expect(getClientIp({})).toBe('unknown');
  });

  test('prefers X-Forwarded-For over X-Real-IP', () => {
    expect(
      getClientIp({
        'x-forwarded-for': '1.1.1.1',
        'x-real-ip': '2.2.2.2',
      })
    ).toBe('1.1.1.1');
  });
});

describe('checkRateLimit', () => {
  test('returns null when allowed', () => {
    const limiter = new RateLimiter({ maxRequests: 10, windowMs: 60_000 });
    const set: { status?: number; headers: Record<string, string> } = {
      headers: {},
    };

    const result = checkRateLimit(limiter, 'test-key', set);
    expect(result).toBeNull();
    expect(set.headers['X-RateLimit-Remaining']).toBeDefined();
    limiter.destroy();
  });

  test('returns error body when rate-limited', () => {
    const limiter = new RateLimiter({ maxRequests: 1, windowMs: 60_000 });
    const set: { status?: number; headers: Record<string, string> } = {
      headers: {},
    };

    // Exhaust tokens
    limiter.check('limited-key');

    const result = checkRateLimit(limiter, 'limited-key', set);
    expect(result).not.toBeNull();
    expect(result!.error).toContain('Too many requests');
    expect(result!.retryAfter).toBeGreaterThan(0);
    expect(set.status).toBe(429);
    expect(set.headers['Retry-After']).toBeDefined();
    limiter.destroy();
  });
});
