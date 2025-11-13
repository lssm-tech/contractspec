import { describe, expect, it } from 'vitest';
import { SpecRegistry } from '../registry';
import {
  CreateKnowledgeSource,
  DeleteKnowledgeSource,
  ListKnowledgeSources,
  TriggerKnowledgeSourceSync,
  UpdateKnowledgeSource,
  registerKnowledgeContracts,
} from './contracts';

describe('knowledge contracts', () => {
  it('registers knowledge source management contracts', () => {
    const registry = registerKnowledgeContracts(new SpecRegistry());

    expect(
      registry.getSpec('knowledge.source.create', 1)
    ).toBe(CreateKnowledgeSource);
    expect(
      registry.getSpec('knowledge.source.update', 1)
    ).toBe(UpdateKnowledgeSource);
    expect(
      registry.getSpec('knowledge.source.delete', 1)
    ).toBe(DeleteKnowledgeSource);
    expect(
      registry.getSpec('knowledge.source.list', 1)
    ).toBe(ListKnowledgeSources);
    expect(
      registry.getSpec('knowledge.source.triggerSync', 1)
    ).toBe(TriggerKnowledgeSourceSync);
  });
});

