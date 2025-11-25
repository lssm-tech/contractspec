import { describe, expect, it } from 'bun:test';
import { evaluateExpression } from './expression';

describe('evaluateExpression', () => {
  const ctx = {
    data: {
      status: 'approved',
      count: 3,
      pending: false,
    },
    input: { value: 'ok' },
    output: { success: true },
  };

  it('compares equality on data', () => {
    expect(evaluateExpression(`data.status === "approved"`, ctx)).toBe(true);
    expect(evaluateExpression(`data.status === "rejected"`, ctx)).toBe(false);
  });

  it('handles numeric comparisons and conjunctions', () => {
    expect(evaluateExpression('data.count > 2 && data.count < 5', ctx)).toBe(
      true
    );
    expect(evaluateExpression('data.count >= 4 && data.count < 5', ctx)).toBe(
      false
    );
  });

  it('supports negation', () => {
    expect(evaluateExpression('!data.pending', ctx)).toBe(true);
    expect(evaluateExpression('!!data.pending', ctx)).toBe(false);
  });

  it('reads from input and output contexts', () => {
    expect(evaluateExpression(`input.value === "ok"`, ctx)).toBe(true);
    expect(evaluateExpression(`output.success === true`, ctx)).toBe(true);
  });

  it('defaults to truthy evaluation when no comparator is provided', () => {
    expect(evaluateExpression('data.status', ctx)).toBe(true);
    expect(evaluateExpression('data.missing', ctx)).toBe(false);
  });
});
