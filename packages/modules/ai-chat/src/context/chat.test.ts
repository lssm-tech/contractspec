import { describe, it, expect, mock } from 'bun:test';
import { ContextBuilder } from './context-builder';
import type { WorkspaceContext, SpecInfo, FileInfo } from './workspace-context';

const mockContext: WorkspaceContext = {
  getSpecs: mock(() => [
    {
      name: 'Spec1',
      path: '/path/to/spec1',
      type: 'operation',
      description: 'A test spec',
      tags: ['test'],
    },
    {
      name: 'Spec2',
      path: '/path/to/spec2',
      type: 'event',
      description: 'Another spec',
      tags: [],
    },
  ]) as unknown as () => SpecInfo[],
  getFiles: mock(() => [
    {
      name: 'file1.ts',
      path: '/path/to/file1.ts',
      relativePath: 'file1.ts',
      isSpec: false,
    },
    {
      name: 'spec1.ts',
      path: '/path/to/spec1.ts',
      relativePath: 'spec1.ts',
      isSpec: true,
    },
  ]) as unknown as () => FileInfo[],
  getSummary: mock(() => ({ name: 'TestWorkspace', type: 'monorepo' })),
  getContextSummary: mock(() => 'Workspace Summary'),
} as unknown as WorkspaceContext;

describe('ContextBuilder', () => {
  it('should build empty context if no options provided', () => {
    const builder = new ContextBuilder(mockContext);
    const context = builder.build({});
    expect(context.entries).toEqual([]);
    expect(context.summary).toBe('Workspace Summary');
  });

  it('should include explicitly requested specs', () => {
    const builder = new ContextBuilder(mockContext);
    const context = builder.build({ includeSpecs: ['Spec1'] });
    expect(context.entries).toHaveLength(1);
    expect(context.entries[0].type).toBe('spec');
    expect(context.entries[0].path).toBe('/path/to/spec1');
    expect(context.summary).toContain('Relevant Specs');
    expect(context.summary).toContain('Spec1');
  });

  it('should include explicitly requested files', () => {
    const builder = new ContextBuilder(mockContext);
    const context = builder.build({ includeFiles: ['/path/to/file1.ts'] });
    expect(context.entries).toHaveLength(1);
    expect(context.entries[0].type).toBe('file');
    expect(context.entries[0].path).toBe('/path/to/file1.ts');
    expect(context.summary).toContain('Relevant Files');
    expect(context.summary).toContain('file1.ts');
  });

  it('should score and include relevant specs based on query', () => {
    const builder = new ContextBuilder(mockContext);
    const context = builder.build({ query: 'test' });
    // Spec1 has "test" in description and tags
    expect(context.entries.length).toBeGreaterThan(0);
    const specEntry = context.entries.find(
      (e) => e.type === 'spec' && e.path === '/path/to/spec1'
    );
    expect(specEntry).toBeDefined();
    // Relevance should be > 0.2 threshold
    expect(specEntry?.relevance).toBeGreaterThan(0.2);
  });
});
