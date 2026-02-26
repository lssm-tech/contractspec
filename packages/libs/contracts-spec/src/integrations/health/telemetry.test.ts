import { describe, expect, it } from 'bun:test';
import { redactHealthTelemetryPayload } from './telemetry';

describe('redactHealthTelemetryPayload', () => {
  it('masks known PII keys recursively', () => {
    const payload = {
      email: 'user@example.com',
      metric: 'resting-heart-rate',
      nested: {
        notes: 'felt great',
      },
    };

    const redacted = redactHealthTelemetryPayload(payload);
    expect(redacted.email).not.toBe(payload.email);
    expect(redacted.nested.notes).not.toBe(payload.nested.notes);
    expect(redacted.metric).toBe(payload.metric);
  });
});
