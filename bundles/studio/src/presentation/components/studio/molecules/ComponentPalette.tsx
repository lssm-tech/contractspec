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
  components?: PaletteComponent[];
  onSelect?: (component: PaletteComponent) => void;
}

const PALETTE_COMPONENTS: PaletteComponent[] = [
  {
    id: 'layout-container',
    label: 'Container',
    category: 'layout',
    description: 'Responsive wrapper with padded content area.',
    type: 'Container',
    props: { padding: 'xl', maxWidth: '6xl' },
  },
  {
    id: 'layout-grid',
    label: 'Grid layout',
    category: 'layout',
    description: 'Two-column responsive grid with gap controls.',
    type: 'Grid',
    props: { columns: 2, gap: 24 },
  },
  {
    id: 'layout-stack',
    label: 'Stack',
    category: 'layout',
    description: 'Vertical stack with consistent spacing.',
    type: 'Stack',
    props: { gap: 16 },
  },
  {
    id: 'action-button',
    label: 'CTA Button',
    category: 'actions',
    description: 'Design-system button with primary styling.',
    type: 'Button',
    props: { label: 'Primary action', variant: 'primary', size: 'lg' },
  },
  {
    id: 'input-text',
    label: 'Text input',
    category: 'inputs',
    description: 'Form input with design-system validation states.',
    type: 'Input',
    props: { placeholder: 'Enter text…' },
  },
  {
    id: 'input-textarea',
    label: 'Textarea',
    category: 'inputs',
    description: 'Multi-line input for descriptions or comments.',
    type: 'Textarea',
    props: { placeholder: 'Add more details…', rows: 4 },
  },
  {
    id: 'content-card',
    label: 'Card',
    category: 'content',
    description: 'Neutral card wrapper with title and body content.',
    type: 'Card',
    props: { title: 'Card title', subtitle: 'Supporting copy' },
  },
  {
    id: 'stat-card',
    label: 'Stat card',
    category: 'data',
    description: 'Metric card with value and delta indicator.',
    type: 'StatCard',
    props: { label: 'Open tickets', value: 18, delta: '+3 vs yesterday' },
  },
  {
    id: 'template-task-list',
    label: 'Task list (todos)',
    category: 'data',
    description: 'Full todos experience with filters and priorities.',
    type: 'TaskList',
    props: { projectId: 'demo' },
  },
  {
    id: 'template-messaging',
    label: 'Messaging workspace',
    category: 'data',
    description: 'Conversations list and live message thread.',
    type: 'MessagingWorkspace',
    props: { projectId: 'demo' },
  },
  {
    id: 'template-recipes',
    label: 'Recipe browser',
    category: 'content',
    description: 'i18n-ready recipe explorer with detail view.',
    type: 'RecipeList',
    props: { locale: 'EN', projectId: 'demo' },
  },
  {
    id: 'template-shell',
    label: 'Template shell',
    category: 'layout',
    description: 'Shared shell with heading + runtime indicator.',
    type: 'TemplateShell',
    props: {
      templateId: 'todos-app',
      title: 'Templates',
      description: 'Wraps template components with runtime context.',
    },
  },
];

const CATEGORY_LABEL: Record<PaletteComponent['category'], string> = {
  layout: 'Layout',
  inputs: 'Inputs',
  data: 'Data',
  actions: 'Actions',
  content: 'Content',
};

export function ComponentPalette({
  components = PALETTE_COMPONENTS,
  onSelect,
}: ComponentPaletteProps) {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState<
    PaletteComponent['category'] | 'all'
  >('all');

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
    <div className="border-border bg-card space-y-3 rounded-xl border p-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-wide uppercase">
            Component palette
          </p>
          <p className="text-muted-foreground text-xs">
            Drag components to the canvas or click to add.
          </p>
        </div>
        <PanelsTopLeft className="text-muted-foreground h-5 w-5" />
      </header>
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            className="border-border bg-background w-full rounded-md border py-2 pr-3 pl-9 text-sm"
            placeholder="Search components"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <select
          className="border-border bg-background rounded-md border px-3 py-2 text-sm"
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
          <div className="text-muted-foreground border-border rounded-lg border border-dashed p-6 text-center text-sm">
            No components match your filters.
          </div>
        ) : (
          filtered.map((component) => (
            <button
              key={component.id}
              type="button"
              className="border-border hover:border-primary/60 focus-visible:border-primary focus-visible:ring-primary/20 bg-background hover:bg-primary/5 flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition focus-visible:ring-2 focus-visible:outline-none"
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
                  {component.description ?? CATEGORY_LABEL[component.category]}
                </p>
              </div>
              <span className="text-muted-foreground text-xs tracking-wide uppercase">
                {CATEGORY_LABEL[component.category]}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
