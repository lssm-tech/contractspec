#!/usr/bin/env node
import mri from 'minimist';
import { runImport } from './commands/import.js';
import { runCheck } from './commands/check.js';
import { runGenerate } from './commands/generate.js';
import { runMigrate } from './commands/migrate.js';
import { runSeed } from './commands/seed.js';

async function main() {
  const argv = mri(process.argv.slice(2));
  const [cmd] = argv._ as string[];

  switch (cmd) {
    case 'import':
      await runImport(argv);
      break;
    case 'check':
      await runCheck(argv);
      break;
    case 'generate':
      await runGenerate(argv);
      break;
    case 'migrate:dev':
    case 'migrate:deploy':
    case 'migrate:status':
      await runMigrate(cmd, argv);
      break;
    case 'seed':
      await runSeed(argv);
      break;
    default:
      console.error(
        'Usage: database <import|check|generate|migrate:dev|migrate:deploy|migrate:status|seed>'
      );
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
