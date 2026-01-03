/**
 * Interactive fix prompts.
 */

import { select, checkbox } from '@inquirer/prompts';
import type { fix } from '@contractspec/bundle.workspace';

/**
 * Prompt user to select a fix strategy for an issue.
 */
export async function promptForStrategy(
  issue: fix.FixableIssue,
  strategies: fix.FixStrategyType[]
): Promise<fix.FixStrategyType | null> {
  if (strategies.length === 0) {
    return null;
  }

  const answer = await select({
    message: `Select fix for ${issue.issue.message}:`,
    choices: strategies.map((s) => ({
      name: s,
      value: s,
    })),
  });

  return answer;
}

/**
 * Prompt user to select issues to fix from a list.
 */
export async function promptForIssues(
  issues: fix.FixableIssue[]
): Promise<fix.FixableIssue[]> {
  if (issues.length === 0) {
    return [];
  }

  const selectedIndices = await checkbox({
    message: 'Select issues to fix:',
    choices: issues.map((issue, index) => ({
      name: `${issue.issue.message} (${issue.featureKey})`,
      value: index,
      checked: true,
    })),
  });

  return selectedIndices.map((index) => issues[index]);
}
