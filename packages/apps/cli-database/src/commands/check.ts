import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { type ImportLock } from '../lib/types.js';

function sha256(content: string) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

export async function runCheck(argv: any) {
  const target = (argv.target as string) || process.cwd();
  const lockPath = path.join(
    target,
    'prisma',
    'schema',
    'imported',
    'imported.lock.json'
  );
  if (!fs.existsSync(lockPath)) {
    console.error('No imported.lock.json found. Run: database import');
    process.exit(1);
  }
  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8')) as ImportLock;
  let ok = true;
  for (const e of lock.entries) {
    if (!fs.existsSync(e.sourcePath)) {
      console.error(`Missing source: ${e.sourcePath}`);
      ok = false;
      continue;
    }
    const raw = fs.readFileSync(e.sourcePath, 'utf8');
    const digest = sha256(raw);
    if (digest !== e.sha256) {
      console.error(`Drift detected for ${e.moduleName} (${e.sourcePath})`);
      ok = false;
    }
  }
  if (!ok) {
    process.exit(2);
  }
  console.log('Imported schemas are in sync with lock.');
}
