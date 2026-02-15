import { describe, expect, it } from 'bun:test';
import { ContractVerificationTableDataView } from './contractVerificationTable';

describe('ContractVerificationTableDataView', () => {
  describe('meta', () => {
    it('should have correct key', () => {
      expect(ContractVerificationTableDataView.meta.key).toBe(
        'report.contractVerificationTable'
      );
    });

    it('should have version 1.0.0', () => {
      expect(ContractVerificationTableDataView.meta.version).toBe('1.0.0');
    });

    it('should have entity contract-verification', () => {
      expect(ContractVerificationTableDataView.meta.entity).toBe(
        'contract-verification'
      );
    });

    it('should have experimental stability', () => {
      expect(ContractVerificationTableDataView.meta.stability).toBe(
        'experimental'
      );
    });
  });

  describe('source', () => {
    it('should reference getContractVerificationStatus query key', () => {
      expect(ContractVerificationTableDataView.source.primary.key).toBe(
        'report.getContractVerificationStatus'
      );
    });

    it('should reference query version 1.0.0', () => {
      expect(ContractVerificationTableDataView.source.primary.version).toBe(
        '1.0.0'
      );
    });
  });

  describe('view', () => {
    const { view } = ContractVerificationTableDataView;
    const fields = view.fields ?? [];

    it('should be table kind', () => {
      expect(view.kind).toBe('table');
    });

    it('should define exactly 5 fields', () => {
      expect(fields).toHaveLength(5);
    });

    it('should have correct field keys and labels', () => {
      expect(fields[0]?.key).toBe('name');
      expect(fields[0]?.label).toBe('Contract / Endpoint / Event');
      expect(fields[1]?.key).toBe('timeSinceVerified');
      expect(fields[1]?.label).toBe('Time since verified');
      expect(fields[2]?.key).toBe('driftMismatches');
      expect(fields[2]?.label).toBe('Drift debt');
      expect(fields[3]?.key).toBe('surfaces');
      expect(fields[3]?.label).toBe('Surfaces covered');
      expect(fields[4]?.key).toBe('lastVerifiedSha');
      expect(fields[4]?.label).toBe('Last verified commit');
    });

    it('should have correct dataPaths', () => {
      expect(fields[0]?.dataPath).toBe('name');
      expect(fields[1]?.dataPath).toBe('lastVerifiedDate');
      expect(fields[2]?.dataPath).toBe('driftMismatches');
      expect(fields[3]?.dataPath).toBe('surfaces');
      expect(fields[4]?.dataPath).toBe('lastVerifiedSha');
    });

    it('should make driftMismatches sortable', () => {
      const driftField = fields.find((f) => f.key === 'driftMismatches');
      expect(driftField).toBeDefined();
      expect(driftField?.sortable).toBe(true);
    });

    it('should format surfaces as badge and driftMismatches as number', () => {
      const surfacesField = fields.find((f) => f.key === 'surfaces');
      const driftField = fields.find((f) => f.key === 'driftMismatches');
      expect(surfacesField).toBeDefined();
      expect(driftField).toBeDefined();
      expect(surfacesField?.format).toBe('badge');
      expect(driftField?.format).toBe('number');
    });

    it('should set name as primaryField', () => {
      expect(view.primaryField).toBe('name');
    });

    it('should define exactly 5 columns', () => {
      const tableView = view as {
        columns?: { field: string; align?: string }[];
      };
      expect(tableView.columns).toHaveLength(5);
    });

    it('should align driftMismatches column to the right', () => {
      const tableView = view as {
        columns?: { field: string; align?: string }[];
      };
      const columns = tableView.columns ?? [];
      const driftCol = columns.find(
        (c: { field: string }) => c.field === 'driftMismatches'
      );
      expect(driftCol).toBeDefined();
      expect(driftCol?.align).toBe('right');
    });
  });
});
