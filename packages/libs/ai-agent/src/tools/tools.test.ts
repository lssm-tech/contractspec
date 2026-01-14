import { describe, it, expect, mock } from 'bun:test';
import { createKnowledgeQueryTool } from './knowledge-tool';
import type { KnowledgeRetriever } from '@contractspec/lib.knowledge/retriever';
import type { AgentKnowledgeRef } from '../spec/spec';

const mockRetriever: KnowledgeRetriever = {
  retrieve: mock(async () => [
    {
      content: 'Test content',
      score: 0.9,
      metadata: {},
      source: 'test-source',
    },
  ]),
  supportsSpace: mock(() => true),
  getStatic: mock(async () => null),
  listSpaces: mock(() => []),
};

describe('createKnowledgeQueryTool', () => {
  it('should return null if no optional knowledge spaces', () => {
    const knowledgeRefs: AgentKnowledgeRef[] = [
      { key: 'space1', required: true, instructions: 'Must know' },
    ];

    const tool = createKnowledgeQueryTool(mockRetriever, knowledgeRefs);
    expect(tool).toBeNull();
  });

  it('should create tool for optional knowledge spaces', () => {
    const knowledgeRefs: AgentKnowledgeRef[] = [
      { key: 'space1', required: false, instructions: 'Good to know' },
    ];

    const tool = createKnowledgeQueryTool(mockRetriever, knowledgeRefs);
    expect(tool).toBeDefined();
    // AI SDK tools are objects with execution logic
    expect(tool?.execute).toBeDefined();
  });

  it('should execute query correctly', async () => {
    const knowledgeRefs: AgentKnowledgeRef[] = [
      { key: 'space1', required: false, instructions: 'Good to know' },
    ];
    const tool = createKnowledgeQueryTool(mockRetriever, knowledgeRefs);

    if (!tool) throw new Error('Tool not created');

    if (!tool.execute) throw new Error('Tool execute missing');
    const result = await tool.execute(
      { query: 'test' },
      { toolCallId: '1', messages: [] }
    );
    // Expect formatted result
    expect(result).toContain('Test content');
    expect(result).toContain('space1');
  });
});
