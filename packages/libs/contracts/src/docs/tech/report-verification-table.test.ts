import { describe, expect, it } from 'bun:test';
import { defaultDocRegistry } from '../registry';

// Side-effect import triggers registration
import './report-verification-table.docblock';

describe('report-verification-table DocBlock', () => {
  const docId = 'docs.tech.report-verification-table';

  it('should register without errors', () => {
    const entry = defaultDocRegistry.get(docId);
    expect(entry).toBeDefined();
  });

  it('should be retrievable by id from defaultDocRegistry', () => {
    const entry = defaultDocRegistry.get(docId);
    expect(entry).toBeDefined();
    expect(entry?.block.id).toBe(docId);
  });

  it("should have kind 'how'", () => {
    const entry = defaultDocRegistry.get(docId);
    expect(entry).toBeDefined();
    expect(entry?.block.kind).toBe('how');
  });

  it("should have visibility 'public'", () => {
    const entry = defaultDocRegistry.get(docId);
    expect(entry).toBeDefined();
    expect(entry?.block.visibility).toBe('public');
  });

  it('should have stable route /docs/tech/report/verification-table', () => {
    const entry = defaultDocRegistry.get(docId);
    expect(entry).toBeDefined();
    expect(entry?.block.route).toBe('/docs/tech/report/verification-table');
  });
});
