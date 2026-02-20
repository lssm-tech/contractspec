import type { ResolvedModels } from '../core/profile-resolver.js';

/**
 * Generate a markdown model guidance document from resolved model config.
 * Used by targets that don't have native model configuration (Claude, Copilot, generic).
 */
export function generateModelGuidanceMarkdown(
  resolved: ResolvedModels
): string | null {
  if (
    !resolved.default &&
    !resolved.small &&
    Object.keys(resolved.agents).length === 0 &&
    Object.keys(resolved.profiles).length === 0
  ) {
    return null;
  }

  const lines: string[] = [];
  lines.push('# Model Configuration');
  lines.push('');
  lines.push(
    'Use the following model preferences when working in this project.'
  );
  lines.push('');

  // Default models
  if (resolved.default || resolved.small) {
    lines.push('## Default Models');
    lines.push('');
    if (resolved.default) {
      lines.push(`- **Primary model**: ${resolved.default}`);
    }
    if (resolved.small) {
      lines.push(
        `- **Lightweight tasks** (titles, summaries): ${resolved.small}`
      );
    }
    lines.push('');
  }

  // Agent assignments
  const agentEntries = Object.entries(resolved.agents);
  if (agentEntries.length > 0) {
    lines.push('## Agent Model Assignments');
    lines.push('');
    lines.push('| Agent | Model | Temperature |');
    lines.push('| --- | --- | --- |');
    for (const [name, assignment] of agentEntries) {
      const temp =
        assignment.temperature !== undefined
          ? String(assignment.temperature)
          : '\u2014';
      lines.push(`| ${name} | ${assignment.model} | ${temp} |`);
    }
    lines.push('');
  }

  // Available profiles
  if (Object.keys(resolved.profiles).length > 0) {
    lines.push('## Available Profiles');
    lines.push('');
    lines.push('| Profile | Description | Default Model |');
    lines.push('| --- | --- | --- |');
    for (const [name, profile] of Object.entries(resolved.profiles)) {
      lines.push(
        `| ${name} | ${profile.description ?? '\u2014'} | ${profile.default ?? '\u2014'} |`
      );
    }
    lines.push('');
  }

  // Active profile
  if (resolved.activeProfile) {
    lines.push(`**Active profile**: \`${resolved.activeProfile}\``);
    lines.push('');
  }

  // Routing rules
  if (resolved.routing.length > 0) {
    lines.push('## Routing Rules');
    lines.push('');
    lines.push('| Condition | Profile |');
    lines.push('| --- | --- |');
    for (const rule of resolved.routing) {
      const conditions = Object.entries(rule.when)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ');
      lines.push(`| ${conditions} | ${rule.use} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
