import chalk from 'chalk';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { loadPacks } from '../core/loader.js';
import { mergePacks } from '../core/merger.js';
import { resolveModels } from '../core/profile-resolver.js';
import { generateModelGuidanceMarkdown } from '../utils/model-guidance.js';

interface ModelsExplainOptions {
  config?: string;
  profile?: string;
  target?: string;
  task?: string;
}

/**
 * Explain model profile and routing resolution for a given context.
 *
 * Usage:
 *   agentpacks models explain
 *   agentpacks models explain --profile performance
 *   agentpacks models explain --task "complex refactor" --target opencode
 */
export async function runModelsExplain(
  options: ModelsExplainOptions
): Promise<void> {
  const configPath = resolve(options.config ?? 'agentpacks.yaml');

  if (!existsSync(configPath)) {
    console.log(
      chalk.red('No agentpacks.yaml found. Run `agentpacks init` first.')
    );
    process.exit(1);
  }

  // Load and merge packs
  const packs = await loadPacks(configPath);
  const merged = mergePacks(packs);

  if (!merged.models) {
    console.log(chalk.dim('No model configuration found in your packs.'));
    return;
  }

  const profile = options.profile;
  const target = options.target;

  // Resolve models
  const resolved = resolveModels(merged.models, profile, target);

  // Header
  console.log(chalk.bold('\n📋 Model Configuration Summary\n'));

  // Active settings
  if (resolved.default) {
    console.log(
      `  ${chalk.dim('Default model:')}  ${chalk.cyan(resolved.default)}`
    );
  }
  if (resolved.small) {
    console.log(
      `  ${chalk.dim('Small model:')}    ${chalk.cyan(resolved.small)}`
    );
  }
  if (resolved.activeProfile) {
    console.log(
      `  ${chalk.dim('Active profile:')} ${chalk.green(resolved.activeProfile)}`
    );
  }
  if (target) {
    console.log(`  ${chalk.dim('Target:')}         ${chalk.yellow(target)}`);
  }

  // Agent assignments
  const agentEntries = Object.entries(resolved.agents);
  if (agentEntries.length > 0) {
    console.log(chalk.bold('\n  Agent Assignments:'));
    for (const [name, config] of agentEntries) {
      const temp =
        config.temperature !== undefined
          ? ` (temp: ${config.temperature})`
          : '';
      console.log(
        `    ${chalk.dim('•')} ${name}: ${chalk.cyan(config.model)}${chalk.dim(temp)}`
      );
    }
  }

  // Available profiles
  if (resolved.profileNames.length > 0) {
    console.log(chalk.bold('\n  Available Profiles:'));
    for (const name of resolved.profileNames) {
      const profileData = resolved.profiles[name];
      const desc = profileData?.description ?? '';
      const active =
        name === resolved.activeProfile ? chalk.green(' ← active') : '';
      console.log(
        `    ${chalk.dim('•')} ${name}${active}${desc ? chalk.dim(` — ${desc}`) : ''}`
      );
    }
  }

  // Routing rules
  if (resolved.routing.length > 0) {
    console.log(chalk.bold('\n  Routing Rules:'));
    for (const rule of resolved.routing) {
      const conditions = Object.entries(rule.when)
        .map(([k, v]) => `${chalk.yellow(k)}=${chalk.cyan(v)}`)
        .join(', ');
      const desc = (rule as { description?: string }).description;
      console.log(
        `    ${chalk.dim('•')} When ${conditions} → use ${chalk.green(rule.use)}${desc ? chalk.dim(` (${desc})`) : ''}`
      );
    }

    // Task matching
    if (options.task) {
      console.log(chalk.bold('\n  Task Analysis:'));
      console.log(`    ${chalk.dim('Task:')} "${options.task}"`);

      const matched = matchTaskToRouting(options.task, resolved.routing);
      if (matched) {
        console.log(
          `    ${chalk.green('✓')} Matched rule: ${chalk.green(matched.use)}`
        );
        const conditions = Object.entries(matched.when)
          .map(([k, v]) => `${k}=${v}`)
          .join(', ');
        console.log(`    ${chalk.dim('  Conditions:')} ${conditions}`);
      } else {
        console.log(
          `    ${chalk.yellow('○')} No routing rule matched — using default profile`
        );
      }
    }
  }

  // Generate guidance preview
  const guidance = generateModelGuidanceMarkdown(resolved);
  if (guidance) {
    console.log(chalk.bold('\n  Generated Guidance Preview:'));
    console.log(chalk.dim('  ' + '─'.repeat(50)));
    for (const line of guidance.split('\n').slice(0, 20)) {
      console.log(`  ${chalk.dim(line)}`);
    }
    if (guidance.split('\n').length > 20) {
      console.log(
        chalk.dim(`  ... (${guidance.split('\n').length - 20} more lines)`)
      );
    }
  }

  console.log('');
}

/**
 * Simple heuristic task-to-routing matcher.
 * Matches keywords in the task description against routing conditions.
 */
function matchTaskToRouting(
  task: string,
  routing: Array<{ when: Record<string, string>; use: string }>
): { when: Record<string, string>; use: string } | null {
  const lowerTask = task.toLowerCase();

  // Keyword → condition value mapping
  const complexityKeywords: Record<string, string[]> = {
    critical: ['critical', 'security', 'production', 'hotfix'],
    high: ['refactor', 'architecture', 'complex', 'rewrite', 'migrate'],
    medium: ['feature', 'implement', 'update', 'modify'],
    low: ['fix', 'typo', 'comment', 'rename', 'format'],
  };

  const urgencyKeywords: Record<string, string[]> = {
    high: ['urgent', 'asap', 'emergency', 'hotfix', 'critical'],
    normal: ['feature', 'implement', 'add'],
    low: ['cleanup', 'refactor', 'docs', 'todo'],
  };

  // Infer conditions from task text
  const inferred: Record<string, string> = {};

  for (const [level, keywords] of Object.entries(complexityKeywords)) {
    if (keywords.some((kw) => lowerTask.includes(kw))) {
      inferred['complexity'] = level;
      break;
    }
  }

  for (const [level, keywords] of Object.entries(urgencyKeywords)) {
    if (keywords.some((kw) => lowerTask.includes(kw))) {
      inferred['urgency'] = level;
      break;
    }
  }

  // Find best matching rule
  for (const rule of routing) {
    const matches = Object.entries(rule.when).every(([key, value]) => {
      if (inferred[key] === value) return true;
      if (lowerTask.includes(value.toLowerCase())) return true;
      return false;
    });

    if (matches) return rule;
  }

  return null;
}
