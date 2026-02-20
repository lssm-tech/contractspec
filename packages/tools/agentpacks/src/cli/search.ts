import chalk from 'chalk';
import { createRegistryClient } from '../utils/registry-client.js';
import { loadCredentials } from '../utils/credentials.js';

interface SearchOptions {
  tags?: string;
  targets?: string;
  sort?: string;
  limit?: string;
  verbose?: boolean;
}

/**
 * Search for packs in the registry.
 */
export async function runSearch(
  query: string,
  options: SearchOptions
): Promise<void> {
  const credentials = loadCredentials();
  const client = createRegistryClient({
    registryUrl: credentials.registryUrl,
    authToken: credentials.token,
  });

  try {
    const { packs, total } = await client.search({
      query,
      tags: options.tags?.split(','),
      targets: options.targets?.split(','),
      sort: options.sort as 'downloads' | 'updated' | 'name' | 'weekly',
      limit: options.limit ? Number(options.limit) : 20,
    });

    if (packs.length === 0) {
      console.log(chalk.dim('No packs found.'));
      return;
    }

    console.log(
      chalk.bold(
        `Found ${total} pack(s)${query ? ` matching "${query}"` : ''}:\n`
      )
    );

    for (const pack of packs) {
      const verified = pack.verified ? chalk.green(' [verified]') : '';
      const featured = pack.featured ? chalk.yellow(' [featured]') : '';
      console.log(`  ${chalk.bold(pack.name)}${verified}${featured}`);
      console.log(`    ${pack.description}`);
      console.log(
        chalk.dim(
          `    v${pack.latestVersion} | ${pack.downloads} downloads | by ${pack.author}`
        )
      );
      if (options.verbose && pack.tags.length > 0) {
        console.log(chalk.dim(`    tags: ${pack.tags.join(', ')}`));
      }
      console.log();
    }
  } catch (err) {
    console.log(
      chalk.red(
        `Search failed: ${err instanceof Error ? err.message : String(err)}`
      )
    );
    process.exit(1);
  }
}
