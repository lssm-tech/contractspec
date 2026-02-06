import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { EvidenceChunk } from '@contractspec/lib.contracts/product-intent/types';

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));

export const DEFAULT_EVIDENCE_ROOT = path.join(MODULE_DIR, '../evidence');
export const DEFAULT_TRANSCRIPT_DIRS = ['interviews', 'tickets', 'public'];
export const DEFAULT_CHUNK_SIZE = 800;

export interface EvidenceLoadOptions {
  evidenceRoot?: string;
  transcriptDirs?: string[];
  chunkSize?: number;
}

/**
 * Remove YAML front matter from a file. Synthetic interview and ticket
 * files include a YAML header delimited by triple dashes.
 */
function stripYamlFrontMatter(contents: string): string {
  const start = contents.indexOf('---');
  if (start === -1) return contents;
  const end = contents.indexOf('---', start + 3);
  if (end === -1) return contents;
  return contents.slice(end + 3).trimStart();
}

/**
 * Split a transcript into fixed-size chunks.
 */
function chunkTranscript(
  fileId: string,
  text: string,
  chunkSize: number
): EvidenceChunk[] {
  const chunks: EvidenceChunk[] = [];
  const clean = text.trim();
  for (let offset = 0, idx = 0; offset < clean.length; idx += 1) {
    const slice = clean.slice(offset, offset + chunkSize);
    chunks.push({
      chunkId: `${fileId}#c_${String(idx).padStart(2, '0')}`,
      text: slice,
      meta: { source: fileId },
    });
    offset += chunkSize;
  }
  return chunks;
}

/**
 * Load all transcript files under the given directories and return
 * EvidenceChunk objects ready for prompt formatting.
 */
export function loadEvidenceChunks(
  options: EvidenceLoadOptions = {}
): EvidenceChunk[] {
  const evidenceRoot = options.evidenceRoot ?? DEFAULT_EVIDENCE_ROOT;
  const transcriptDirs = options.transcriptDirs ?? DEFAULT_TRANSCRIPT_DIRS;
  const chunkSize = options.chunkSize ?? DEFAULT_CHUNK_SIZE;

  const chunks: EvidenceChunk[] = [];
  for (const dir of transcriptDirs) {
    const fullDir = path.join(evidenceRoot, dir);
    if (!fs.existsSync(fullDir)) continue;
    for (const fileName of fs.readdirSync(fullDir)) {
      const ext = path.extname(fileName).toLowerCase();
      if (ext !== '.md') continue;
      const filePath = path.join(fullDir, fileName);
      const raw = fs.readFileSync(filePath, 'utf8');
      const withoutFrontMatter = stripYamlFrontMatter(raw);
      const baseId = path.parse(fileName).name;
      const fileChunks = chunkTranscript(baseId, withoutFrontMatter, chunkSize);
      chunks.push(...fileChunks);
    }
  }
  return chunks;
}
