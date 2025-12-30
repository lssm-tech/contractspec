export interface ListState<TFilters extends Record<string, unknown>> {
  q: string;
  page: number;
  limit: number;
  sort?: string | null;
  filters: TFilters;
}

export type ListFetcher<TVars, TItem> = (
  vars: TVars
) => Promise<{ items: TItem[]; totalItems?: number; totalPages?: number }>;

// ---- Framework config helpers (Next / Metro) ----
export interface NextAliasOptions {
  uiKitWeb?: string; // default '@contractspec/lib.ui-kit-web'
  uiKitNative?: string; // default '@contractspec/lib.ui-kit'
  presentationReact?: string; // default '@contractspec/lib.presentation-runtime-react'
  presentationNative?: string; // default '@contractspec/lib.presentation-runtime-react-native'
}

export function withPresentationNextAliases(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any,
  opts: NextAliasOptions = {}
) {
  const uiWeb = opts.uiKitWeb ?? '@contractspec/lib.ui-kit-web';
  const uiNative = opts.uiKitNative ?? '@contractspec/lib.ui-kit';
  const presReact =
    opts.presentationReact ?? '@contractspec/lib.presentation-runtime-react';
  const presNative =
    opts.presentationNative ??
    '@contractspec/lib.presentation-runtime-react-native';

  config.resolve ??= {};
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    [uiNative]: uiWeb,
    [presNative]: presReact,
  };
  config.resolve.extensions = [
    '.web.js',
    '.web.jsx',
    '.web.ts',
    '.web.tsx',
    ...((config.resolve.extensions as string[]) || []),
  ];
  return config;
}

export type MetroAliasOptions = NextAliasOptions & {
  monorepoRoot?: string;
};

export function withPresentationMetroAliases(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any,
  opts: MetroAliasOptions = {}
) {
  const uiWeb = opts.uiKitWeb ?? '@contractspec/lib.ui-kit-web';
  const uiNative = opts.uiKitNative ?? '@contractspec/lib.ui-kit';
  const presReact =
    opts.presentationReact ?? '@contractspec/lib.presentation-runtime-react';
  const presNative =
    opts.presentationNative ??
    '@contractspec/lib.presentation-runtime-react-native';

  // Prefer package exports resolution
  config.resolver ??= {};
  config.resolver.unstable_enablePackageExports = true;

  // Platform resolution ordering
  config.resolver.platforms = [
    'ios',
    'android',
    'native',
    'mobile',
    'web',
    ...((config.resolver.platforms as string[]) || []),
  ];

  // Map web kit → native at resolver-level
  const original = config.resolver.resolveRequest;
  config.resolver.resolveRequest = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctx: any,
    moduleName: string,
    platform: string
  ) => {
    if (platform === 'ios' || platform === 'android' || platform === 'native') {
      if (
        typeof moduleName === 'string' &&
        moduleName.startsWith(uiWeb + '/ui')
      ) {
        const mapped = moduleName.replace(uiWeb + '/ui', uiNative + '/ui');
        return (original ?? ctx.resolveRequest)(ctx, mapped, platform);
      }
      if (moduleName === presReact) {
        return (original ?? ctx.resolveRequest)(ctx, presNative, platform);
      }
    }
    return (original ?? ctx.resolveRequest)(ctx, moduleName, platform);
  };

  return config;
}
