import { Command } from 'commander';
import chalk from 'chalk';
import {
  createNodeAdapters,
  listSpecs,
} from '@lssm/bundle.contractspec-workspace';
import { getErrorMessage } from '../../utils/errors';
import { loadSpecModule, pickSpecExport } from '../../utils/spec-load';

interface ListJsonRow {
  file: string;
  type: string;
  key?: string;
  description?: string;
  stability?: string;
  owners?: string[];
  tags?: string[];
  version?: number;
  kind?: string;
}

export const listCommand = new Command('list')
  .description('List all contract specs in the project')
  .option('--pattern <pattern>', 'File pattern to search (glob)')
  .option(
    '--deep',
    'Load modules to extract richer metadata (executes spec modules)'
  )
  .option(
    '--type <type>',
    'Filter by spec type (operation, event, presentation, etc.)'
  )
  .option('--owner <owner>', 'Filter by owner')
  .option('--tag <tag>', 'Filter by tag')
  .option(
    '--stability <level>',
    'Filter by stability (experimental, beta, stable, deprecated)'
  )
  .option(
    '--group-by <field>',
    'Group results by field (tag, owner, type, domain, stability)'
  )
  .option('--json', 'Output as JSON for scripting')
  .action(async (options) => {
    try {
      const adapters = createNodeAdapters({ silent: true });
      const specs = await listSpecs(adapters, {
        pattern: options.pattern as string | undefined,
        type: options.type as string | undefined,
      });

      const rows: ListJsonRow[] = [];

      for (const scan of specs) {
        const baseRow: ListJsonRow = {
          file: scan.filePath,
          type: scan.specType,
          key: scan.key,
          description: scan.description,
          stability: scan.stability,
          owners: scan.owners,
          tags: scan.tags,
          version: scan.version,
          kind: scan.kind,
        };

        if (options.deep) {
          try {
            const mod = await loadSpecModule(scan.filePath);
            const exported = pickSpecExport(mod);
            const record = exported as Record<string, unknown> | null;
            const meta =
              record && typeof record === 'object'
                ? (record as { meta?: unknown }).meta
                : undefined;

            const maybeMeta =
              meta && typeof meta === 'object'
                ? (meta as Record<string, unknown>)
                : undefined;
            const name =
              typeof maybeMeta?.key === 'string'
                ? maybeMeta.key
                : baseRow.key;
            const description =
              typeof maybeMeta?.description === 'string'
                ? maybeMeta.description
                : baseRow.description;
            const stability =
              typeof maybeMeta?.stability === 'string'
                ? maybeMeta.stability
                : baseRow.stability;
            const owners = Array.isArray(maybeMeta?.owners)
              ? (maybeMeta.owners as unknown[]).filter(isString)
              : baseRow.owners;
            const tags = Array.isArray(maybeMeta?.tags)
              ? (maybeMeta.tags as unknown[]).filter(isString)
              : baseRow.tags;

            rows.push({
              ...baseRow,
              key: name,
              description,
              stability,
              owners,
              tags,
              kind:
                record &&
                typeof (record as { kind?: unknown }).kind === 'string'
                  ? ((record as { kind?: string }).kind ?? baseRow.kind)
                  : baseRow.kind,
            });
          } catch (error) {
            console.warn(
              chalk.yellow(
                `Warning: Could not deep-load ${scan.filePath}: ${getErrorMessage(error)}`
              )
            );
            rows.push(baseRow);
          }
        } else {
          rows.push(baseRow);
        }
      }

      // Apply additional filters
      let filteredSpecs = rows;
      if (options.owner) {
        filteredSpecs = filteredSpecs.filter((s) =>
          s.owners?.some((owner: string) =>
            owner.includes(options.owner as string)
          )
        );
      }
      if (options.tag) {
        filteredSpecs = filteredSpecs.filter((s) =>
          s.tags?.some((tag: string) => tag.includes(options.tag as string))
        );
      }
      if (options.stability) {
        filteredSpecs = filteredSpecs.filter(
          (s) => s.stability === options.stability
        );
      }

      if (options.json) {
        const stable = filteredSpecs
          .slice()
          .sort((a, b) => (a.key ?? a.file).localeCompare(b.key ?? b.file));

        // If grouping, output grouped JSON
        if (options.groupBy) {
          const grouped = groupSpecsForOutput(
            stable,
            options.groupBy as string
          );
          console.log(JSON.stringify(grouped, null, 2));
        } else {
          console.log(JSON.stringify(stable, null, 2));
        }
      } else {
        if (filteredSpecs.length === 0) {
          console.log(
            chalk.yellow('No contract specs found matching criteria.')
          );
          return;
        }

        console.log(
          chalk.bold(`\n📋 Contract Specs (${filteredSpecs.length})\n`)
        );

        const stable = filteredSpecs
          .slice()
          .sort((a, b) => (a.key ?? a.file).localeCompare(b.key ?? b.file));

        // If grouping, output grouped format
        if (options.groupBy) {
          const grouped = groupSpecsForOutput(
            stable,
            options.groupBy as string
          );
          for (const [groupKey, groupSpecs] of Object.entries(grouped)) {
            console.log(
              chalk.bold.blue(
                `\n── ${groupKey} (${(groupSpecs as ListJsonRow[]).length}) ──\n`
              )
            );
            (groupSpecs as ListJsonRow[]).forEach((spec) => {
              printSpecRow(spec);
            });
          }
        } else {
          stable.forEach((spec) => {
            printSpecRow(spec);
          });
        }
      }
    } catch (error) {
      console.error(
        chalk.red(`Error listing specs: ${getErrorMessage(error)}`)
      );
      process.exit(1);
    }
  });

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function groupSpecsForOutput(
  specs: ListJsonRow[],
  groupBy: string
): Record<string, ListJsonRow[]> {
  const groups: Record<string, ListJsonRow[]> = {};

  for (const spec of specs) {
    let key: string;
    switch (groupBy) {
      case 'tag':
        key = spec.tags?.[0] ?? 'untagged';
        break;
      case 'owner':
        key = spec.owners?.[0] ?? 'unowned';
        break;
      case 'type':
        key = spec.type;
        break;
      case 'stability':
        key = spec.stability ?? 'stable';
        break;
      case 'domain':
        key = spec.key?.split('.')[0] ?? 'default';
        break;
      default:
        key = 'all';
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    groups[key]!.push(spec);
  }

  // Sort groups by key
  const sortedGroups: Record<string, ListJsonRow[]> = {};
  for (const key of Object.keys(groups).sort()) {
    if (groups[key]) {
      sortedGroups[key] = groups[key];
    }
  }
  return sortedGroups;
}

function printSpecRow(spec: ListJsonRow): void {
  const stabilityColors: Record<string, typeof chalk.white> = {
    experimental: chalk.red,
    beta: chalk.yellow,
    stable: chalk.green,
    deprecated: chalk.gray,
  };
  const stabilityColor =
    (spec.stability ? stabilityColors[spec.stability] : undefined) ??
    chalk.white;

  console.log(
    `${stabilityColor((spec.stability ?? 'unknown').toUpperCase())} ${chalk.cyan(
      spec.type
    )} ${chalk.bold(spec.key ?? '(no key)')}`
  );

  console.log(`  📁 ${chalk.gray(spec.file)}`);

  if (spec.description) {
    console.log(`  📝 ${chalk.gray(spec.description)}`);
  }

  if (spec.owners?.length) {
    console.log(`  👥 ${chalk.gray(spec.owners.join(', '))}`);
  }

  console.log('');
}
