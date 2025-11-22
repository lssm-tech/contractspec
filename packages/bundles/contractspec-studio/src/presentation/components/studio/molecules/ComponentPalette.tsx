import * as React from 'react';
import { Search, PanelsTopLeft } from 'lucide-react';
import type { ComponentDefinition } from '../../../../modules/visual-builder';

export interface PaletteComponent extends ComponentDefinition {
  id: string;
  label: string;
  category: 'layout' | 'inputs' | 'data' | 'actions' | 'content';
  description?: string;
  icon?: React.ReactNode;
}

export interface ComponentPaletteProps {
  components: PaletteComponent[];
  onSelect?: (component: PaletteComponent) => void;
}

const CATEGORY_LABEL: Record<PaletteComponent['category'], string> = {
  layout: 'Layout',
  inputs: 'Inputs',
  data: 'Data',
  actions: 'Actions',
  content: 'Content',
};

export function ComponentPalette({
  components,
  onSelect,
}: ComponentPaletteProps) {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] =
    React.useState<ComponentPaletteProps['components'][number]['category'] | 'all'>(
      'all'
    );

  const filtered = React.useMemo(() => {
    return components.filter((component) => {
      const matchesSearch = component.label
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        category === 'all' ? true : component.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [components, search, category]);

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide">
            Component palette
          </p>
          <p className="text-muted-foreground text-xs">
            Drag components to the canvas or click to add.
          </p>
        </div>
        <PanelsTopLeft className="text-muted-foreground h-5 w-5" />
      </header>
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            className="border-border w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm"
            placeholder="Search components"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <select
          className="border-border rounded-md border bg-background px-3 py-2 text-sm"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as typeof category)
          }
          aria-label="Filter components by category"
        >
          <option value="all">All categories</option>
          {Object.entries(CATEGORY_LABEL).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-muted-foreground rounded-lg border border-dashed border-border p-6 text-center text-sm">
            No components match your filters.
          </div>
        ) : (
          filtered.map((component) => (
            <button
              key={component.id}
              type="button"
              className="border-border hover:border-primary/60 focus-visible:border-primary focus-visible:ring-primary/20 flex w-full items-center justify-between rounded-lg border bg-background px-4 py-3 text-left text-sm transition hover:bg-primary/5 focus-visible:ring-2 focus-visible:outline-none"
              draggable
              onClick={() => onSelect?.(component)}
              onDragStart={(event) => {
                event.dataTransfer.setData(
                  'application/json',
                  JSON.stringify(component)
                );
              }}
            >
              <div>
                <p className="font-semibold">{component.label}</p>
                <p className="text-muted-foreground text-xs">
                  {component.description ??
                    CATEGORY_LABEL[component.category]}
                </p>
              </div>
              <span className="text-muted-foreground text-xs uppercase tracking-wide">
                {CATEGORY_LABEL[component.category]}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

