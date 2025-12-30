export interface TextDiffResult {
  ok: boolean;
  output: string;
}

export interface SemanticDiffItem {
  type: 'added' | 'removed' | 'changed' | 'breaking';
  path: string;
  description: string;
  oldValue?: unknown;
  newValue?: unknown;
}
