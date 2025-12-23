import type { ExampleDefinition, ExampleId } from './types';
import { EXAMPLE_REGISTRY } from './builtins';

export { EXAMPLE_REGISTRY };

export function listExamples(): readonly ExampleDefinition[] {
  return EXAMPLE_REGISTRY.slice().sort((a, b) => a.id.localeCompare(b.id));
}

export function getExample(id: ExampleId): ExampleDefinition | undefined {
  return EXAMPLE_REGISTRY.find((ex) => ex.id === id);
}

export function searchExamples(query: string): ExampleDefinition[] {
  const q = query.toLowerCase().trim();
  if (!q) return [...listExamples()];
  return listExamples().filter((ex) => {
    const hay =
      `${ex.id} ${ex.title} ${ex.summary} ${ex.tags.join(' ')}`.toLowerCase();
    return hay.includes(q);
  });
}
