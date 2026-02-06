import { describe, expect, it } from 'bun:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEvidenceChunks } from './load-evidence';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

describe('loadEvidenceChunks', () => {
  it('loads evidence chunks from the example dataset', () => {
    const evidenceRoot = path.join(moduleDir, '../evidence');
    const chunks = loadEvidenceChunks({ evidenceRoot, chunkSize: 2000 });

    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.some((chunk) => chunk.chunkId.startsWith('INT-'))).toBe(true);
  });
});
