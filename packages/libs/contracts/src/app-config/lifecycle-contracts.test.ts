import { describe, expect, it } from 'bun:test';

import { OperationSpecRegistry } from '../registry';
import {
  CreateTenantConfigDraftCommand,
  GetTenantConfigVersionQuery,
  ListTenantConfigVersionsQuery,
  PromoteTenantConfigToPreviewCommand,
  PublishTenantConfigCommand,
  registerAppConfigLifecycleContracts,
  RollbackTenantConfigCommand,
} from './lifecycle-contracts';

describe('app-config lifecycle contracts', () => {
  it('registers lifecycle management contracts', () => {
    const registry = registerAppConfigLifecycleContracts(
      new OperationSpecRegistry()
    );

    expect(registry.getSpec('appConfig.lifecycle.createDraft', 1)).toBe(
      CreateTenantConfigDraftCommand
    );

    expect(registry.getSpec('appConfig.lifecycle.promoteToPreview', 1)).toBe(
      PromoteTenantConfigToPreviewCommand
    );

    expect(registry.getSpec('appConfig.lifecycle.publish', 1)).toBe(
      PublishTenantConfigCommand
    );

    expect(registry.getSpec('appConfig.lifecycle.rollback', 1)).toBe(
      RollbackTenantConfigCommand
    );

    expect(registry.getSpec('appConfig.lifecycle.listVersions', 1)).toBe(
      ListTenantConfigVersionsQuery
    );

    expect(registry.getSpec('appConfig.lifecycle.getVersion', 1)).toBe(
      GetTenantConfigVersionQuery
    );
  });
});
