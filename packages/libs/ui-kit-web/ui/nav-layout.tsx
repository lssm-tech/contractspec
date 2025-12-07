import * as React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu';
import { cva } from 'class-variance-authority';
import { cn } from '@lssm/lib.ui-kit-core/utils';

export const navPanelVariants = cva('', {
  variants: {
    width: {
      sm: 'w-[280px]',
      md: 'w-[500px]',
      lg: 'w-[900px]',
      full: 'w-[calc(100vw-2rem)]',
    },
    padding: {
      none: '',
      sm: 'p-2',
      md: 'p-3',
    },
  },
  defaultVariants: {
    width: 'lg',
    padding: 'md',
  },
});

export interface NavPanelProps extends React.ComponentPropsWithoutRef<'div'> {
  width?: 'sm' | 'md' | 'lg' | 'full';
  padding?: 'none' | 'sm' | 'md';
}

export function NavPanel({
  width,
  padding,
  className,
  ...props
}: NavPanelProps) {
  return (
    <div
      className={cn(navPanelVariants({ width, padding }), className)}
      {...props}
    />
  );
}

// Simple list layout
export function NavSimpleList({
  title,
  items,
}: {
  title?: React.ReactNode;
  items: { href: string; label: string; description?: string }[];
}) {
  return (
    <div>
      {title && <div className="mb-2 text-base font-semibold">{title}</div>}
      <ul className="grid w-[280px] gap-2">
        {items.map((it) => (
          <li key={it.href}>
            <NavigationMenuLink asChild>
              <a
                href={it.href}
                className="hover:bg-accent block rounded-md p-2"
              >
                <div className="text-base font-medium">{it.label}</div>
                {it.description && (
                  <div className="text-muted-foreground line-clamp-2 text-sm">
                    {it.description}
                  </div>
                )}
              </a>
            </NavigationMenuLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Columns layout
export function NavColumns({
  columns,
}: {
  columns: {
    title?: string;
    items: { href: string; label: string; description?: string }[];
  }[];
}) {
  return (
    <div className="grid w-[500px] grid-cols-2 gap-3">
      {columns.map((col, idx) => (
        <div key={idx}>
          {col.title && (
            <div className="text-muted-foreground mb-2 text-base font-semibold">
              {col.title}
            </div>
          )}
          <ul className="grid gap-2">
            {col.items.map((it) => (
              <li key={it.href}>
                <NavigationMenuLink asChild>
                  <a
                    href={it.href}
                    className="hover:bg-accent block rounded-md p-2"
                  >
                    <div className="text-base font-medium">{it.label}</div>
                    {it.description && (
                      <div className="text-muted-foreground line-clamp-2 text-sm">
                        {it.description}
                      </div>
                    )}
                  </a>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Categorized with preview layout
export function NavCategorizedWithPreview({
  categories,
  modules,
  activeCategory,
  setActiveCategory,
  activeKey,
  setActiveKey,
  preview,
}: {
  categories: { key: string; label: string }[];
  modules: {
    key: string;
    title: string;
    description?: string;
    categories: string[];
  }[];
  activeCategory: string;
  setActiveCategory: (k: string) => void;
  activeKey: string | null;
  setActiveKey: (k: string | null) => void;
  preview: React.ReactNode;
}) {
  const visible = React.useMemo(
    () =>
      modules.filter(
        (m) => activeCategory === 'all' || m.categories.includes(activeCategory)
      ),
    [modules, activeCategory]
  );

  return (
    <div className="flex items-start gap-3">
      <div className="max-h-96 w-48 shrink-0 overflow-auto pr-1">
        <button
          className={`hover:bg-muted w-full rounded-md px-3 py-2 text-left text-base transition-colors ${
            activeCategory === 'all' ? 'bg-muted' : ''
          }`}
          onMouseEnter={() => setActiveCategory('all')}
          onFocus={() => setActiveCategory('all')}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.key}
            className={`hover:bg-muted w-full rounded-md px-3 py-2 text-left text-base transition-colors ${
              activeCategory === c.key ? 'bg-muted' : ''
            }`}
            onMouseEnter={() => setActiveCategory(c.key)}
            onFocus={() => setActiveCategory(c.key)}
            onClick={() => setActiveCategory(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="grid max-h-96 flex-1 grid-cols-1 gap-1 overflow-auto pr-1">
        {visible.map((m) => (
          <NavigationMenuLink asChild key={m.key}>
            <a
              href={`/modules/${m.key}`}
              className="hover:bg-muted rounded-md px-3 py-2 text-left transition-colors"
              onMouseEnter={() => setActiveKey(m.key)}
              onFocus={() => setActiveKey(m.key)}
            >
              <div className="text-base font-medium">{m.title}</div>
              {m.description && (
                <div className="text-muted-foreground line-clamp-2 text-sm">
                  {m.description}
                </div>
              )}
            </a>
          </NavigationMenuLink>
        ))}
      </div>
      <div className="w-[320px] shrink-0">{preview}</div>
    </div>
  );
}

export {
  NavigationMenu as NavRoot,
  NavigationMenuList as NavList,
  NavigationMenuItem as NavItem,
  NavigationMenuTrigger as NavTrigger,
  NavigationMenuContent as NavContent,
  NavigationMenuLink as NavLink,
};
