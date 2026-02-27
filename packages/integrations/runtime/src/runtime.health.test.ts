import { describe, expect, it } from 'bun:test';
import {
  isUnofficialHealthProviderAllowed,
  resolveHealthStrategyOrder,
} from './runtime';

describe('health strategy helpers', () => {
  it('filters unofficial from default strategy order', () => {
    const order = resolveHealthStrategyOrder();
    expect(order.includes('unofficial')).toBe(false);
  });

  it('keeps unofficial when explicitly enabled', () => {
    const order = resolveHealthStrategyOrder({
      strategyOrder: ['unofficial', 'aggregator-api'],
      allowUnofficial: true,
    });
    expect(order[0]).toBe('unofficial');
  });

  it('honors unofficial allow-list by provider key', () => {
    expect(
      isUnofficialHealthProviderAllowed('health.peloton', {
        allowUnofficial: true,
        unofficialAllowList: ['health.peloton'],
      })
    ).toBe(true);
    expect(
      isUnofficialHealthProviderAllowed('health.fitbit', {
        allowUnofficial: true,
        unofficialAllowList: ['health.peloton'],
      })
    ).toBe(false);
  });
});
