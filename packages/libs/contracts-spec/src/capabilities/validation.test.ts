import { describe, expect, it } from 'bun:test';
import { validateCapabilityConsistency, findOrphanSpecs } from './validation';
import { CapabilityRegistry, type CapabilitySpec } from './capabilities';
import { OperationSpecRegistry } from '../operations/registry';
import { EventRegistry, type AnyEventSpec } from '../events';
import { PresentationRegistry } from '../presentations';
import type { AnyOperationSpec } from '../operations/operation';
import type { PresentationSpec } from '../presentations/presentations';
import { type Owner, StabilityEnum, type Tag } from '../ownership';
import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

// ─────────────────────────────────────────────────────────────────────────────
// Test Helpers
// ─────────────────────────────────────────────────────────────────────────────

const baseMeta = {
  title: 'Test' as const,
  description: 'Test description' as const,
  domain: 'test' as const,
  owners: ['@team.test'] as Owner[],
  tags: ['test'] as Tag[],
  stability: StabilityEnum.Experimental,
} as const;

function makeCapability(
  key: string,
  version: string,
  provides: CapabilitySpec['provides'] = []
): CapabilitySpec {
  return {
    meta: { ...baseMeta, key, version, kind: 'api' },
    provides,
  };
}

function makeOperation(
  key: string,
  version: string,
  capability?: { key: string; version: string }
): AnyOperationSpec {
  return {
    meta: {
      ...baseMeta,
      key,
      version,
      kind: 'command',
      goal: 'Test operation',
      context: 'Test context',
    },
    capability,
    io: {
      input: new SchemaModel({
        name: 'TestInput',
        fields: {
          id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        },
      }),
      output: new SchemaModel({
        name: 'TestOutput',
        fields: {
          success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
        },
      }),
    },
    policy: { auth: 'user' },
  };
}

function makeEvent(
  key: string,
  version: string,
  capability?: { key: string; version: string }
): AnyEventSpec {
  return {
    meta: { ...baseMeta, key, version },
    capability,
    payload: new SchemaModel({
      name: 'TestPayload',
      fields: {
        data: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      },
    }),
  };
}

function makePresentation(
  key: string,
  version: string,
  capability?: { key: string; version: string }
): PresentationSpec {
  return {
    meta: {
      ...baseMeta,
      key,
      version,
      goal: 'Test presentation',
      context: 'Test context',
    },
    capability,
    source: {
      type: 'component',
      framework: 'react',
      componentKey: 'TestComponent',
    },
    targets: ['react'],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('validateCapabilityConsistency', () => {
  it('passes for consistent capabilities and specs', () => {
    const capabilities = new CapabilityRegistry();
    const operations = new OperationSpecRegistry();

    capabilities.register(
      makeCapability('payments', '1.0.0', [
        { surface: 'operation', key: 'payments.charge' },
      ])
    );
    operations.register(
      makeOperation('payments.charge', '1.0.0', {
        key: 'payments',
        version: '1.0.0',
      })
    );

    const result = validateCapabilityConsistency({ capabilities, operations });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('detects missing surface spec (forward validation)', () => {
    const capabilities = new CapabilityRegistry();
    const operations = new OperationSpecRegistry();

    capabilities.register(
      makeCapability('payments', '1.0.0', [
        { surface: 'operation', key: 'payments.nonexistent' },
      ])
    );

    const result = validateCapabilityConsistency({ capabilities, operations });

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.type).toBe('missing_surface_spec');
    expect(result.errors[0]?.specKey).toBe('payments.nonexistent');
  });

  it('detects capability not found (reverse validation)', () => {
    const capabilities = new CapabilityRegistry();
    const operations = new OperationSpecRegistry();

    operations.register(
      makeOperation('payments.charge', '1.0.0', {
        key: 'nonexistent',
        version: '1.0.0',
      })
    );

    const result = validateCapabilityConsistency({ capabilities, operations });

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.type).toBe('capability_not_found');
  });

  it('detects surface not in capability provides', () => {
    const capabilities = new CapabilityRegistry();
    const operations = new OperationSpecRegistry();

    capabilities.register(makeCapability('payments', '1.0.0', [])); // No provides
    operations.register(
      makeOperation('payments.charge', '1.0.0', {
        key: 'payments',
        version: '1.0.0',
      })
    );

    const result = validateCapabilityConsistency({ capabilities, operations });

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.type).toBe('surface_not_in_provides');
  });

  it('validates events bidirectionally', () => {
    const capabilities = new CapabilityRegistry();
    const events = new EventRegistry();

    capabilities.register(
      makeCapability('payments', '1.0.0', [
        { surface: 'event', key: 'payments.completed' },
      ])
    );
    events.register(
      makeEvent('payments.completed', '1.0.0', {
        key: 'payments',
        version: '1.0.0',
      })
    );

    const result = validateCapabilityConsistency({ capabilities, events });

    expect(result.valid).toBe(true);
  });

  it('validates presentations bidirectionally', () => {
    const capabilities = new CapabilityRegistry();
    const presentations = new PresentationRegistry();

    capabilities.register(
      makeCapability('dashboard', '1.0.0', [
        { surface: 'presentation', key: 'dashboard.main' },
      ])
    );
    presentations.register(
      makePresentation('dashboard.main', '1.0.0', {
        key: 'dashboard',
        version: '1.0.0',
      })
    );

    const result = validateCapabilityConsistency({
      capabilities,
      presentations,
    });

    expect(result.valid).toBe(true);
  });

  it('passes validation when registries not provided', () => {
    const capabilities = new CapabilityRegistry();
    capabilities.register(
      makeCapability('payments', '1.0.0', [
        { surface: 'operation', key: 'payments.charge' },
      ])
    );

    // Without operations registry, forward validation passes (can't verify)
    const result = validateCapabilityConsistency({ capabilities });

    expect(result.valid).toBe(true);
  });
});

describe('findOrphanSpecs', () => {
  it('finds operations without capability assignment', () => {
    const capabilities = new CapabilityRegistry();
    const operations = new OperationSpecRegistry();

    operations.register(makeOperation('payments.charge', '1.0.0')); // No capability
    operations.register(
      makeOperation('auth.login', '1.0.0', { key: 'auth', version: '1.0.0' })
    );

    const orphans = findOrphanSpecs({ capabilities, operations });

    expect(orphans.operations).toContain('payments.charge');
    expect(orphans.operations).not.toContain('auth.login');
  });

  it('finds events without capability assignment', () => {
    const capabilities = new CapabilityRegistry();
    const events = new EventRegistry();

    events.register(makeEvent('user.created', '1.0.0')); // No capability

    const orphans = findOrphanSpecs({ capabilities, events });

    expect(orphans.events).toContain('user.created');
  });

  it('finds presentations without capability assignment', () => {
    const capabilities = new CapabilityRegistry();
    const presentations = new PresentationRegistry();

    presentations.register(makePresentation('dashboard.main', '1.0.0')); // No capability

    const orphans = findOrphanSpecs({ capabilities, presentations });

    expect(orphans.presentations).toContain('dashboard.main');
  });

  it('returns empty arrays when all specs have capabilities', () => {
    const capabilities = new CapabilityRegistry();
    const operations = new OperationSpecRegistry();

    capabilities.register(
      makeCapability('payments', '1.0.0', [
        { surface: 'operation', key: 'payments.charge' },
      ])
    );
    operations.register(
      makeOperation('payments.charge', '1.0.0', {
        key: 'payments',
        version: '1.0.0',
      })
    );

    const orphans = findOrphanSpecs({ capabilities, operations });

    expect(orphans.operations).toHaveLength(0);
  });
});
