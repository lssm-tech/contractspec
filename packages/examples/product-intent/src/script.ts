import { formatEvidenceForModel } from '@contractspec/lib.product-intent-utils';
import { loadEvidenceChunks } from './load-evidence';

function main() {
  const evidenceChunks = loadEvidenceChunks();
  console.log(`Loaded ${evidenceChunks.length} evidence chunks`);

  const formatted = formatEvidenceForModel(evidenceChunks, 900);
  console.log('\nEvidence JSON:\n');
  console.log(formatted);
}

main();
