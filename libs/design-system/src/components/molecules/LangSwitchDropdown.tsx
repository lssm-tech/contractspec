import * as React from 'react';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@contractspec/lib.ui-kit-web/ui/dropdown-menu';

export interface LangOption {
  code: string;
  label: React.ReactNode;
}

export function LangSwitchDropdown({
  value,
  options,
  onChange,
  className,
}: {
  value: string;
  options: LangOption[];
  onChange: (code: string) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const current = options.find((o) => o.code === value);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={className}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="hover:bg-muted/40 inline-flex items-center gap-2 rounded-xs border px-2 py-1 text-sm">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {current?.label ?? value.toUpperCase()}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {options.map((opt) => (
          <DropdownMenuItem key={opt.code} onClick={() => onChange(opt.code)}>
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
