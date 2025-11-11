import { z } from 'zod';
import type { Tag } from './ownership';

export interface ResourceMeta {
  /** URI scheme, e.g. "content://doc/{id}" or "marketplace://offers/{city}/{tag}" */
  uriTemplate: string;
  /** Human title for discovery */
  title: string;
  /** Short description */
  description?: string;
  /** MIME type for resource body */
  mimeType: string; // e.g., "application/json" | "text/markdown"
  /** Tags for filtering/grouping */
  tags?: Tag[];
}

export interface ResourceTemplateSpec<I extends z.ZodType> {
  meta: ResourceMeta;
  /** Arguments to materialize the URI (zod validates input) */
  input: I;
  /**
   * Resolve returns the resource body and a resolved URI.
   * It MUST be read-only (no side effects).
   */
  resolve: (
    args: z.infer<I>,
    ctx: { userId?: string | null; orgId?: string | null; locale?: string }
  ) => Promise<{ uri: string; mimeType?: string; data: Uint8Array | string }>;
}

export function defineResourceTemplate<I extends z.ZodType>(
  spec: ResourceTemplateSpec<I>
): ResourceTemplateSpec<I> {
  return spec;
}

export class ResourceRegistry {
  private templates: ResourceTemplateSpec<any>[] = [];

  register<I extends z.ZodType>(tmpl: ResourceTemplateSpec<I>): this {
    this.templates.push(tmpl);
    return this;
  }

  listTemplates() {
    return [...this.templates];
  }

  /** Try to match a concrete URI to a template by naive pattern substitution */
  // MVP: simple matcher; replace {param} with (.+) and capture
  match(
    uri: string
  ):
    | { tmpl: ResourceTemplateSpec<any>; params: Record<string, string> }
    | undefined {
    for (const tmpl of this.templates) {
      const re = new RegExp(
        '^' + tmpl.meta.uriTemplate.replace(/\{[^}]+\}/g, '([^/]+)') + '$'
      );
      const m = uri.match(re);
      if (!m) continue;
      const names = [...tmpl.meta.uriTemplate.matchAll(/\{([^}]+)\}/g)].map(
        (x) => x[1]
      );
      const params: Record<string, string> = {};
      names.forEach((n, i) => (params[n!] = decodeURIComponent(m[i + 1]!)));
      return { tmpl, params };
    }
    return undefined;
  }
}

// ResourceRef (output descriptor for ContractSpecs)
export interface ResourceRefDescriptor<Many extends boolean> {
  kind: 'resource_ref';
  /** URI template, e.g. 'strit://spot/{id}' */
  uriTemplate: string;
  /** Variable name inside result payload to substitute into template; defaults to 'id' */
  varName?: string;
  /** Optional GraphQL type name to use when exposing over GraphQL (e.g., 'Spot') */
  graphQLType: string;
  /** Cardinality: when present and true, the handler returns an array of resources */
  many: Many;
}

export function resourceRef<Many extends boolean>(
  uriTemplate: string,
  opts: { varName?: string; graphQLType: string; many: Many }
): ResourceRefDescriptor<Many> {
  return {
    kind: 'resource_ref',
    uriTemplate,
    varName: opts.varName ?? 'id',
    graphQLType: opts.graphQLType,
    many: opts.many,
  };
}

export function isResourceRef(x: unknown): x is ResourceRefDescriptor<boolean> {
  const o = x as any;
  return !!o && o.kind === 'resource_ref' && typeof o.uriTemplate === 'string';
}
