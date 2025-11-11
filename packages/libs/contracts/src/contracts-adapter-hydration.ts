import type { ResourceRegistry } from './resources';

export interface ReturnsDecl {
  isList: boolean;
  inner: string;
}

export function parseReturns(returnsLike: string): ReturnsDecl {
  if (!returnsLike) return { isList: false, inner: 'JSON' };
  const trimmed = String(returnsLike).trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return { isList: true, inner: trimmed.slice(1, -1).trim() };
  }
  return { isList: false, inner: trimmed };
}

export async function hydrateResourceIfNeeded(
  resources: ResourceRegistry | undefined,
  result: unknown,
  opts: { template?: string; varName?: string; returns: ReturnsDecl }
): Promise<unknown> {
  if (!resources || !opts.template) return result;
  const varName = opts.varName ?? 'id';

  const hydrateOne = async (item: any) => {
    if (item && typeof item[varName] !== 'undefined') {
      const key = String(item[varName]);
      const uri = opts.template!.replace('{id}', key);
      const match = resources.match(uri);
      if (match) {
        const resolved = await match.tmpl.resolve(
          match.params as unknown as Record<string, string>,
          {}
        );
        try {
          return JSON.parse(String(resolved.data || 'null'));
        } catch {
          return resolved.data;
        }
      }
    }
    return item;
  };

  if (opts.returns.isList && Array.isArray(result)) {
    const hydrated = await Promise.all(result.map((x) => hydrateOne(x)));
    return hydrated;
  }
  return await hydrateOne(result as any);
}
