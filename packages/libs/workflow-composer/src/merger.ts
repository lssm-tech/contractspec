import type { WorkflowExtension } from './types';

export function mergeExtensions(
  extensions: WorkflowExtension[]
): WorkflowExtension[] {
  return extensions.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
}



