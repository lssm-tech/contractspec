import type { WorkspaceAdapters } from '../../server';

export function resolveOutputPath(args: {
  fs: WorkspaceAdapters['fs'];
  outputDirOverride?: string;
  workspaceOutputDir: string;
  conventions: Record<string, string>;
  specType: 'operation' | 'event' | 'presentation' | 'feature';
  opKind: 'command' | 'query';
  specName: string;
  extension: string;
}): string {
  const base = args.outputDirOverride ?? args.workspaceOutputDir;
  const baseDir = args.fs.resolve(base);
  const fileName = generateFileName(args.specName, args.extension);
  const subPath = resolveSubPath(args.specType, args.conventions, args.opKind);
  return args.fs.join(baseDir, subPath, fileName);
}

function resolveSubPath(
  specType: 'operation' | 'event' | 'presentation' | 'feature',
  conventions: Record<string, string>,
  opKind: 'command' | 'query'
): string {
  if (specType === 'feature') return 'features';
  if (specType === 'event') return conventions.events || 'events';
  if (specType === 'presentation')
    return conventions.presentations || 'presentations';

  const raw = conventions.operations || 'interactions';
  if (!raw.includes('|')) return raw;
  const [commands, queries] = raw.split('|').map((s) => s.trim());
  return opKind === 'query'
    ? queries || commands || raw
    : commands || raw;
}

function generateFileName(baseName: string, extension: string): string {
  const kebab = baseName
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
  return `${kebab}${extension}`;
}


