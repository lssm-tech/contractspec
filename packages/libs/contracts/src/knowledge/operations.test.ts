import { describe, expect, it } from 'bun:test';
import { OperationSpecRegistry } from '../operations/registry';
import {
  CreateKnowledgeSource,
  DeleteKnowledgeSource,
  ListKnowledgeSources,
  registerKnowledgeContracts,
  TriggerKnowledgeSourceSync,
  UpdateKnowledgeSource,
} from './operations';

describe('knowledge contracts', () => {
  it('registers knowledge source management contracts', () => {
    const registry = registerKnowledgeContracts(new OperationSpecRegistry());

    expect(registry.get('knowledge.source.create', '1.0.0')).toBe(
      CreateKnowledgeSource
    );
    expect(registry.get('knowledge.source.update', '1.0.0')).toBe(
      UpdateKnowledgeSource
    );
    expect(registry.get('knowledge.source.delete', '1.0.0')).toBe(
      DeleteKnowledgeSource
    );
    expect(registry.get('knowledge.source.list', '1.0.0')).toBe(
      ListKnowledgeSources
    );
    expect(registry.get('knowledge.source.triggerSync', '1.0.0')).toBe(
      TriggerKnowledgeSourceSync
    );
  });
});
