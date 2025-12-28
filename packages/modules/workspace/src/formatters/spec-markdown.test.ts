/**
 * Unit tests for spec-markdown formatter.
 */

import { describe, expect, it } from 'vitest';
import {
  specToMarkdown,
  combineSpecMarkdowns,
  generateSpecsSummaryHeader,
} from './spec-markdown';
import type { ParsedSpec } from '../types/llm-types';

const mockOperationSpec: ParsedSpec = {
  meta: {
    key: 'billing.createInvoice',
    version: 1,
    description: 'Create a new invoice for a customer',
    stability: 'stable',
    owners: ['billing-team'],
    tags: ['billing', 'invoices'],
    goal: 'Generate invoices for customer orders',
    context: 'Part of the billing module for order processing',
  },
  specType: 'operation',
  kind: 'command',
  hasIo: true,
  hasPolicy: true,
  emittedEvents: [{ name: 'billing.invoiceCreated', version: 1 }],
  filePath: 'src/billing/create-invoice.ts',
};

const mockFeatureSpec: ParsedSpec = {
  meta: {
    key: 'billing',
    version: 1,
    description: 'Complete billing module for order processing',
    stability: 'stable',
    owners: ['billing-team'],
    tags: ['billing'],
  },
  specType: 'feature',
  operations: [
    { name: 'billing.createInvoice', version: 1 },
    { name: 'billing.getInvoice', version: 1 },
    { name: 'billing.listInvoices', version: 1 },
  ],
  events: [
    { name: 'billing.invoiceCreated', version: 1 },
    { name: 'billing.invoicePaid', version: 1 },
  ],
  presentations: [{ name: 'billing.invoiceList', version: 1 }],
};

const mockQuerySpec: ParsedSpec = {
  meta: {
    key: 'billing.getInvoice',
    version: 1,
    description: 'Retrieve an invoice by ID',
  },
  specType: 'operation',
  kind: 'query',
  hasIo: true,
};

describe('specToMarkdown', () => {
  describe('context format', () => {
    it('should format operation spec in context mode', () => {
      const result = specToMarkdown(mockOperationSpec, 'context');

      expect(result).toContain('# billing.createInvoice');
      expect(result).toContain('Create a new invoice for a customer');
      expect(result).toContain('**operation** (command)');
      expect(result).toContain('v1');
      expect(result).toContain('[stable]');
      expect(result).toContain('Includes: I/O, Policy, 1 event(s)');
    });

    it('should format feature spec in context mode', () => {
      const result = specToMarkdown(mockFeatureSpec, 'context');

      expect(result).toContain('# billing');
      expect(result).toContain('**feature**');
      expect(result).toContain(
        'Contains: 3 operation(s), 2 event(s), 1 presentation(s)'
      );
    });

    it('should format query spec in context mode', () => {
      const result = specToMarkdown(mockQuerySpec, 'context');

      expect(result).toContain('# billing.getInvoice');
      expect(result).toContain('(query)');
    });
  });

  describe('prompt format', () => {
    it('should format operation spec in prompt mode', () => {
      const result = specToMarkdown(mockOperationSpec, 'prompt');

      expect(result).toContain('# billing.createInvoice');
      expect(result).toContain('**Type**: operation (command)');
      expect(result).toContain('**Version**: 1');
      expect(result).toContain('**Stability**: stable');
      expect(result).toContain('**Owners**: billing-team');
      expect(result).toContain('**Tags**: billing, invoices');
      expect(result).toContain(
        '**Goal**: Generate invoices for customer orders'
      );
      expect(result).toContain('**Implementation Instructions**:');
      expect(result).toContain('Input validation per schema');
      expect(result).toContain('Output matches expected schema');
      expect(result).toContain('Policy rules are enforced');
      expect(result).toContain('Events are emitted on success');
    });

    it('should format feature spec in prompt mode', () => {
      const result = specToMarkdown(mockFeatureSpec, 'prompt');

      expect(result).toContain(
        '**Operations**: `billing.createInvoice`, `billing.getInvoice`, `billing.listInvoices`'
      );
      expect(result).toContain(
        '**Events**: `billing.invoiceCreated`, `billing.invoicePaid`'
      );
      expect(result).toContain('**Presentations**: `billing.invoiceList`');
      expect(result).toContain('Implement the `billing` feature including:');
      expect(result).toContain('- 3 operation(s)');
      expect(result).toContain('- 1 presentation(s)');
    });
  });

  describe('full format', () => {
    it('should format operation spec in full mode', () => {
      const result = specToMarkdown(mockOperationSpec, 'full');

      expect(result).toContain('## Metadata');
      expect(result).toContain('- **Type**: operation (command)');
      expect(result).toContain('- **Version**: 1');
      expect(result).toContain('- **Stability**: stable');
      expect(result).toContain('- **Owners**: billing-team');
      expect(result).toContain('- **File**: `src/billing/create-invoice.ts`');
      expect(result).toContain('## Goal');
      expect(result).toContain('Generate invoices for customer orders');
      expect(result).toContain('## Context');
      expect(result).toContain(
        'Part of the billing module for order processing'
      );
      expect(result).toContain('## Emitted Events');
      expect(result).toContain('- `billing.invoiceCreated` (v1)');
    });

    it('should include source block in full mode', () => {
      const specWithSource: ParsedSpec = {
        ...mockOperationSpec,
        sourceBlock: `defineCommand({
  meta: { key: 'billing.createInvoice', version: 1 },
  io: { input: CreateInvoiceInput, output: Invoice }
})`,
      };

      const result = specToMarkdown(specWithSource, 'full');

      expect(result).toContain('## Source Definition');
      expect(result).toContain('```typescript');
      expect(result).toContain('defineCommand({');
      expect(result).toContain('```');
    });

    it('should include feature sections in full mode', () => {
      const result = specToMarkdown(mockFeatureSpec, 'full');

      expect(result).toContain('## Operations (3)');
      expect(result).toContain('- `billing.createInvoice` (v1)');
      expect(result).toContain('## Events (2)');
      expect(result).toContain('- `billing.invoiceCreated` (v1)');
      expect(result).toContain('## Presentations (1)');
      expect(result).toContain('- `billing.invoiceList` (v1)');
    });
  });

  describe('depth handling', () => {
    it('should increase header level with depth', () => {
      const result0 = specToMarkdown(mockQuerySpec, 'context', 0);
      const result1 = specToMarkdown(mockQuerySpec, 'context', 1);
      const result2 = specToMarkdown(mockQuerySpec, 'context', 2);

      expect(result0).toContain('# billing.getInvoice');
      expect(result1).toContain('## billing.getInvoice');
      expect(result2).toContain('### billing.getInvoice');
    });

    it('should cap header level at 6', () => {
      const result = specToMarkdown(mockQuerySpec, 'context', 10);

      expect(result).toContain('###### billing.getInvoice');
    });
  });
});

describe('generateSpecsSummaryHeader', () => {
  it('should generate summary header for multiple specs', () => {
    const specs = [mockOperationSpec, mockFeatureSpec, mockQuerySpec];
    const result = generateSpecsSummaryHeader(specs, 'prompt');

    expect(result).toContain('# ContractSpec Export');
    expect(result).toContain('**Format**: prompt');
    expect(result).toContain('**Specs**: 3');
    expect(result).toContain('**Contents**:');
    expect(result).toContain('- 2 operation(s)');
    expect(result).toContain('- 1 feature(s)');
    expect(result).toContain('---');
  });
});

describe('combineSpecMarkdowns', () => {
  it('should combine multiple specs with header and separators', () => {
    const specs = [mockOperationSpec, mockQuerySpec];
    const result = combineSpecMarkdowns(specs, 'context');

    expect(result).toContain('# ContractSpec Export');
    expect(result).toContain('# billing.createInvoice');
    expect(result).toContain('---');
    expect(result).toContain('# billing.getInvoice');
  });
});
