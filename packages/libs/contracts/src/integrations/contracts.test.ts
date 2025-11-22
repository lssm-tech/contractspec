import { describe, expect, it } from 'vitest';
import { SpecRegistry } from '../registry';
import {
  CreateIntegrationConnection,
  DeleteIntegrationConnection,
  ListIntegrationConnections,
  TestIntegrationConnection,
  UpdateIntegrationConnection,
  registerIntegrationContracts,
} from './contracts';

describe('integration contracts', () => {
  it('registers integration connection management contracts', () => {
    const registry = registerIntegrationContracts(new SpecRegistry());

    expect(registry.getSpec('integrations.connection.create', 1)).toBe(
      CreateIntegrationConnection
    );
    expect(registry.getSpec('integrations.connection.update', 1)).toBe(
      UpdateIntegrationConnection
    );
    expect(registry.getSpec('integrations.connection.delete', 1)).toBe(
      DeleteIntegrationConnection
    );
    expect(registry.getSpec('integrations.connection.list', 1)).toBe(
      ListIntegrationConnections
    );
    expect(registry.getSpec('integrations.connection.test', 1)).toBe(
      TestIntegrationConnection
    );
  });
});
