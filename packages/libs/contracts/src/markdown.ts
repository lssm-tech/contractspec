import type { SpecRegistry } from './registry';
import { isEmitDeclRef } from './spec';
import type { PresentationRegistry } from './presentations';
import type { FeatureRegistry } from './features';

/**
 * Render simple Markdown docs for each spec.
 * Useful for dev portals and repo docs generation.
 */
export function specsToMarkdown(
  reg: SpecRegistry,
  extras?: { presentations?: PresentationRegistry; features?: FeatureRegistry }
): string {
  const lines: string[] = [];

  for (const spec of reg.listSpecs()) {
    const m = spec.meta;
    lines.push(`# ${m.name}.v${m.version}`);
    lines.push('');
    lines.push(
      `**Kind:** ${m.kind} | **Stability:** ${m.stability} | **Owners:** ${m.owners.join(', ')}`
    );
    lines.push('');
    lines.push(`**Description:** ${m.description}`);
    lines.push('');
    lines.push(`## Goal`);
    lines.push(m.goal);
    lines.push('');
    lines.push(`## Context`);
    lines.push(m.context);
    lines.push('');

    lines.push(`## Policy`);
    lines.push(`- Auth: ${spec.policy.auth}`);
    lines.push(`- Idempotent: ${!!spec.policy.idempotent}`);
    if (spec.policy.rateLimit)
      lines.push(
        `- Rate Limit: ${spec.policy.rateLimit.rpm}/min by ${spec.policy.rateLimit.key}`
      );
    if (spec.policy.flags?.length)
      lines.push(`- Flags: ${spec.policy.flags.join(', ')}`);
    if (spec.policy.pii?.length)
      lines.push(`- PII: ${spec.policy.pii.join(', ')}`);
    lines.push('');

    if (spec.sideEffects?.emits?.length) {
      lines.push(`## Emits Events`);
      for (const e of spec.sideEffects.emits) {
        if (isEmitDeclRef(e)) {
          lines.push(`- \`${e.ref.name}.v${e.ref.version}\` — ${e.when}`);
        } else {
          lines.push(`- \`${e.name}.v${e.version}\` — ${e.when}`);
        }
      }
      lines.push('');
    }

    if (spec.io.errors && Object.keys(spec.io.errors).length) {
      lines.push(`## Errors`);
      for (const [code, err] of Object.entries(spec.io.errors)) {
        lines.push(
          `- \`${code}\` (${err.http ?? 400}) — ${err.description} (when: ${err.when})`
        );
      }
      lines.push('');
    }

    if (spec.acceptance?.scenarios?.length) {
      lines.push(`## Acceptance Scenarios`);
      for (const s of spec.acceptance.scenarios) {
        lines.push(`### ${s.name}`);
        lines.push(`- **Given:** ${s.given.join('; ')}`);
        lines.push(`- **When:** ${s.when.join('; ')}`);
        lines.push(`- **Then:** ${s.then.join('; ')}`);
        lines.push('');
      }
    }

    if (spec.acceptance?.examples?.length) {
      lines.push(`## Examples`);
      for (const ex of spec.acceptance.examples) {
        lines.push(`- **${ex.name}**`);
        lines.push('  - Input:');
        lines.push('    ```json');
        lines.push(JSON.stringify(ex.input, null, 2));
        lines.push('    ```');
        lines.push('  - Output:');
        lines.push('    ```json');
        lines.push(JSON.stringify(ex.output, null, 2));
        lines.push('    ```');
        lines.push('');
      }
    }

    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

/** Render presentations and features as additional sections. */
export function docsToMarkdown(
  reg: SpecRegistry,
  extras: { presentations?: PresentationRegistry; features?: FeatureRegistry }
): string {
  const parts: string[] = [];
  parts.push(specsToMarkdown(reg, extras));

  if (extras.presentations) {
    parts.push('# Presentations');
    parts.push('');
    for (const p of extras.presentations.list()) {
      parts.push(`## ${p.meta.name}.v${p.meta.version}`);
      parts.push('');
      parts.push(`- Kind: ${(p.content as any).kind}`);
      if ('framework' in p.content)
        parts.push(`- Framework: ${p.content.framework}`);
      if ('componentKey' in p.content)
        parts.push(`- Component Key: ${(p.content as any).componentKey}`);
      if ('mimeType' in p.content)
        parts.push(`- MIME Type: ${(p.content as any).mimeType}`);
      parts.push('');
    }
    parts.push('');
  }

  if (extras.features) {
    parts.push('# Features');
    parts.push('');
    for (const f of extras.features.list()) {
      parts.push(`## ${f.meta.title} (${f.meta.key})`);
      if (f.meta.description) parts.push(f.meta.description);
      parts.push('');
      if (f.operations?.length) {
        parts.push('- Operations:');
        for (const o of f.operations) parts.push(`  - ${o.name}.v${o.version}`);
      }
      if (f.events?.length) {
        parts.push('- Events:');
        for (const e of f.events) parts.push(`  - ${e.name}.v${e.version}`);
      }
      if (f.presentations?.length) {
        parts.push('- Presentations:');
        for (const p of f.presentations)
          parts.push(`  - ${p.name}.v${p.version}`);
      }
      parts.push('');
    }
  }

  return parts.join('\n');
}
