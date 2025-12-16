export function normalizeType(
  raw: string
): 'operation' | 'event' | 'presentation' | 'feature' {
  switch (raw) {
    case 'operation':
    case 'event':
    case 'presentation':
    case 'feature':
      return raw;
    default:
      return 'operation';
  }
}

export function normalizeStability(raw?: string) {
  switch (raw) {
    case 'beta':
    case 'stable':
    case 'deprecated':
    case 'experimental':
      return raw;
    default:
      return 'experimental';
  }
}

export function extensionFor(
  type: 'operation' | 'event' | 'presentation' | 'feature'
): string {
  switch (type) {
    case 'operation':
      return '.contracts.ts';
    case 'event':
      return '.event.ts';
    case 'presentation':
      return '.presentation.ts';
    case 'feature':
      return '.feature.ts';
  }
}
