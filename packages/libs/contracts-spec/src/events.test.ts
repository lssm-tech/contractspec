import { describe, expect, it } from 'bun:test';
import {
  defineEvent,
  eventKey,
  EventRegistry,
  type EventSpec,
  type EventEnvelope,
} from './events';
import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

describe('defineEvent', () => {
  it('should return the event spec unchanged', () => {
    const inputSchema = new SchemaModel({
      name: 'TestPayload',
      fields: {
        message: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      },
    });

    const spec: EventSpec<typeof inputSchema> = {
      meta: {
        key: 'test.event',
        version: '1.0.0',
        description: 'A test event',
        stability: 'stable',
        owners: ['platform.core'],
        tags: ['test'],
      },
      payload: inputSchema,
    };

    const result = defineEvent(spec);

    expect(result).toBe(spec);
    expect(result.meta.key).toBe('test.event');
  });

  it('should preserve PII fields', () => {
    const inputSchema = new SchemaModel({
      name: 'UserPayload',
      fields: {
        email: { type: ScalarTypeEnum.EmailAddress(), isOptional: false },
      },
    });

    const spec = defineEvent({
      meta: {
        key: 'user.created',
        version: '1.0.0',
        description: 'User was created',
        stability: 'stable',
        owners: ['platform.core'],
        tags: ['users'],
      },
      pii: ['email'],
      payload: inputSchema,
    });

    expect(spec.pii).toEqual(['email']);
  });
});

describe('eventKey', () => {
  it('should generate correct event key format', () => {
    expect(eventKey('user.created', '1.0.0')).toBe('user.created.v1.0.0');
    expect(eventKey('order.completed', '2.0.0')).toBe('order.completed.v2.0.0');
    expect(eventKey('payment.processed', '10.0.0')).toBe(
      'payment.processed.v10.0.0'
    );
  });
});

describe('EventRegistry', () => {
  it('should create empty registry', () => {
    const registry = new EventRegistry();
    expect(registry.list()).toEqual([]);
  });

  it('should initialize with events', () => {
    const inputSchema = new SchemaModel({
      name: 'TestPayload',
      fields: {
        id: { type: ScalarTypeEnum.ID(), isOptional: false },
      },
    });

    const event1 = defineEvent({
      meta: {
        key: 'event.one',
        version: '1.0.0',
        description: 'First event',
        stability: 'stable',
        owners: ['platform.core'],
        tags: [],
      },
      payload: inputSchema,
    });

    const registry = new EventRegistry([event1]);
    expect(registry.list()).toHaveLength(1);
  });

  it('should register and retrieve events', () => {
    const registry = new EventRegistry();
    const inputSchema = new SchemaModel({
      name: 'Payload',
      fields: {
        data: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      },
    });

    const event = defineEvent({
      meta: {
        key: 'test.registered',
        version: '1.0.0',
        description: 'A registered event',
        stability: 'beta',
        owners: ['platform.core'],
        tags: ['test'],
      },
      payload: inputSchema,
    });

    registry.register(event);
    expect(registry.list()).toContain(event);
  });
});

describe('EventEnvelope type', () => {
  it('should properly type event envelope', () => {
    interface TestPayload {
      userId: string;
      action: string;
    }

    const envelope: EventEnvelope<TestPayload> = {
      id: 'evt_123',
      occurredAt: '2024-01-01T00:00:00Z',
      key: 'user.action',
      version: '1.0.0',
      payload: {
        userId: 'user_123',
        action: 'login',
      },
    };

    expect(envelope.id).toBe('evt_123');
    expect(envelope.key).toBe('user.action');
    expect(envelope.version).toBe('1.0.0');
    expect(envelope.payload.userId).toBe('user_123');
  });

  it('should support optional traceId', () => {
    const envelope: EventEnvelope<{ message: string }> = {
      id: 'evt_456',
      occurredAt: '2024-01-01T00:00:00Z',
      traceId: 'trace_abc',
      key: 'test.event',
      version: '1.0.0',
      payload: { message: 'hello' },
    };

    expect(envelope.traceId).toBe('trace_abc');
  });
});
