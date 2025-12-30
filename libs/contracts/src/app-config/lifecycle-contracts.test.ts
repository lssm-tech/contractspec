import { describe, expect, it } from 'bun:test';

import { OperationSpecRegistry } from '../operations/registry';
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

    expect(registry.get('appConfig.lifecycle.createDraft', '1.0.0')).toBe(
      CreateTenantConfigDraftCommand
    );

    expect(registry.get('appConfig.lifecycle.promoteToPreview', '1.0.0')).toBe(
      PromoteTenantConfigToPreviewCommand
    );

    expect(registry.get('appConfig.lifecycle.publish', '1.0.0')).toBe(
      PublishTenantConfigCommand
    );

    expect(registry.get('appConfig.lifecycle.rollback', '1.0.0')).toBe(
      RollbackTenantConfigCommand
    );

    expect(registry.get('appConfig.lifecycle.listVersions', '1.0.0')).toBe(
      ListTenantConfigVersionsQuery
    );

    expect(registry.get('appConfig.lifecycle.getVersion', '1.0.0')).toBe(
      GetTenantConfigVersionQuery
    );
  });
});
