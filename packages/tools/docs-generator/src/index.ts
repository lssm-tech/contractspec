#!/usr/bin/env node

import { Command } from 'commander';
import { generateDocs } from './generate';

const program = new Command();

program
  .name('contractspec-docs')
  .description('Generate documentation artifacts from ContractSpec specs')
  .version('1.0.0');

program
  .command('generate')
  .description('Generate docs index and content artifacts')
  .option(
    '--source <dir>',
    'Source directory for generated markdown',
    'generated/docs'
  )
  .option(
    '--out <dir>',
    'Output directory for generated artifacts',
    'packages/bundles/library/src/components/docs/generated'
  )
  .option(
    '--content-root <dir>',
    'Root directory for docs content (defaults to --source)'
  )
  .option(
    '--route-prefix <prefix>',
    'Route prefix for generated reference pages',
    '/docs/reference'
  )
  .option('--version <version>', 'Version label for generated docs output')
  .option('--no-docblocks', 'Skip DocBlocks registry entries')
  .action(async (options) => {
    const result = await generateDocs({
      sourceDir: options.source,
      outDir: options.out,
      contentRoot: options.contentRoot ?? options.source,
      includeDocblocks: Boolean(options.docblocks),
      routePrefix: options.routePrefix,
      version: options.version,
    });

    console.log('✅ Docs generated');
    console.log(`- Output: ${result.outputDir}`);
    console.log(`- Content root: ${result.contentRoot}`);
    console.log(`- Total entries: ${result.total}`);
    console.log(`- Contract docs: ${result.generated}`);
    console.log(`- DocBlocks: ${result.docblocks}`);
    if (result.version) {
      console.log(`- Version: ${result.version}`);
    }
  });

program.parseAsync();
