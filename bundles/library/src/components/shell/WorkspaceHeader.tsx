import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@contractspec/lib.ui-kit-web/ui/select';

export interface ShellSelectOption {
  value: string;
  label: string;
}

export interface ShellSelect {
  label: string;
  value: string;
  options: ShellSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface WorkspaceHeaderProps {
  title: string;
  subtitle?: string;
  workspaceSelect?: ShellSelect;
  projectSelect?: ShellSelect;
  environmentSelect?: ShellSelect;
  stickyHeaderOffsetPx?: number;
  headerRight?: React.ReactNode;
}

export function WorkspaceHeader({
  title,
  subtitle,
  workspaceSelect,
  projectSelect,
  environmentSelect,
  stickyHeaderOffsetPx,
  headerRight,
}: WorkspaceHeaderProps) {
  return (
    <div
      className="border-border bg-card sticky top-0 z-10 border-b"
      style={{ top: stickyHeaderOffsetPx ?? 0 }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-base font-semibold">{title}</p>
            {subtitle ? (
              <p className="text-muted-foreground hidden text-sm md:block">
                {subtitle}
              </p>
            ) : null}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {workspaceSelect ? (
              <ShellSelectControl select={workspaceSelect} />
            ) : null}
            {projectSelect ? (
              <ShellSelectControl select={projectSelect} />
            ) : null}
            {environmentSelect ? (
              <ShellSelectControl select={environmentSelect} />
            ) : null}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 md:justify-end">
          {headerRight}
        </div>
      </div>
    </div>
  );
}

function ShellSelectControl({ select }: { select: ShellSelect }) {
  const labelId = React.useId();
  return (
    <div className="flex min-w-[220px] flex-col gap-1">
      <span id={labelId} className="text-muted-foreground text-xs">
        {select.label}
      </span>
      <Select value={select.value} onValueChange={select.onChange}>
        <SelectTrigger aria-labelledby={labelId} className="w-full">
          <SelectValue placeholder={select.placeholder ?? select.label} />
        </SelectTrigger>
        <SelectContent>
          {select.options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
