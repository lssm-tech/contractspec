import { filterBy, getUniqueTags, groupBy } from '../registry-utils';

import type { OwnerShipMeta } from '../ownership';
import type { EventRef, OpRef, PresentationRef } from '../features';
import type { ExperimentRef } from '../experiments/spec';

export type DataViewKind = 'list' | 'detail' | 'table' | 'grid';

export interface DataViewMeta extends OwnerShipMeta {
  /** Fully-qualified data view name (e.g., "sigil.spaces.admin_list"). */
  name: string;
  /** Version of this data view. Increment on breaking changes. */
  version: number;
  /** Canonical entity slug (e.g., "space", "resident"). */
  entity: string;
}

export interface DataViewSource {
  /** Primary query used to fetch items for this view. */
  primary: OpRef;
  /** Optional operation used to fetch a single item (detail views). */
  item?: OpRef;
  /** Optional record mutation operations (used for inline editing or actions). */
  mutations?: {
    create?: OpRef;
    update?: OpRef;
    delete?: OpRef;
  };
  /** Events that should trigger refresh when emitted. */
  refreshEvents?: EventRef[];
}

export type DataViewFieldFormat =
  | 'text'
  | 'number'
  | 'currency'
  | 'percentage'
  | 'date'
  | 'dateTime'
  | 'boolean'
  | 'badge';

export interface DataViewField {
  /** Unique identifier for the field within the view. */
  key: string;
  /** Human-friendly label for headers/tooltips. */
  label: string;
  /** Dot-path into the data item (e.g., "address.city"). */
  dataPath: string;
  /** Optional description surfaced in tooltips or docs. */
  description?: string;
  /** Optional formatting hint for renderers. */
  format?: DataViewFieldFormat;
  /** When true, the field can be used for sorting. */
  sortable?: boolean;
  /** When true, the field can be used for filtering. */
  filterable?: boolean;
  /** Optional width hint for table layouts. */
  width?: 'auto' | 'xs' | 'sm' | 'md' | 'lg';
  /** Optional presentation override (e.g., card component). */
  presentation?: PresentationRef;
}

export interface DataViewFilter {
  key: string;
  label: string;
  field: string;
  type: 'search' | 'enum' | 'number' | 'date' | 'boolean';
  options?: { value: string; label: string }[];
}

export interface DataViewAction {
  key: string;
  label: string;
  kind: 'navigation' | 'operation';
  /** Operation invoked when kind === 'operation'. */
  operation?: OpRef;
  /** Optional feature flag gating the action. */
  requiresFlag?: string;
}

export interface DataViewSections {
  title?: string;
  description?: string;
  fields: string[];
}

export interface DataViewBaseConfig {
  kind: DataViewKind;
  fields: DataViewField[];
  primaryField?: string;
  secondaryFields?: string[];
  filters?: DataViewFilter[];
  actions?: DataViewAction[];
}

export interface DataViewListConfig extends DataViewBaseConfig {
  kind: 'list';
  layout?: 'card' | 'compact';
}

export interface DataViewDetailConfig extends DataViewBaseConfig {
  kind: 'detail';
  sections?: DataViewSections[];
}

export interface DataViewTableColumn {
  field: string;
  label?: string;
  width?: 'auto' | 'xs' | 'sm' | 'md' | 'lg';
  align?: 'left' | 'center' | 'right';
}

export interface DataViewTableConfig extends DataViewBaseConfig {
  kind: 'table';
  columns?: DataViewTableColumn[];
  rowSelectable?: boolean;
  density?: 'comfortable' | 'compact';
}

export interface DataViewGridConfig extends DataViewBaseConfig {
  kind: 'grid';
  columns?: number;
}

export type DataViewConfig =
  | DataViewListConfig
  | DataViewDetailConfig
  | DataViewTableConfig
  | DataViewGridConfig;

export interface DataViewStates {
  empty?: PresentationRef;
  error?: PresentationRef;
  loading?: PresentationRef;
}

export interface DataViewSpec {
  meta: DataViewMeta;
  source: DataViewSource;
  view: DataViewConfig;
  states?: DataViewStates;
  policy?: { flags?: string[]; pii?: string[] };
  experiments?: ExperimentRef[];
}

function keyOf(spec: DataViewSpec) {
  return `${spec.meta.name}.v${spec.meta.version}`;
}

export class DataViewRegistry {
  private readonly items = new Map<string, DataViewSpec>();

  register(spec: DataViewSpec): this {
    const key = keyOf(spec);
    if (this.items.has(key)) throw new Error(`Duplicate data view ${key}`);
    this.items.set(key, spec);
    return this;
  }

  list(): DataViewSpec[] {
    return [...this.items.values()];
  }

  get(name: string, version?: number): DataViewSpec | undefined {
    if (version != null) return this.items.get(`${name}.v${version}`);
    let candidate: DataViewSpec | undefined;
    let max = -Infinity;
    for (const spec of this.items.values()) {
      if (spec.meta.name !== name) continue;
      if (spec.meta.version > max) {
        max = spec.meta.version;
        candidate = spec;
      }
    }
    return candidate;
  }

  /** Filter data views by criteria. */
  filter(criteria: import('../registry-utils').RegistryFilter): DataViewSpec[] {
    return filterBy(this.list(), criteria);
  }

  /** List data views with specific tag. */
  listByTag(tag: string): DataViewSpec[] {
    return this.list().filter((d) => d.meta.tags?.includes(tag));
  }

  /** List data views by owner. */
  listByOwner(owner: string): DataViewSpec[] {
    return this.list().filter((d) => d.meta.owners?.includes(owner));
  }

  /** Group data views by key function. */
  groupBy(
    keyFn: import('../registry-utils').GroupKeyFn<DataViewSpec>
  ): Map<string, DataViewSpec[]> {
    return groupBy(this.list(), keyFn);
  }

  /** Get unique tags from all data views. */
  getUniqueTags(): string[] {
    return getUniqueTags(this.list());
  }
}

export function dataViewKey(spec: DataViewSpec) {
  return keyOf(spec);
}
