/**
 * Example script demonstrating how to read a synthetic evidence
 * dataset and prepare it for the Product Intent discovery
 * workflow. This script loads transcripts from the bundled
 * evidence directory, slices them into evidence chunks and uses
 * the product‑intent utilities to format the chunks for
 * consumption by a language model.
 *
 * To run this example, execute the following from the repository root:
 *
 *   npx ts-node packages/example/product-intent-example/index.ts
 *
 * The script will output a JSON object containing the evidence
 * chunks ready to be embedded in a prompt via
 * `formatEvidenceForModel`. You can adjust the number of files
 * processed or the chunk size by modifying the constants below.
 */

import fs from 'fs';
import path from 'path';
import { formatEvidenceForModel } from '@contractspec/lib.product-intent-utils';
import type { EvidenceChunk } from '@contractspec/lib.contracts/product-intent/types';

// Directory containing the synthetic evidence dataset. This folder
// mirrors the structure of the `evidence_dataset.zip` archive. If
// it does not exist at runtime, the script will attempt to extract
// the ZIP from the repository root into this directory.
const EVIDENCE_ROOT = path.join(__dirname, 'evidence');

// Subdirectories containing transcripts to load. You can include
// tickets or public threads by adding their folder names here.
const TRANSCRIPT_DIRS = ['interviews', 'tickets', 'public'];

// Maximum number of characters per evidence chunk. Long transcripts
// are split into multiple chunks of roughly this length.
const CHUNK_SIZE = 800;

/**
 * Remove YAML front matter from a file. Synthetic interview and
 * ticket files include a YAML header delimited by triple dashes.
 * This helper strips the header and returns only the transcript.
 */
function stripYamlFrontMatter(contents: string): string {
  // Look for two '---' delimiters. If not found, return the original
  // contents. Otherwise remove everything up to the second delimiter.
  const start = contents.indexOf('---');
  if (start === -1) return contents;
  const end = contents.indexOf('---', start + 3);
  if (end === -1) return contents;
  return contents.slice(end + 3).trimStart();
}

/**
 * Split a transcript into fixed‑size chunks. Each chunk is
 * represented as an EvidenceChunk with a unique ID derived from
 * the file name and chunk index. Metadata can be attached here if
 * desired; for simplicity we record only the source file name.
 */
function chunkTranscript(
  fileId: string,
  text: string,
  chunkSize: number
): EvidenceChunk[] {
  const chunks: EvidenceChunk[] = [];
  // Trim whitespace at both ends to avoid leading/trailing blank
  // characters in the first/last chunk.
  const clean = text.trim();
  for (let offset = 0, idx = 0; offset < clean.length; idx++) {
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
 * Recursively load all transcript files under the given directories.
 * Returns an array of EvidenceChunk objects ready to be passed to
 * formatEvidenceForModel.
 */
function loadEvidence(): EvidenceChunk[] {
  const chunks: EvidenceChunk[] = [];
  for (const dir of TRANSCRIPT_DIRS) {
    const fullDir = path.join(EVIDENCE_ROOT, dir);
    if (!fs.existsSync(fullDir)) continue;
    for (const fileName of fs.readdirSync(fullDir)) {
      const ext = path.extname(fileName).toLowerCase();
      // Consider only markdown files; skip CSV analytics for this example.
      if (ext !== '.md') continue;
      const filePath = path.join(fullDir, fileName);
      const raw = fs.readFileSync(filePath, 'utf8');
      const withoutFrontMatter = stripYamlFrontMatter(raw);
      const baseId = path.parse(fileName).name;
      const fileChunks = chunkTranscript(
        baseId,
        withoutFrontMatter,
        CHUNK_SIZE
      );
      chunks.push(...fileChunks);
    }
  }
  return chunks;
}

function main() {
  const evidenceChunks = loadEvidence();
  console.log(`Loaded ${evidenceChunks.length} evidence chunks`);
  // Format for prompt injection. The helper truncates long chunks
  // automatically. You can adjust maxChars by passing a second
  // argument to formatEvidenceForModel.
  const formatted = formatEvidenceForModel(evidenceChunks, 900);
  console.log('\nEvidence JSON:\n');
  console.log(formatted);
}

main();
