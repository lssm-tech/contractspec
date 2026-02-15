import { describe, expect, it } from 'bun:test';
import { OperationSpecRegistry } from '../registry';
import {
  registerReportContracts,
  GetContractVerificationStatusQuery,
  ContractVerificationStatusModel,
  GetContractVerificationStatusInput,
  GetContractVerificationStatusOutput,
  ContractVerificationTableDataView,
} from './index';

describe('registerReportContracts', () => {
  it('should register query in OperationSpecRegistry', () => {
    const registry = new OperationSpecRegistry();
    registerReportContracts(registry);
    expect(registry.count()).toBe(1);
  });

  it('should return registry for chaining', () => {
    const registry = new OperationSpecRegistry();
    const result = registerReportContracts(registry);
    expect(result).toBe(registry);
  });

  it('should allow retrieval by key after registration', () => {
    const registry = new OperationSpecRegistry();
    registerReportContracts(registry);
    const spec = registry.get('report.getContractVerificationStatus', '1.0.0');
    expect(spec).toBeDefined();
    expect(spec?.meta.key).toBe('report.getContractVerificationStatus');
  });
});

describe('module exports', () => {
  it('should export GetContractVerificationStatusQuery', () => {
    expect(GetContractVerificationStatusQuery).toBeDefined();
  });

  it('should export ContractVerificationStatusModel', () => {
    expect(ContractVerificationStatusModel).toBeDefined();
  });

  it('should export GetContractVerificationStatusInput', () => {
    expect(GetContractVerificationStatusInput).toBeDefined();
  });

  it('should export GetContractVerificationStatusOutput', () => {
    expect(GetContractVerificationStatusOutput).toBeDefined();
  });

  it('should export ContractVerificationTableDataView', () => {
    expect(ContractVerificationTableDataView).toBeDefined();
  });
});
