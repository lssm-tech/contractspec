import type { ExampleDefinition, ExampleId } from './types';

/**
 * Pure in-memory registry. Populated explicitly (no IO).
 *
 * Note: We intentionally keep registration explicit so the module stays
 * deterministic and side-effect-free; higher layers can compose the list by
 * importing `@lssm/example.*/*` manifests.
 */
const registry = new Map<ExampleId, ExampleDefinition>();

export function registerExample(example: ExampleDefinition): void {
  registry.set(example.id, example);
}

export function registerExamples(examples: ExampleDefinition[]): void {
  for (const example of examples) {
    registerExample(example);
  }
}

export function listExamples(): ExampleDefinition[] {
  return [...registry.values()].slice().sort((a, b) => a.id.localeCompare(b.id));
}

export function getExample(id: ExampleId): ExampleDefinition | undefined {
  return registry.get(id);
}

export function searchExamples(query: string): ExampleDefinition[] {
  const q = query.toLowerCase().trim();
  if (!q) return listExamples();
  return listExamples().filter((ex) => {
    const hay = `${ex.id} ${ex.title} ${ex.summary} ${ex.tags.join(' ')}`.toLowerCase();
    return hay.includes(q);
  });
}


