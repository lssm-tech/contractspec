#!/usr/bin/env node
import mri from 'minimist';
import { runImport } from './commands/import.js';
import { runCheck } from './commands/check.js';
import { runGenerate } from './commands/generate.js';
import { runMigrate } from './commands/migrate.js';
import { runSeed } from './commands/seed.js';
import { runSchemaGenerate } from './commands/schema-generate.js';
import { runSchemaCompose } from './commands/schema-compose.js';

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
    case 'schema:generate':
      await runSchemaGenerate(argv);
      break;
    case 'schema:compose':
      await runSchemaCompose(argv);
      break;
    default:
      printUsage();
      process.exit(1);
  }
}

function printUsage() {
  console.log(`
Usage: database <command> [options]

Commands:
  import              Import schema from external sources
  check               Check Prisma schema validity
  generate            Generate Prisma client
  migrate:dev         Run migrations in development
  migrate:deploy      Deploy migrations to production
  migrate:status      Check migration status
  seed                Seed the database

Schema Generation (spec-first):
  schema:generate     Generate Prisma schema from entity specs
                      --config <path>   Schema config file (default: ./schema.config.ts)
                      --output <path>   Output path (default: ./prisma/schema/generated.prisma)
                      --module <id>     Generate only a specific module

  schema:compose      Compose multiple module schemas
                      --config <path>   Schema config file (default: ./schema.config.ts)
                      --output <path>   Output path (default: ./prisma/schema/composed.prisma)
                      --modules <list>  Comma-separated module IDs to include

Examples:
  database schema:generate --config ./schema.config.ts
  database schema:compose --modules "@lssm/lib.identity-rbac,@lssm/module.audit-trail"
  database generate
  database migrate:dev --name add_users_table
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
