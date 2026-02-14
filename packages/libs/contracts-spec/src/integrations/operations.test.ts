import { describe, expect, it } from 'bun:test';
import { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import {
  CreateIntegrationConnection,
  DeleteIntegrationConnection,
  ListIntegrationConnections,
  registerIntegrationContracts,
  TestIntegrationConnection,
  UpdateIntegrationConnection,
} from './operations';

describe('integration contracts', () => {
  it('registers integration connection management contracts', () => {
    const registry = registerIntegrationContracts(new OperationSpecRegistry());

    expect(registry.get('integrations.connection.create', '1.0.0')).toBe(
      CreateIntegrationConnection
    );
    expect(registry.get('integrations.connection.update', '1.0.0')).toBe(
      UpdateIntegrationConnection
    );
    expect(registry.get('integrations.connection.delete', '1.0.0')).toBe(
      DeleteIntegrationConnection
    );
    expect(registry.get('integrations.connection.list', '1.0.0')).toBe(
      ListIntegrationConnections
    );
    expect(registry.get('integrations.connection.test', '1.0.0')).toBe(
      TestIntegrationConnection
    );
  });
});
