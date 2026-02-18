import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';

const CONFIG_FILENAME = 'agentpacks.jsonc';

/**
 * Read workspace config as raw text (preserving comments/formatting).
 */
function readConfigRaw(projectRoot: string): string {
  const filepath = resolve(projectRoot, CONFIG_FILENAME);
  if (!existsSync(filepath)) {
    throw new Error(
      `No ${CONFIG_FILENAME} found. Run 'agentpacks init' first.`
    );
  }
  return readFileSync(filepath, 'utf-8');
}

/**
 * Extract the disabled array from raw JSONC text.
 * Returns the parsed array and regex match info for replacement.
 */
function parseDisabledFromRaw(raw: string): {
  list: string[];
  match: RegExpExecArray | null;
} {
  const regex = /"disabled"\s*:\s*\[([^\]]*)\]/;
  const match = regex.exec(raw);
  if (!match) return { list: [], match: null };

  const inner = match[1]!.trim();
  if (!inner) return { list: [], match };

  const list = inner
    .split(',')
    .map((s) => s.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean);
  return { list, match };
}

/**
 * Write back the disabled array into raw JSONC text.
 */
function writeDisabled(
  raw: string,
  newList: string[],
  match: RegExpExecArray | null
): string {
  const formatted =
    newList.length === 0
      ? '"disabled": []'
      : `"disabled": [${newList.map((n) => `"${n}"`).join(', ')}]`;

  if (!match) {
    // Insert after "packs" line if disabled key doesn't exist
    return raw.replace(
      /("packs"\s*:\s*\[[^\]]*\],?)/,
      `$1\n\n  // Packs to disable (override)\n  ${formatted},`
    );
  }

  return (
    raw.slice(0, match.index) +
    formatted +
    raw.slice(match.index + match[0].length)
  );
}

/**
 * Disable a pack by adding it to the disabled array.
 */
export function runPackDisable(projectRoot: string, packName: string): void {
  const raw = readConfigRaw(projectRoot);
  const { list, match } = parseDisabledFromRaw(raw);

  if (list.includes(packName)) {
    console.log(chalk.dim(`Pack "${packName}" is already disabled.`));
    return;
  }

  list.push(packName);
  const updated = writeDisabled(raw, list, match);
  const filepath = resolve(projectRoot, CONFIG_FILENAME);
  writeFileSync(filepath, updated);

  console.log(chalk.green(`Disabled pack "${packName}".`));
  console.log(chalk.dim("Run 'agentpacks generate' to regenerate configs."));
}

/**
 * Enable a pack by removing it from the disabled array.
 */
export function runPackEnable(projectRoot: string, packName: string): void {
  const raw = readConfigRaw(projectRoot);
  const { list, match } = parseDisabledFromRaw(raw);

  if (!list.includes(packName)) {
    console.log(chalk.dim(`Pack "${packName}" is not disabled.`));
    return;
  }

  const newList = list.filter((n) => n !== packName);
  const updated = writeDisabled(raw, newList, match);
  const filepath = resolve(projectRoot, CONFIG_FILENAME);
  writeFileSync(filepath, updated);

  console.log(chalk.green(`Enabled pack "${packName}".`));
  console.log(chalk.dim("Run 'agentpacks generate' to regenerate configs."));
}
