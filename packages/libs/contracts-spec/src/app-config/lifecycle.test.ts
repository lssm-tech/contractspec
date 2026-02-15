import { describe, expect, it } from 'bun:test';
import type {
  ConfigStatus,
  ConfigTransition,
  ConfigVersionHistory,
} from './lifecycle';

describe('ConfigStatus type', () => {
  it('should support all valid statuses', () => {
    const statuses: ConfigStatus[] = [
      'draft',
      'preview',
      'published',
      'archived',
      'superseded',
    ];

    expect(statuses).toHaveLength(5);
    expect(statuses).toContain('draft');
    expect(statuses).toContain('published');
  });
});

describe('ConfigTransition interface', () => {
  it('should define a valid transition', () => {
    const transition: ConfigTransition = {
      tenantId: 'tenant-123',
      appId: 'app-456',
      fromStatus: 'draft',
      toStatus: 'preview',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      actor: 'user@example.com',
    };

    expect(transition.fromStatus).toBe('draft');
    expect(transition.toStatus).toBe('preview');
    expect(transition.version).toBe('1.0.0');
  });

  it('should support Date timestamp', () => {
    const transition: ConfigTransition = {
      tenantId: 'tenant-123',
      appId: 'app-456',
      fromStatus: 'preview',
      toStatus: 'published',
      version: '1.0.0',
      timestamp: new Date(),
      actor: 'admin@example.com',
    };

    expect(transition.timestamp).toBeInstanceOf(Date);
  });

  it('should support optional reason', () => {
    const transition: ConfigTransition = {
      tenantId: 'tenant-123',
      appId: 'app-456',
      fromStatus: 'published',
      toStatus: 'archived',
      version: '1.0.0',
      timestamp: '2024-01-01T00:00:00Z',
      actor: 'admin@example.com',
      reason: 'Superseded by new version',
    };

    expect(transition.reason).toBe('Superseded by new version');
  });

  it('should allow rollback transitions', () => {
    const rollback: ConfigTransition = {
      tenantId: 'tenant-123',
      appId: 'app-456',
      fromStatus: 'published',
      toStatus: 'superseded',
      version: '1.0.0',
      timestamp: '2024-01-01T00:00:00Z',
      actor: 'admin@example.com',
      reason: 'Rolling back due to critical issue',
    };

    expect(rollback.fromStatus).toBe('published');
    expect(rollback.toStatus).toBe('superseded');
  });
});

describe('ConfigVersionHistory interface', () => {
  it('should track version history', () => {
    const history: ConfigVersionHistory = {
      tenantId: 'tenant-123',
      appId: 'app-456',
      versions: [],
      transitions: [],
    };

    expect(history.tenantId).toBe('tenant-123');
    expect(history.appId).toBe('app-456');
    expect(history.versions).toEqual([]);
    expect(history.transitions).toEqual([]);
  });

  it('should track current published version', () => {
    const history: ConfigVersionHistory = {
      tenantId: 'tenant-123',
      appId: 'app-456',
      versions: [],
      transitions: [],
      currentPublished: '3.0.0',
    };

    expect(history.currentPublished).toBe('3.0.0');
  });

  it('should allow undefined currentPublished for no published version', () => {
    const history: ConfigVersionHistory = {
      tenantId: 'tenant-123',
      appId: 'app-456',
      versions: [],
      transitions: [],
    };

    expect(history.currentPublished).toBeUndefined();
  });
});
