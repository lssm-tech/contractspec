import type { Stability } from '../ownership';

export type DocVisibility = 'public' | 'internal' | 'mixed';

export interface DocBlockLink {
  label: string;
  href: string;
}

export type DocKind = 'goal' | 'how' | 'usage' | 'reference' | 'faq' | 'changelog';

export interface DocBlock {
  /** Globally unique identifier (prefer dotted paths like docs.ops.runbook). */
  id: string;
  /** Short, human-readable title. */
  title: string;
  /** Markdown body (LLM- and human-readable). */
  body: string;
  /** Optional one-line summary used for meta.description. */
  summary?: string;
  /** Explicit route (e.g., /docs/ops/anomaly-detection). Falls back to id-derived route. */
  route?: string;
  /** Optional semantic grouping for filtering. */
  kind?: DocKind;
  /** Visibility gate. Defaults to public. */
  visibility?: DocVisibility;
  /** Optional version to allow evolutions without breaking links. Defaults to 1. */
  version?: string;
  /** Tags to aid discovery and filtering. */
  tags?: string[];
  /** Owning teams or individuals. */
  owners?: string[];
  /** Related contract/presentation identifiers. */
  relatedSpecs?: string[];
  /** External references or supporting links. */
  links?: DocBlockLink[];
  /** Domain or bounded context marker. */
  domain?: string;
  /** Stability marker to mirror presentation ownership semantics. */
  stability?: Stability;
}
